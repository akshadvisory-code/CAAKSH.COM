/* ============================================
   AKSH & CO. - Chartered Accountants
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // Rajasthan Investment Promotion Scheme 2024 industry templates
    const subsidyIndustries = {
        manufacturing: [
            'Auto, Auto Component & EV', 'Petrochemicals (including ancillary)', 'Chemicals',
            'Textiles, Apparels & Garments', 'Mineral Processing & Ceramics', 'ESDM',
            'Renewable Manufacturing', 'Agri & Food Processing', 'Glass', 'Dairy', 'Pharmaceuticals',
            'Industrial Gases', 'Leather, Footwear & Accessories', 'Gems & Jewellery', 'Handicrafts',
            'Sports Goods', 'Toys', 'Metals', 'Construction Equipment', 'Pumped Hydro Storage Manufacturing',
            'Electrolyzer Manufacturing'
        ],
        services: [
            'IT & ITeS', 'Tourism', 'Fintech', 'Entertainment', 'Film City', 'Common Utility Center',
            'Plug & Play Office Complex', 'Social Infrastructure', 'Healthcare', 'Civil Aviation',
            'Sports Academy', 'AVGC-XR', 'Higher Education', 'Vocational Training & Skilling',
            'Knowledge Based Industries'
        ],
        power: [
            'Solar Cell Manufacturing', 'New Battery Technology', 'Printed Circuit Board Manufacturing',
            'Semiconductor Manufacturing', 'Textiles', 'Ceramics', 'Glass', 'Data Centre'
        ]
    };

    const subsidyCategoryLabels = {
        manufacturing: 'Manufacturing Thrust Sector',
        services: 'Services Thrust Sector',
        power: 'Power-Intensive Sector'
    };

    const subsidyCategoryIcons = {
        manufacturing: 'fa-industry',
        services: 'fa-briefcase',
        power: 'fa-bolt'
    };

    const subsidyBenefits = {
        manufacturing: {
            title: 'Manufacturing subsidy types and amounts',
            items: [
                'Investment Subsidy: 75% reimbursement of state tax due and deposited for 7 years; annual ceiling INR 50 Cr. for years 1-3 and INR 65 Cr. for years 4-7.',
                'Capital Subsidy: 13%-28% of EFCI based on project and area category, paid over 10 years; annual ceilings INR 50 Cr. (years 1-3), INR 65 Cr. (years 4-7), and INR 80 Cr. (years 8-10).',
                'Turnover-Linked Incentive: 1.20%-2.00% of net sales turnover based on project and area category, paid for 10 years; annual ceilings INR 50 Cr., INR 65 Cr., and INR 80 Cr. by payout period.',
                'Top-ups: Employment Booster 10%, 12.5%, or 15%; Thrust Booster 10%; Anchor Booster 20%; Interest Subvention 5% for 5 years, subject to the policy cap.'
            ]
        },
        services: {
            title: 'Services subsidy types and amounts',
            items: [
                'Investment Subsidy: 75% reimbursement of state tax due and deposited for 7 years; annual ceiling INR 10 Cr. for years 1-3 and INR 15 Cr. for years 4-7.',
                'Capital Subsidy: 10%-20% of EFCI based on project and area category, paid over 10 years; annual ceilings INR 10 Cr. (years 1-3), INR 15 Cr. (years 4-7), and INR 20 Cr. (years 8-10).',
                'Turnover-Linked Incentive: 1.0%-1.4% of net sales turnover based on project and area category, paid for 10 years; annual ceilings INR 10 Cr., INR 15 Cr., and INR 20 Cr. by payout period.',
                'Top-ups: Employment Booster 10%, 12.5%, or 15%; Thrust Booster 10%; Anchor Booster 20% subject to policy ceilings.'
            ]
        },
        power: {
            title: 'Power-intensive subsidy types and amounts',
            items: [
                'Additional reimbursement: 5% of state tax due and deposited for 7 years, or 5 percentage-point VAT reimbursement on PNG for 7 years.',
                'Base asset-creation incentive: eligible enterprises use the manufacturing package and may choose Investment Subsidy, Capital Subsidy, or Turnover-Linked Incentive.',
                'Captive renewable power: 51% of eligible captive investment may be included in EFCI; 100% may apply for qualifying group-captive agreements of 12 years or more.',
                'Other benefits: special incentives remain subject to the applicable project category, area category, annual ceilings, and policy conditions.'
            ]
        }
    };

    const subsidyTabs = document.querySelectorAll('[data-subsidy-category]');
    const subsidyIndustry = document.getElementById('subsidyIndustry');
    const subsidyIndustryTabs = document.getElementById('subsidyIndustryTabs');
    const subsidyTemplate = document.getElementById('subsidyTemplate');
    let selectedSubsidyCategory = 'manufacturing';

    function renderSubsidyTemplate(industry, category) {
        const benefit = subsidyBenefits[category];
        subsidyTemplate.innerHTML = `
            <div class="subsidy-template-header">
                <div class="subsidy-template-icon"><i class="fas ${subsidyCategoryIcons[category]}"></i></div>
                <div><span>${subsidyCategoryLabels[category]}</span><h3>${industry}</h3></div>
            </div>
            <div class="subsidy-benefits">
                <h4>${benefit.title}</h4>
                <ul>${benefit.items.map(item => `<li><i class="fas fa-check"></i>${item}</li>`).join('')}</ul>
            </div>
            <div class="subsidy-template-grid">
                <div><span class="subsidy-label">Policy fit</span><strong>${industry} is listed as a ${category} sector under RIPS 2024.</strong></div>
                <div><span class="subsidy-label">Project review</span><strong>Investment, eligible fixed capital, location, employment, and production plans are reviewed.</strong></div>
                <div><span class="subsidy-label">Application support</span><strong>Eligibility mapping, project report, document checklist, and entitlement application support.</strong></div>
                <div><span class="subsidy-label">Aksh & Co. support</span><strong>Tax, accounting, financial modelling, subsidy documentation, and compliance coordination.</strong></div>
            </div>
            <a class="btn btn-primary subsidy-cta" href="#contact">Discuss ${industry} project <i class="fas fa-arrow-right"></i></a>
        `;
    }

    function renderSubsidyIndustry(category) {
        selectedSubsidyCategory = category;
        const industries = subsidyIndustries[category];
        subsidyIndustry.innerHTML = industries.map((industry, index) => `<option value="${index}">${industry}</option>`).join('');
        subsidyIndustryTabs.innerHTML = industries.map((industry, index) => `<button type="button" class="subsidy-industry-tab${index === 0 ? ' active' : ''}" data-subsidy-industry="${index}">${industry}</button>`).join('');
        renderSubsidyTemplate(industries[0], category);
    }

    subsidyTabs.forEach(tab => tab.addEventListener('click', () => {
        subsidyTabs.forEach(item => item.classList.remove('active'));
        tab.classList.add('active');
        renderSubsidyIndustry(tab.dataset.subsidyCategory);
    }));

    subsidyIndustry.addEventListener('change', () => {
        const index = Number(subsidyIndustry.value);
        subsidyIndustryTabs.querySelectorAll('.subsidy-industry-tab').forEach((tab, tabIndex) => tab.classList.toggle('active', tabIndex === index));
        renderSubsidyTemplate(subsidyIndustries[selectedSubsidyCategory][index], selectedSubsidyCategory);
    });

    subsidyIndustryTabs.addEventListener('click', event => {
        const tab = event.target.closest('[data-subsidy-industry]');
        if (!tab) return;
        const index = Number(tab.dataset.subsidyIndustry);
        subsidyIndustry.value = index;
        subsidyIndustryTabs.querySelectorAll('.subsidy-industry-tab').forEach(item => item.classList.toggle('active', item === tab));
        renderSubsidyTemplate(subsidyIndustries[selectedSubsidyCategory][index], selectedSubsidyCategory);
    });

    renderSubsidyIndustry(selectedSubsidyCategory);

    // ==========================================
    // PRELOADER
    // ==========================================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            startHeroAnimations();
        }, 2000);
    });

    // Fallback: hide preloader after 3s max
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 3000);

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link:not(.cta-btn)');
    const sections = document.querySelectorAll('section[id]');

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Active nav link based on scroll position
    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        updateActiveNav();
        handleBackToTop();
        handleScrollAnimations();
    });

    // ==========================================
    // MOBILE MENU
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    let overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : 'auto';
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close menu on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPos = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ==========================================
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    function handleScrollAnimations() {
        // Additional scroll-based animations handled by intersection observer
    }

    // ==========================================
    // HERO ANIMATIONS (after preloader)
    // ==========================================
    function startHeroAnimations() {
        // Animate hero elements
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');

        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 200);
        }

        if (heroVisual) {
            heroVisual.style.opacity = '0';
            heroVisual.style.transform = 'translateX(30px)';
            heroVisual.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';
            setTimeout(() => {
                heroVisual.style.opacity = '1';
                heroVisual.style.transform = 'translateX(0)';
            }, 200);
        }

        // Start counter animation
        animateCounters();
    }

    // Hero highlight flow
    const heroSlides = document.querySelectorAll('.hero-flow-slide');
    const heroDots = document.querySelectorAll('[data-hero-slide]');
    const heroFlow = document.querySelector('.hero-flow');
    let heroSlideIndex = 0;
    let heroTimer;

    function showHeroSlide(index) {
        if (!heroSlides.length) return;
        heroSlideIndex = (index + heroSlides.length) % heroSlides.length;
        heroSlides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === heroSlideIndex));
        heroDots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === heroSlideIndex));
    }

    function restartHeroTimer() {
        clearInterval(heroTimer);
        heroTimer = setInterval(() => showHeroSlide(heroSlideIndex + 1), 5200);
    }

    document.querySelectorAll('[data-hero-flow]').forEach(button => {
        button.addEventListener('click', () => {
            showHeroSlide(heroSlideIndex + (button.dataset.heroFlow === 'next' ? 1 : -1));
            restartHeroTimer();
        });
    });

    heroDots.forEach(dot => {
        dot.addEventListener('click', () => {
            showHeroSlide(parseInt(dot.dataset.heroSlide, 10));
            restartHeroTimer();
        });
    });

    if (heroFlow) {
        heroFlow.addEventListener('mouseenter', () => clearInterval(heroTimer));
        heroFlow.addEventListener('mouseleave', restartHeroTimer);
        restartHeroTimer();
    }

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * easeOut);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // ==========================================
    // TESTIMONIAL SLIDER
    // ==========================================
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('testimonialDots');
    const cards = track ? track.querySelectorAll('.testimonial-card') : [];

    let currentSlide = 0;
    let cardsPerView = getCardsPerView();
    let totalSlides = Math.ceil(cards.length / cardsPerView);

    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('t-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateSlider() {
        if (!track) return;
        const cardWidth = cards[0].offsetWidth;
        const gap = 28; // matches CSS gap
        const offset = currentSlide * (cardWidth + gap) * cardsPerView;
        track.style.transform = `translateX(-${offset}px)`;

        // Update dots
        const dots = dotsContainer.querySelectorAll('.t-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // Auto-slide
    let autoSlide = setInterval(nextSlide, 4000);

    // Pause on hover
    if (track) {
        track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
        track.parentElement.addEventListener('mouseleave', () => {
            autoSlide = setInterval(nextSlide, 4000);
        });
    }

    // Handle resize
    window.addEventListener('resize', () => {
        cardsPerView = getCardsPerView();
        totalSlides = Math.ceil(cards.length / cardsPerView);
        currentSlide = Math.min(currentSlide, totalSlides - 1);
        createDots();
        updateSlider();
    });

    createDots();
    updateSlider();

    // ==========================================
    // CONTACT FORM
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                // Hide form, show success
                contactForm.style.display = 'none';
                formSuccess.classList.add('show');

                // Reset form after 4 seconds
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.style.display = 'block';
                    formSuccess.classList.remove('show');
                }, 4000);
            }, 1500);
        });
    }

    // ==========================================
    // TAX DESK ACCOUNT (API-backed)
    // ==========================================
    const accountTabs = document.querySelectorAll('[data-account-tab]');
    const accountForms = document.querySelectorAll('.account-form');
    const accountPanel = document.getElementById('accountPanel');
    const updatesPanel = document.getElementById('updatesPanel');
    const updatesList = document.getElementById('updatesList');
    const welcomeUser = document.getElementById('welcomeUser');
    const tokenKey = 'akshCoTaxDeskToken';

    async function apiRequest(url, options = {}) {
        const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
        const token = localStorage.getItem(tokenKey);
        if (token) headers.Authorization = `Bearer ${token}`;
        const response = await fetch(url, { ...options, headers });
        const data = response.status === 204 ? null : await response.json();
        if (!response.ok) throw new Error(data?.error || 'Something went wrong. Please try again.');
        return data;
    }

    function showAccountMessage(elementId, message, isError = false) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.classList.toggle('error', isError);
        }
    }

    function renderUpdates(updates) {
        if (!updatesList) return;
        updatesList.innerHTML = updates.map(update => `
            <article class="update-card" data-update-category="${update.category}">
                <div class="update-icon"><i class="fas ${update.icon}"></i></div>
                <div class="update-copy">
                    <div class="update-meta"><span>${update.label}</span><time>${update.published_at}</time></div>
                    <h4>${update.title}</h4>
                    <p>${update.summary}</p>
                    <a class="update-source" href="${update.url}" target="_blank" rel="noopener">${update.source} <i class="fas fa-arrow-up-right-from-square"></i></a>
                </div>
            </article>
        `).join('');
    }

    async function loadUpdates(filter = 'all') {
        try {
            const data = await apiRequest(`/api/updates${filter === 'all' ? '' : `?category=${filter}`}`);
            renderUpdates(data.updates);
        } catch (error) {
            showAccountMessage('loginMessage', error.message, true);
        }
    }

    function showUpdates(userId) {
        if (!accountPanel || !updatesPanel) return;
        accountPanel.hidden = true;
        updatesPanel.hidden = false;
        welcomeUser.textContent = userId;
        loadUpdates();
    }

    function showAccountPanel() {
        if (!accountPanel || !updatesPanel) return;
        accountPanel.hidden = false;
        updatesPanel.hidden = true;
    }

    accountTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            accountTabs.forEach(item => item.classList.toggle('active', item === tab));
            accountForms.forEach(form => form.classList.toggle('active', form.id === `${tab.dataset.accountTab}Form`));
        });
    });

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const userId = document.getElementById('signupUserId').value.trim();
            const password = document.getElementById('signupPassword').value;
            try {
                const data = await apiRequest('/api/auth/signup', { method: 'POST', body: JSON.stringify({ userId, password }) });
                localStorage.setItem(tokenKey, data.token);
                signupForm.reset();
                showUpdates(data.userId);
            } catch (error) {
                showAccountMessage('signupMessage', error.message, true);
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const userId = document.getElementById('loginUserId').value.trim();
            const password = document.getElementById('loginPassword').value;
            try {
                const data = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ userId, password }) });
                localStorage.setItem(tokenKey, data.token);
                loginForm.reset();
                showUpdates(data.userId);
            } catch (error) {
                showAccountMessage('loginMessage', error.message, true);
            }
        });
    }

    document.querySelectorAll('[data-update-filter]').forEach(filterButton => {
        filterButton.addEventListener('click', () => {
            document.querySelectorAll('[data-update-filter]').forEach(item => item.classList.toggle('active', item === filterButton));
            loadUpdates(filterButton.dataset.updateFilter);
        });
    });

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try { await apiRequest('/api/auth/logout', { method: 'POST' }); } catch (error) { /* Session may already be expired. */ }
            localStorage.removeItem(tokenKey);
            showAccountPanel();
        });
    }

    if (localStorage.getItem(tokenKey)) {
        apiRequest('/api/updates')
            .then(() => showUpdates('client'))
            .catch(() => localStorage.removeItem(tokenKey));
    }

    // ==========================================
    // BACK TO TOP
    // ==========================================
    const backToTop = document.getElementById('backToTop');

    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // TILT EFFECT ON SERVICE CARDS (desktop only)
    // ==========================================
    if (window.innerWidth > 1024) {
        const serviceCards = document.querySelectorAll('.service-card');

        serviceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ==========================================
    // TYPING EFFECT ON HERO (optional)
    // ==========================================
    const gradientText = document.querySelector('.gradient-text');
    if (gradientText) {
        const texts = ['Tax & Financial', 'GST & Compliance', 'Audit & Advisory'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingTimeout;

        function typeText() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                charIndex--;
                gradientText.textContent = currentText.substring(0, charIndex);
            } else {
                charIndex++;
                gradientText.textContent = currentText.substring(0, charIndex);
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            typingTimeout = setTimeout(typeText, typeSpeed);
        }

        // Start typing after a delay
        setTimeout(typeText, 2500);
    }

    // ==========================================
    // PARALLAX ON HERO SHAPES
    // ==========================================
    const shapes = document.querySelectorAll('.shape');

    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;

        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 15;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });

    // ==========================================
    // RIPPLE EFFECT ON BUTTONS
    // ==========================================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                left: ${e.clientX - rect.left - size/2}px;
                top: ${e.clientY - rect.top - size/2}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframes
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to { transform: scale(2.5); opacity: 0; }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ==========================================
    // COUNTER ANIMATION ON SCROLL
    // ==========================================
    let countersAnimated = false;

    function checkCountersInView() {
        if (countersAnimated) return;
        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;
            // Counters already animate in startHeroAnimations
        }
    }

    // ==========================================
    // KEYBOARD NAVIGATION FOR TESTIMONIALS
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // ==========================================
    // TOUCH SWIPE FOR TESTIMONIALS
    // ==========================================
    let touchStartX = 0;
    let touchEndX = 0;

    if (track) {
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
        }, { passive: true });
    }

    console.log('🏢 Aksh & Co. Website Loaded Successfully!');
});
