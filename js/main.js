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
            // listen for updates to the service worker
            if (reg.waiting) {
                showUpdateBanner(reg.waiting);
            }
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateBanner(newWorker);
                    }
                });
            });
        }).catch(function(err) {
            console.warn('Service worker registration failed:', err);
        });
    });
}

function showUpdateBanner(worker) {
    const banner = document.getElementById('updateBanner');
    const btn = document.getElementById('btnUpdate');
    if (!banner || !btn) return;
    banner.style.display = 'flex';
    btn.addEventListener('click', function() {
        // Ask SW to skip waiting
        if (worker && worker.postMessage) {
            worker.postMessage({ type: 'SKIP_WAITING' });
        }
        // Clear caches for a fresh reload
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHES' });
        }
        // Reload to let the new SW control the page
        setTimeout(() => location.reload(true), 400);
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
