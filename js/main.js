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
    
    // Language switcher functionality would go here
});
