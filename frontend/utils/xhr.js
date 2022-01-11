/**
 * Export the xhr function
 *
 * @param url
 * @param callback
 * @param body
 */
export default (url, callback, body = false) => {
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

    if(!body) {
        xhr.open("GET", url, true);
        xhr.send();
    } else {
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(body));
    }
}
