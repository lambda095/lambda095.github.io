// Study Dropdown: Show right info for selected/hovered left link
document.addEventListener('DOMContentLoaded', function() {
    // Handle dropdowns with left/right panels: show right panel only when a left link is hovered
    document.querySelectorAll('.dropdown').forEach(function(dropdown) {
        var studyDropdown = dropdown.querySelector('.study-dropdown');
        if (!studyDropdown) return; // no left/right panel in this dropdown

        var links = studyDropdown.querySelectorAll('.study-link');
        var rightInfo = dropdown.querySelector('.study-right');
        if (rightInfo) rightInfo.style.display = 'none';

        // When hovering or focusing a left link, activate it and show corresponding right panel
        links.forEach(function(link, idx) {
            function activate() {
                links.forEach(function(l) { l.classList.remove('active'); });
                link.classList.add('active');
                if (rightInfo) {
                    rightInfo.style.display = 'flex';
                    // highlight the corresponding right link if present
                    var rightLinks = rightInfo.querySelectorAll('.study-right-link');
                    rightLinks.forEach(function(rl, i) { rl.classList.toggle('active', i === idx); });
                }
            }
            link.addEventListener('mouseenter', activate);
            link.addEventListener('focus', activate);
        });

        // Hide right panel when leaving the dropdown entirely
        dropdown.addEventListener('mouseleave', function() {
            if (rightInfo) rightInfo.style.display = 'none';
            links.forEach(function(l) { l.classList.remove('active'); });
        });
        // Also hide when focus leaves (accessibility)
        dropdown.addEventListener('focusout', function(e) {
            // if focus moves outside the dropdown
            if (!dropdown.contains(e.relatedTarget)) {
                if (rightInfo) rightInfo.style.display = 'none';
                links.forEach(function(l) { l.classList.remove('active'); });
            }
        });
    });
});

// Register service worker for caching (if supported)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(reg) {
            console.log('Service worker registered.', reg.scope);

            // Helper: show the update banner and wire the button to activate the new SW
            function showUpdateBanner(worker) {
                try {
                    const banner = document.getElementById('updateBanner');
                    const btn = document.getElementById('btnUpdate');
                    if (!banner) return;
                    // Reveal the banner (HTML/CSS controls presentation)
                    banner.style.display = 'block';

                    if (!btn) return;

                    // Only attach one handler
                    if (btn.__sw_bound) return;
                    btn.__sw_bound = true;

                    btn.addEventListener('click', function() {
                        // Disable button to prevent double clicks
                        btn.disabled = true;
                        // First ask the waiting worker to clear image caches (narrow scope)
                        try { worker.postMessage({ type: 'CLEAR_CACHES' }); } catch (e) {}
                        // Then tell it to skipWaiting and become active
                        try { worker.postMessage({ type: 'SKIP_WAITING' }); } catch (e) {}
                    });
                } catch (e) {
                    // non-fatal
                    console.warn('Could not show update banner', e);
                }
            }

            // If there's already a waiting worker (page was loaded with an update pending), show UI
            if (reg.waiting) {
                showUpdateBanner(reg.waiting);
            }

            // When a new worker is found, show the banner when it reaches 'installed'
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                if (!newWorker) return;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // A new update is available
                        showUpdateBanner(newWorker);
                    }
                });
            });

        }).catch(function(err) {
            console.warn('Service worker registration failed:', err);
        });
    });
}

// When the active service worker changes (new SW takes control), reload once
if ('serviceWorker' in navigator) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
    });
}

// Listen for messages from the service worker (e.g., CLEAR_DONE)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', function(event) {
        if (!event.data) return;
        if (event.data.type === 'CLEAR_DONE') {
            // Re-enable the update button if present
            try {
                const btn = document.getElementById('btnUpdate');
                if (btn) btn.disabled = false;
            } catch (e) {}
            // If the new worker already became controller, reload (controllerchange usually handles this)
            // keep this as a fallback: small timeout to allow controllerchange to fire first
            setTimeout(() => {
                if (navigator.serviceWorker.controller) {
                    window.location.reload();
                }
            }, 250);
        }
    });
}
// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle would be added here
    // For now, this is a placeholder for future functionality
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // News item hover effect enhancement
    // NOTE: removed inline color changes here so the CSS rules control the
    // `.read-more` color consistently (prevents JS from forcing a red color on hover).
    // Previously this code set inline styles which overrode CSS hover behavior.
    

    // ========================
    // NEW DROPDOWN NAVIGATION CODE
    // ========================
    // Support hover to open dropdown on desktop and click for accessibility on touch
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const trigger = dropdown.querySelector('> a');
        // Hover opens dropdown
        dropdown.addEventListener('mouseenter', function() {
            dropdown.setAttribute('aria-expanded', 'true');
        });
        dropdown.addEventListener('mouseleave', function() {
            dropdown.setAttribute('aria-expanded', 'false');
        });
        // Keyboard support for trigger
        trigger.addEventListener('keydown', function(e) {
            // Enter or Space toggles
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isExpanded = dropdown.getAttribute('aria-expanded') === 'true';
                dropdown.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
                if (!isExpanded) {
                    // focus first link inside dropdown
                    const first = dropdown.querySelector('.study-link');
                    if (first) first.focus();
                }
            }
            // Escape closes
            if (e.key === 'Escape') {
                dropdown.setAttribute('aria-expanded', 'false');
                trigger.focus();
            }
        });
        // Allow arrow navigation within .study-link items
        dropdown.querySelectorAll('.study-link').forEach((link, idx, list) => {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = list[(idx + 1) % list.length];
                    if (next) next.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = list[(idx - 1 + list.length) % list.length];
                    if (prev) prev.focus();
                } else if (e.key === 'Escape') {
                    // close dropdown and return focus
                    dropdown.setAttribute('aria-expanded', 'false');
                    trigger.focus();
                }
            });
        });
        // Click toggles for touch devices
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const isExpanded = dropdown.getAttribute('aria-expanded') === 'true';
            dropdown.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.dropdown, .dropdown *')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.setAttribute('aria-expanded', 'false');
            });
        }
    });


    // Language switcher functionality would go here

    
});

