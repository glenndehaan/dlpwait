/**
 * Export the GraphQL Query
 */
export default {
    query: `
        {
            parks {
                name
                slug
                schedules {
                    status
                    startTime
                    endTime
                    date
                }
            }

            attractions {
                active
                status
                name
                park {
                    name
                    slug
                }
                region
                openingTime
                closingTime
                services {
                    photoPass
                    singleRider
                    premierAccess
                }
                waitTime {
                    standby {
                        minutes
                        updated
                    }
                    singleRider {
                        available
                        minutes
                        updated
                    }
                }
                premierAccess {
                    available
                    nextTimeSlotStart
                    nextTimeSlotEnd
                    price
                }
            }

            entertainment {
                active
                name
                schedules {
                    status
                    startTime
                    endTime
                    date
                    language
                }
                park {
                    name
                    slug
                }
                region
                services {
                    photoPass
                    singleRider
                    premierAccess
                }
            }
        }
    `
};
