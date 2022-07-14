/**
 * Export the update utils
 */
export default {
    /**
     * Remove the entertainment_view key this has been replaced with the new view key
     *
     * @param storage
     */
    0: (storage) => {
        const key = storage.get('entertainment_view');

        if(key === null) {
            return;
        }

        storage.remove('entertainment_view');
    }
};