// Smooth-scroll for page-specific scroll indicators
document.addEventListener('DOMContentLoaded', function() {
    var indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;
    indicator.addEventListener('click', function() {
        // find the next major section after intro-section
        var intro = document.querySelector('.intro-section');
        if (!intro) return;
        // next section (dates-events) or first section after intro
        var next = intro.nextElementSibling;
        // skip non-section nodes if necessary
        while (next && next.tagName && next.tagName.toLowerCase() !== 'section') {
            next = next.nextElementSibling;
        }
        if (!next) return;
        next.scrollIntoView({ behavior: 'smooth' });
    });
});

// Avoid layout jumps by applying a 'fonts-loaded' class once webfonts are ready
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function() {
        document.documentElement.classList.add('fonts-loaded');
    }).catch(function() {
        // ignore
    });
}

// Client-side pagination for dates/events page
(function() {
    function initDatesPagination() {
    const datesSection = document.querySelector('.dates-events');
    // Only initialize pagination on pages that explicitly opt-in via data-paginate="true"
    if (!datesSection || datesSection.getAttribute('data-paginate') !== 'true') return;

        const events = Array.from(datesSection.querySelectorAll('.event'));
        if (!events.length) return;

        const defaultPageSize = 10;
        const pageSize = parseInt(datesSection.getAttribute('data-page-size')) || defaultPageSize;
        const totalPages = Math.max(1, Math.ceil(events.length / pageSize));

        // Helper: show only events for page index (1-based)
        function showPage(page) {
            page = Math.max(1, Math.min(totalPages, page));
            events.forEach((el, idx) => {
                const pageForIdx = Math.floor(idx / pageSize) + 1;
                el.style.display = (pageForIdx === page) ? '' : 'none';
            });
            updatePaginationUI(page);
            // update url (without reloading)
            try {
                const url = new URL(window.location);
                url.searchParams.set('page', page);
                window.history.replaceState({}, '', url);
            } catch (e) {}
        }

        // Build or replace pagination nav
        function buildPagination() {
            let nav = datesSection.querySelector('.pagination');
            if (!nav) {
                nav = document.createElement('nav');
                nav.className = 'pagination';
                nav.setAttribute('aria-label', 'Event pages');
                const ul = document.createElement('ul');
                ul.className = 'pagination-list';
                nav.appendChild(ul);
                datesSection.appendChild(nav);
            }
            const ul = nav.querySelector('.pagination-list');
            ul.innerHTML = '';
            // prev
            const liPrev = document.createElement('li');
            const aPrev = document.createElement('a');
            aPrev.href = '#';
            aPrev.className = 'pagination-prev';
            aPrev.textContent = 'previous';
            liPrev.appendChild(aPrev);
            ul.appendChild(liPrev);

            // pages (show up to 7 pages with simple window)
            for (let i = 1; i <= totalPages; i++) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#';
                a.className = 'pagination-page';
                a.textContent = String(i);
                a.dataset.page = String(i);
                li.appendChild(a);
                ul.appendChild(li);
            }

            // next
            const liNext = document.createElement('li');
            const aNext = document.createElement('a');
            aNext.href = '#';
            aNext.className = 'pagination-next';
            aNext.textContent = 'next';
            liNext.appendChild(aNext);
            ul.appendChild(liNext);

            // attach handler
            ul.addEventListener('click', function(e) {
                const a = e.target.closest('a');
                if (!a) return;
                e.preventDefault();
                if (a.classList.contains('pagination-prev')) {
                    const current = ul.querySelector('a[aria-current="page"]');
                    const curPage = current ? parseInt(current.textContent) : 1;
                    showPage(curPage - 1);
                    return;
                }
                if (a.classList.contains('pagination-next')) {
                    const current = ul.querySelector('a[aria-current="page"]');
                    const curPage = current ? parseInt(current.textContent) : 1;
                    showPage(curPage + 1);
                    return;
                }
                if (a.classList.contains('pagination-page')) {
                    const p = parseInt(a.dataset.page || a.textContent) || 1;
                    showPage(p);
                    return;
                }
            });
        }

        function updatePaginationUI(activePage) {
            const nav = datesSection.querySelector('.pagination');
            if (!nav) return;
            const links = nav.querySelectorAll('.pagination-page');
            links.forEach(a => {
                if (parseInt(a.textContent) === activePage) {
                    a.setAttribute('aria-current', 'page');
                    a.classList.add('active');
                } else {
                    a.removeAttribute('aria-current');
                    a.classList.remove('active');
                }
            });
            // disable prev/next when at ends
            const prev = nav.querySelector('.pagination-prev');
            const next = nav.querySelector('.pagination-next');
            if (prev) prev.style.pointerEvents = (activePage <= 1) ? 'none' : '';
            if (next) next.style.pointerEvents = (activePage >= totalPages) ? 'none' : '';
        }

        // initial page from querystring
        function initialPage() {
            try {
                const params = new URL(window.location).searchParams;
                const p = parseInt(params.get('page')) || 1;
                return Math.max(1, Math.min(totalPages, p));
            } catch (e) { return 1; }
        }

        buildPagination();
        showPage(initialPage());
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDatesPagination);
    } else {
        initDatesPagination();
    }
})();

