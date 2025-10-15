// Study Dropdown: Show right info for selected/hovered left link
document.addEventListener('DOMContentLoaded', function() {
    var studyDropdown = document.querySelector('.study-dropdown');
    if (studyDropdown) {
        var links = studyDropdown.querySelectorAll('.study-link');
        var rightInfo = document.getElementById('study-right-info');
        var degreeInfo = document.createElement('div');
        degreeInfo.className = 'study-right';
        degreeInfo.style.flex = '1.2';
        degreeInfo.style.padding = '2em 2em 2em 1.5em';
        degreeInfo.style.background = '#eaf2fb';
        degreeInfo.style.display = 'none';
        degreeInfo.style.flexDirection = 'column';
        degreeInfo.style.gap = '0.7em';
        degreeInfo.style.color = '#234';
        degreeInfo.innerHTML = `
            <a href="degree-programmes.html" style="color: #00549e; text-decoration: none;">Study programmes</a>
            <a href="part-time.html" style="color: #00549e; text-decoration: none;">Part-time studies for working professionals</a>
            <a href="doctoral.html" style="color: #00549e; text-decoration: none;">Doctoral studies</a>
            <a href="early-studies.html" style="color: #00549e; text-decoration: none;">Early studies programme</a>
            <a href="guest-students.html" style="color: #00549e; text-decoration: none;">Guest students</a>
        `;
        studyDropdown.appendChild(degreeInfo);

        // Set 'INTERESTED IN STUDYING?' as default selected
        links.forEach(function(link) {
            link.classList.remove('active');
        });
        links[0].classList.add('active');
        rightInfo.style.display = 'flex';

        links.forEach(function(link, idx) {
            link.addEventListener('mouseenter', function() {
                links.forEach(function(l) { l.classList.remove('active'); });
                link.classList.add('active');
                if (link.textContent.trim().toUpperCase() === 'INTERESTED IN STUDYING?') {
                    rightInfo.style.display = 'flex';
                    degreeInfo.style.display = 'none';
                } else if (link.textContent.trim().toUpperCase() === 'DEGREE PROGRAMMES') {
                    rightInfo.style.display = 'none';
                    degreeInfo.style.display = 'flex';
                } else {
                    rightInfo.style.display = 'none';
                    degreeInfo.style.display = 'none';
                }
            });
            link.addEventListener('mouseleave', function() {
                link.classList.remove('active');
                // Restore default selection
                links[0].classList.add('active');
                rightInfo.style.display = 'flex';
                degreeInfo.style.display = 'none';
            });
        });
        studyDropdown.addEventListener('mouseleave', function() {
            links.forEach(function(l) { l.classList.remove('active'); });
            links[0].classList.add('active');
            rightInfo.style.display = 'flex';
            degreeInfo.style.display = 'none';
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
