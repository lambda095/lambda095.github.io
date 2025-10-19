// Study Dropdown: Show right info for selected/hovered left link
document.addEventListener('DOMContentLoaded', function() {
    var studyDropdown = document.querySelector('.study-dropdown');
    if (studyDropdown) {
        var links = studyDropdown.querySelectorAll('.study-link');
        var rightInfo = document.getElementById('study-right-info');

        // Hide right column by default
        rightInfo.style.display = 'none';

        // When the entire dropdown is hovered, show it. Hide when leaving the dropdown.
        var parentDropdown = document.querySelector('.dropdown');
        if (parentDropdown) {
            parentDropdown.addEventListener('mouseenter', function() {
                parentDropdown.setAttribute('aria-expanded', 'true');
                // show dropdown (CSS handles display via :hover, JS keeps aria state)
                rightInfo.style.display = 'flex';
            });

            parentDropdown.addEventListener('mouseleave', function() {
                parentDropdown.setAttribute('aria-expanded', 'false');
                rightInfo.style.display = 'none';
                links.forEach(function(l) { l.classList.remove('active'); });
            });
        }

        // Add hover state on each left link to highlight and populate right panel if needed
        links.forEach(function(link) {
            link.addEventListener('mouseenter', function() {
                links.forEach(function(l) { l.classList.remove('active'); });
                link.classList.add('active');
                // Right panel remains visible while hovering the dropdown (handled above)
            });
        });
    }
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
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.read-more').style.color = '#e2001a';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.read-more').style.color = '';
        });
    });
    

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
