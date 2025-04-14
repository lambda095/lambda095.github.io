document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const categoryFilter = document.getElementById('job-category');
    const locationFilter = document.getElementById('job-location');
    const typeFilter = document.getElementById('job-type');
    const jobListings = document.querySelectorAll('.job-listing');

    // Add event listeners to all filters
    [categoryFilter, locationFilter, typeFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    function applyFilters() {
        const selectedCategory = categoryFilter.value;
        const selectedLocation = locationFilter.value;
        const selectedType = typeFilter.value;

        jobListings.forEach(job => {
            const jobCategory = job.querySelector('.job-category').classList.contains(selectedCategory) || selectedCategory === 'all';
            const jobLocation = job.querySelector('.detail-item:nth-child(1) span').textContent.toLowerCase().includes(selectedLocation) || selectedLocation === 'all';
            // Note: Type filtering would require adding data attributes or specific markup

            if (jobCategory && jobLocation) {
                job.style.display = 'block';
            } else {
                job.style.display = 'none';
            }
        });
    }

    // Print button functionality
    document.querySelectorAll('.print-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.print();
        });
    });
});