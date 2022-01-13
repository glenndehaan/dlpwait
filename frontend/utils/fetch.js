/**
 * Request data from the API
 *
 * @param endpoint
 * @param body
 * @param text
 * @returns {Promise<unknown>}
 */
export default (endpoint, body = false, text = false) => {
    return new Promise(resolve => {
        const params = {
            method: 'GET'
        };

        if(body) {
            params.method = 'POST';
            params.headers = {
                'Content-Type': 'application/json'
            };
            params.body = JSON.stringify(body);
        }

        fetch(endpoint, params)
            .then(response => !text ? response.json() : response.text())
            .then(data => resolve(data))
            .catch(e => {
                console.error(e);
                resolve(false);
            });
    });
}
