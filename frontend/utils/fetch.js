/**
 * Export the fetch function
 *
 * @param url
 * @param callback
 */
export default (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                callback(xhr.responseText);
            } else {
                console.error(xhr);
            }
        }
    };

    xhr.open("GET", url, true);
    xhr.send();
}
