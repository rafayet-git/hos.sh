document.addEventListener('DOMContentLoaded', function() {
    function removeAllHighlights() {
        const highlightedElements = document.querySelectorAll('.highlighted');
        highlightedElements.forEach(element => {
            element.classList.remove('highlighted');
        });
    }

    function highlightTag(tagId) {
        removeAllHighlights();
        const targetElement = document.getElementById(tagId);
        if (targetElement) {
            targetElement.classList.add('highlighted');
            // For clicking tag links
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function handleHashChange() {
        const hash = window.location.hash.substring(1); 
        if (hash) {
            // Add a small delay to ensure the page has loaded/scrolled
            setTimeout(() => {
                highlightTag(hash);
            }, 100);
        } 
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
});
