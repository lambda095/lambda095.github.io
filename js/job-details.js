document.addEventListener('DOMContentLoaded', function() {
    // Print functionality
    const printBtn = document.querySelector('.print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.print();
        });
    }

    // Dynamic content loading (example - would need backend integration)
    function loadJobDetails() {
        // Get job ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const jobId = urlParams.get('id');
        
        // In a real implementation, you would fetch job details from an API
        // fetch(`/api/jobs/${jobId}`)
        //     .then(response => response.json())
        //     .then(data => populateJobDetails(data))
        //     .catch(error => console.error('Error:', error));
    }

    function populateJobDetails(jobData) {
        // This would populate the page with data from the API
        document.querySelector('.job-details-header h1').textContent = jobData.title;
        document.querySelector('.job-department').textContent = jobData.department;
        // ... populate other fields
    }

    // Uncomment to enable dynamic loading
    // loadJobDetails();
});