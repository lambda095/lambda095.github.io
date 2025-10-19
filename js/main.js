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
