import fetch from './fetch';

/**
 * Check if we need to kill the SW by checking a param on the server
 *
 * @param {string} url
 * @param {string} expect
 */
export const validateServiceWorkerInstance = (url = '/api/sw', expect = 'false') => {
    // Return if service worker is not supported
    if ('serviceWorker' in navigator === false) return;
    // Fetch to the validate url
    fetch(url, (response) => {
        response = response.replace(/\r?\n|\r/g, '');
        // Return if the response is what we expect
        if (response === expect) return;
        console.warn('[SW] Deactivated!');
        // Get all registrations from SW
        navigator.serviceWorker.getRegistrations().then(registrations => {
            // Loop over registrations to unregister them
            for (let i = 0; i < registrations.length; i += 1) {
                registrations[i].unregister();
            }
        });
    });
};
