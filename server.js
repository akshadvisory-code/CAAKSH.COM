const path = require('path');
const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const port = process.env.PORT || 5500;
const db = new DatabaseSync(path.join(__dirname, 'taxdesk.db'));
const sessionDuration = 1000 * 60 * 60 * 24 * 7;

app.use(express.json());
app.use(express.static(__dirname));

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        label TEXT NOT NULL,
        published_at TEXT NOT NULL,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        icon TEXT NOT NULL,
        source TEXT NOT NULL,
        url TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS source_checks (
        source_key TEXT PRIMARY KEY,
        content_hash TEXT,
        checked_at TEXT NOT NULL
    );
`);

const updateCount = db.prepare('SELECT COUNT(*) AS count FROM updates').get().count;
if (updateCount === 0) {
    const addUpdate = db.prepare(`INSERT INTO updates
        (category, label, published_at, title, summary, icon, source, url)
        VALUES (@category, @label, @published_at, @title, @summary, @icon, @source, @url)`);
    const seedUpdates = [
        {
            category: 'direct', label: 'Direct Tax', published_at: '22 Aug 2026',
            title: 'Income Tax Department publishes latest taxpayer updates',
            summary: 'Check the official latest-news feed for current filing guidance, campaigns, and taxpayer services.',
            icon: 'fa-arrow-trend-up', source: 'Open CBDT update', url: 'https://www.incometax.gov.in/iec/foportal/latest-news'
        },
        {
            category: 'indirect', label: 'Indirect Tax', published_at: '20 Aug 2026',
            title: 'CBIC publishes new customs and indirect-tax notices',
            summary: 'Review the CBIC news and notifications feed for current GST, customs, and compliance announcements.',
            icon: 'fa-receipt', source: 'Open CBIC update', url: 'https://www.cbic.gov.in/'
        },
        {
            category: 'indirect', label: 'Rajasthan Tax', published_at: '13 Aug 2026',
            title: 'Rajasthan issues notifications under the RVAT Act, 2025',
            summary: 'The Rajasthan Finance Department has published recent Commercial Taxes notifications covering RVAT rules and tax administration.',
            icon: 'fa-landmark', source: 'Open Rajasthan notice', url: 'https://finance.rajasthan.gov.in/PDFDOCS/TAX/CCT/15123.pdf'
        }
    ];
    db.exec('BEGIN');
    try {
        seedUpdates.forEach(item => addUpdate.run(item));
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
}

const sources = [
    { key: 'cbdt', label: 'CBDT / Income Tax', url: 'https://www.incometax.gov.in/iec/foportal/latest-news' },
    { key: 'cbic', label: 'CBIC', url: 'https://www.cbic.gov.in/' },
    { key: 'rajasthan', label: 'Rajasthan Finance', url: 'https://finance.rajasthan.gov.in/' }
];

function tokenFor(userId) {
    const token = crypto.randomBytes(32).toString('hex');
    db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, userId, Date.now() + sessionDuration);
    return token;
}

function currentUser(request) {
    const token = request.get('Authorization')?.replace('Bearer ', '');
    if (!token) return null;
    const session = db.prepare(`SELECT users.id, users.user_id FROM sessions JOIN users ON users.id = sessions.user_id
        WHERE sessions.token = ? AND sessions.expires_at > ?`).get(token, Date.now());
    return session || null;
}

function requireUser(request, response, next) {
    const user = currentUser(request);
    if (!user) return response.status(401).json({ error: 'Please sign in to continue.' });
    request.user = user;
    next();
}

app.post('/api/auth/signup', (request, response) => {
    const userId = String(request.body.userId || '').trim();
    const password = String(request.body.password || '');
    if (!/^[a-zA-Z0-9_.-]{4,30}$/.test(userId) || password.length < 6) {
        return response.status(400).json({ error: 'Use a User ID of 4-30 letters/numbers and a password of at least 6 characters.' });
    }
    try {
        const result = db.prepare('INSERT INTO users (user_id, password_hash) VALUES (?, ?)').run(userId, bcrypt.hashSync(password, 12));
        const token = tokenFor(result.lastInsertRowid);
        response.status(201).json({ token, userId });
    } catch (error) {
        response.status(409).json({ error: 'That User ID is already registered.' });
    }
});

app.post('/api/auth/login', (request, response) => {
    const userId = String(request.body.userId || '').trim();
    const account = db.prepare('SELECT id, user_id, password_hash FROM users WHERE user_id = ?').get(userId);
    if (!account || !bcrypt.compareSync(String(request.body.password || ''), account.password_hash)) {
        return response.status(401).json({ error: 'That User ID or password does not match.' });
    }
    response.json({ token: tokenFor(account.id), userId: account.user_id });
});

app.post('/api/auth/logout', requireUser, (request, response) => {
    const token = request.get('Authorization')?.replace('Bearer ', '');
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    response.status(204).end();
});

app.get('/api/updates', requireUser, (request, response) => {
    const category = request.query.category;
    const updates = category && ['direct', 'indirect'].includes(category)
        ? db.prepare('SELECT * FROM updates WHERE category = ? ORDER BY id DESC').all(category)
        : db.prepare('SELECT * FROM updates ORDER BY id DESC').all();
    response.json({ updates, checkedAt: new Date().toISOString(), sources });
});

app.get('/api/source-status', requireUser, (request, response) => {
    response.json(sources.map(source => ({ ...source, lastChecked: db.prepare('SELECT checked_at FROM source_checks WHERE source_key = ?').get(source.key)?.checked_at || null })));
});

async function checkOfficialSources() {
    for (const source of sources) {
        try {
            const result = await fetch(source.url, { headers: { 'User-Agent': 'Aksh-Co-TaxDesk/1.0' } });
            const body = await result.text();
            const hash = crypto.createHash('sha256').update(body).digest('hex');
            const previous = db.prepare('SELECT content_hash FROM source_checks WHERE source_key = ?').get(source.key);
            const checkedAt = new Date().toISOString();
            db.prepare(`INSERT INTO source_checks (source_key, content_hash, checked_at) VALUES (?, ?, ?)
                ON CONFLICT(source_key) DO UPDATE SET content_hash = excluded.content_hash, checked_at = excluded.checked_at`)
                .run(source.key, hash, checkedAt);
            if (previous && previous.content_hash !== hash) {
                db.prepare(`INSERT INTO updates (category, label, published_at, title, summary, icon, source, url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
                    source.key === 'cbdt' ? 'direct' : 'indirect', source.label, checkedAt.slice(0, 10),
                    `${source.label} source has been updated`, 'A change was detected on the official government source. Open it to review the latest notification.', 'fa-bell', `Open ${source.label}`, source.url
                );
            }
        } catch (error) {
            console.error(`Source check failed for ${source.label}:`, error.message);
        }
    }
}

checkOfficialSources();
setInterval(checkOfficialSources, 1000 * 60 * 60 * 6);

app.listen(port, () => console.log(`Aksh & Co. Tax Desk running at http://localhost:${port}`));
