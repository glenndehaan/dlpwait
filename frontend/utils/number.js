/**
 * Exports the Number utils
 */
export default {
    /**
     * Checks if a number is within plus 5 of minus 5 of target
     *
     * @param num1
     * @param num2
     * @return {String}
     */
    isWithinFivePlusMinus: (num1, num2) => {
        // Calculate the difference between the two numbers
        const difference = num1 - num2;

        // Check if the difference is within 5 (plus or minus)
        if (Math.abs(difference) <= 5) {
            return 'within';
        } else if (difference > 0) {
            return 'lower';
        } else {
            return 'higher';
        }
    }
}
