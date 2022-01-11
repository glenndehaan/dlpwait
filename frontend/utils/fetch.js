/**
 * Request data from the API
 *
 * @param endpoint
 * @param data
 * @returns {Promise<unknown>}
 */
export default (endpoint, data = false) => {
    return new Promise(resolve => {
        const params = {
            method: 'GET'
        };

        if(data) {
            params.method = 'POST';
            params.headers = {
                'Content-Type': 'application/json'
            };
            params.body = JSON.stringify(data);
        }

        fetch(endpoint, params)
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(e => {
                console.error(e);
                resolve(false);
            });
    });
}
