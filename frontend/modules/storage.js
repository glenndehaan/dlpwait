import updates from '../utils/update';

/**
 * Get an item in the storage
 *
 * @param {string} key
 * @return {null|{}}
 */
const get = (key) => {
    const state = localStorage.getItem(key);
    if (state === null) return null;
    return JSON.parse(state);
};

/**
 * Set an item in the storage
 *
 * @param {string} key
 * @param {*} state
 */
const set = (key, state) => {
    localStorage.setItem(key, JSON.stringify(state));
};

/**
 * Remove an item from the storage
 *
 * @param {string} key
 */
const remove = (key) => {
    localStorage.removeItem(key);
};

/**
 * Update the storage according to available updates
 */
const update = () => {
    const currentVersion = get('version') || 0;
    const updateKeys = Object.keys(updates);

    for(let item = currentVersion; item < updateKeys.length; item++) {
        const updateFunction = updates[item];

        console.log(`[STORAGE] Updating to version: ${(item + 1)}...`);
        updateFunction({ get, set, remove });
        console.log(`[STORAGE] Success updating to version: ${(item + 1)}!`);

        set('version', (item + 1));
    }
};

export default { get, set, remove, update };
