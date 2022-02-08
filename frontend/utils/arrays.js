/**
 * Exports the Array utils
 */
export default {
    /**
     * Converts a base64 url to an array
     *
     * @param base64String
     * @returns {Uint8Array}
     */
    urlBase64ToUint8Array: (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },

    /**
     * Converts ASCII strings to hexadecimal
     *
     * @param string
     * @param maxLength
     * @returns {string}
     */
    asciiToHex: (string, maxLength = 10) => {
        const arr1 = [];
        for (let n = 0, l = string.length; n < l; n ++) {
            const hex = Number(string.charCodeAt(n)).toString(16);
            arr1.push(hex);
        }

        return `0x${arr1.join('').substring(0, maxLength)}`;
    }
}
