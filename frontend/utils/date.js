/**
 * Export the date utils
 */
export default {
    /**
     * Get the hours and minutes from a date
     *
     * @param string
     * @returns {string}
     */
    getHoursMinutes: (string) => {
        const date = new Date(string);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    },

    /**
     * Returns a formatted date string
     *
     * @param date
     * @return {string}
     */
    getDateFormatted: (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return date.toLocaleTimeString('en-US', options);
    }
}
