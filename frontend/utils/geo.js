/**
 * Internal functions
 */
const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

/**
 * Exports the Geo utils
 */
export default {
    /**
     * Get the distance between to coordinates in km
     *
     * @param lat1
     * @param lon1
     * @param lat2
     * @param lon2
     * @return {number}
     */
    getDistanceFromLatLonInKm: (lat1, lon1, lat2, lon2) => {
        const earthRadius = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c; // Distance in km
    },

    /**
     * Get the current GPS position
     *
     * @return {Promise<unknown>}
     */
    getCurrentPosition() {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition((pos) => {
                resolve({
                    error: false,
                    denied: false,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                });
            }, (error) => {
                if(error.code === 1) {
                    resolve({
                        error: false,
                        denied: true,
                        latitude: null,
                        longitude: null
                    });
                } else {
                    resolve({
                        error: true,
                        denied: false,
                        latitude: null,
                        longitude: null
                    });
                }

                console.warn(error);
            });
        });
    }
}
