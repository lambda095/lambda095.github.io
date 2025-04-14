document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality would go here
    const jobTypeFilter = document.getElementById('job-type');
    const locationFilter = document.getElementById('location');
    
    jobTypeFilter.addEventListener('change', filterJobs);
    locationFilter.addEventListener('change', filterJobs);
    
    function filterJobs() {
        const selectedType = jobTypeFilter.value;
        const selectedLocation = locationFilter.value;
        
        document.querySelectorAll('.job-item').forEach(job => {
            const jobType = job.querySelector('.job-type').classList.contains(selectedType) || selectedType === 'all';
            const jobLocation = job.querySelector('.job-location').classList.contains(selectedLocation) || selectedLocation === 'all';
            
            job.style.display = (jobType && jobLocation) ? 'block' : 'none';
        });
    }
});