// Filter bar toggle (show/hide extras under the hero)
document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.getElementById('filterToggle');
    var extras = document.getElementById('filterExtras');
    if (!toggle || !extras) return;

    function setExpanded(expanded) {
        toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        if (expanded) {
            extras.hidden = false;
        } else {
            extras.hidden = true;
        }
    }

    // initialize based on attribute
    setExpanded(toggle.getAttribute('aria-expanded') === 'true');

    toggle.addEventListener('click', function() {
        var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        setExpanded(!isExpanded);
        // keep focus on the button for accessibility
        toggle.focus();
    });

    // allow closing with Escape when extras are visible
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setExpanded(false);
            toggle.focus();
        }
    });
});

// Hero dropdown behavior: left->right mapping and navigation
document.addEventListener('DOMContentLoaded', function() {
    const mapping = {
        prospective: [
            { title: 'Range of Studies Offered', href: 'studies/range.html' },
            { title: 'Choice of Study - How to Proceed?', href: 'studies/choose.html' },
            { title: 'Getting Informed and Trying Out', href: 'studies/try.html' },
            { title: 'Application Process', href: 'studies/application.html' },
            { title: 'Study Preparation', href: 'studies/prep.html' },
            { title: 'Financing', href: 'studies/finance.html' }
        ],
        student: [
            { title: 'Timetables & Exams', href: 'studies/timetables.html' },
            { title: 'Student Counselling', href: 'studies/counselling.html' }
        ],
        graduate: [
            { title: 'Masters Programmes', href: 'studies/masters.html' }
        ],
        employee: [
            { title: 'Working at VSIS', href: 'work/jobs.html' }
        ],
        international: [
            { title: 'International Admission', href: 'international/admission.html' }
        ],
        entrepreneur: [
            { title: 'Startups and Transfer', href: 'research/transfer.html' }
        ],
        citizen: [
            { title: 'Community Programmes', href: 'community/programmes.html' }
        ]
    };

    const leftItems = document.querySelectorAll('.left-item');
    const rightCol = document.getElementById('filterRight');

    function renderRight(key) {
        rightCol.innerHTML = '';
        const items = mapping[key] || [];
        const ul = document.createElement('ul');
        ul.className = 'right-list';
        items.forEach(it => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = it.href;
            a.textContent = it.title;
            a.addEventListener('click', function(e) {
                // default navigation (link exists) - ensure relative navigation works
                // no special handling here; let browser navigate
            });
            li.appendChild(a);
            ul.appendChild(li);
        });
        rightCol.appendChild(ul);
    }

    leftItems.forEach(item => {
        const key = item.getAttribute('data-key');
        item.addEventListener('mouseenter', () => {
            leftItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderRight(key);
        });
        item.addEventListener('focus', () => {
            leftItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderRight(key);
        });
        // click also activates (useful for touch)
        item.addEventListener('click', () => {
            leftItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            renderRight(key);
        });
    });

    // initialize with first item
    if (leftItems.length) {
        const firstKey = leftItems[0].getAttribute('data-key');
        leftItems[0].classList.add('active');
        renderRight(firstKey);
    }
});

