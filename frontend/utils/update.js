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
    },

    /**
     * Remove the search and sort keys. These have been replaced by view specific keys
     *
     * @param storage
     */
    1: (storage) => {
        const searchKey = storage.get('search');
        const sortKey = storage.get('sort');

        if(searchKey === null && sortKey === null) {
            return;
        }

        storage.remove('search');
        storage.remove('sort');
    }
};
