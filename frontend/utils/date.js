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
        return date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false});
    }
}
