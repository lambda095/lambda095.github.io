// Study Dropdown: Show right info only for 'INTERESTED IN STUDYING?'
document.addEventListener('DOMContentLoaded', function() {
    var studyDropdown = document.querySelector('.study-dropdown');
    if (studyDropdown) {
        var links = studyDropdown.querySelectorAll('.study-link');
        var rightInfo = document.getElementById('study-right-info');
        links.forEach(function(link) {
            link.addEventListener('mouseenter', function() {
                if (link.textContent.trim().toUpperCase() === 'INTERESTED IN STUDYING?') {
                    rightInfo.style.display = 'flex';
                } else {
                    rightInfo.style.display = 'none';
                }
            });
            link.addEventListener('mouseleave', function() {
                rightInfo.style.display = 'none';
            });
        });
        studyDropdown.addEventListener('mouseleave', function() {
            rightInfo.style.display = 'none';
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
    document.querySelectorAll('.dropdown > a').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.parentElement;
            const isExpanded = dropdown.getAttribute('aria-expanded') === 'true';
            dropdown.setAttribute('aria-expanded', !isExpanded);
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
