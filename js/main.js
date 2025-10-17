// Study Dropdown: Show right info for selected/hovered left link
document.addEventListener('DOMContentLoaded', function() {
    var studyDropdown = document.querySelector('.study-dropdown');
    if (studyDropdown) {
        var links = studyDropdown.querySelectorAll('.study-link');
        var rightInfo = document.getElementById('study-right-info');

        // Hide right column by default
        rightInfo.style.display = 'none';

        links.forEach(function(link) {
            link.addEventListener('mouseenter', function() {
                links.forEach(function(l) { l.classList.remove('active'); });
                link.classList.add('active');
                
                // Show right column for ALL links, not just one
                rightInfo.style.display = 'flex';
                
                // Optional: You can add logic to show different content per link
                // updateRightContent(link.textContent.trim());
            });
        });

        // Only hide when leaving the ENTIRE dropdown, not individual links
        studyDropdown.addEventListener('mouseleave', function() {
            links.forEach(function(l) { l.classList.remove('active'); });
            rightInfo.style.display = 'none';
        });

        // Keep right column visible when hovering over it
        rightInfo.addEventListener('mouseenter', function() {
            rightInfo.style.display = 'flex';
        });

        rightInfo.addEventListener('mouseleave', function() {
            // Don't hide here - let the parent dropdown handle hiding
        });
    }
});

// Optional: Function to update right column content based on left link
function updateRightContent(linkText) {
    var rightInfo = document.getElementById('study-right-info');
    
    // Example: Change content based on which left link is hovered
    switch(linkText.toUpperCase()) {
        case 'INTERESTED IN STUDYING?':
            // Set content for this section
            break;
        case 'DEGREE PROGRAMMES':
            // Set different content
            break;
        // Add more cases as needed
    }
}