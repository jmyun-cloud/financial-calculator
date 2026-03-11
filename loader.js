(function () {
    // Inject CSS for the loader
    const style = document.createElement('style');
    style.textContent = `
        #page-transition-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #f8faff;
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 1;
            transition: opacity 0.25s ease-in-out;
            pointer-events: none;
        }
        .loader-spinner {
            font-size: 3.5rem;
            animation: loader-bounce 0.6s infinite alternate cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        @keyframes loader-bounce {
            0% { transform: translateY(0) scale(1.05); }
            100% { transform: translateY(-20px) scale(0.95); }
        }
        /* When hiding, we fade opacity to 0 */
        #page-transition-loader.hidden {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);

    // Create the loader element
    const loader = document.createElement('div');
    loader.id = 'page-transition-loader';
    loader.innerHTML = '<div class="loader-spinner">💰</div>';

    // Append to document element so it covers everything immediately before body loads
    document.documentElement.appendChild(loader);

    // When the page finishes loading, fade out and remove the loader
    window.addEventListener('load', () => {
        // Very short delay for visual completion
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 300); // Wait for the transition to finish
        }, 100);
    });

    // Also remove it if dom is already loaded (fallback)
    if (document.readyState === 'complete') {
        loader.classList.add('hidden');
        setTimeout(() => {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 300);
    }

    // Intercept clicks on links that navigate away
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        // Ignore anchors, JS, and external/new-tab links
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.target === '_blank') {
            return;
        }

        // Skip links that have download attribute
        if (link.hasAttribute('download')) return;

        // Show the loader before navigating
        e.preventDefault();

        // Re-append to ensure it's on top, reset opacity
        document.documentElement.appendChild(loader);
        loader.classList.remove('hidden');

        // Force reflow
        void loader.offsetWidth;

        // Navigate after a brief delay to allow fade-in
        setTimeout(() => {
            window.location.href = link.href;
        }, 200);
    });

    // Handle back/forward cache (bfcache) navigation 
    // If user clicks back button, we want the loader to disappear
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) { // if loaded from cache
            loader.classList.add('hidden');
            setTimeout(() => {
                if (loader.parentNode) loader.parentNode.removeChild(loader);
            }, 300);
        }
    });

})();
