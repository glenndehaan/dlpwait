/**
 * Export the GraphQL Query
 */
export default {
    query: `
        {
            generic {
                waitTimesUpdated
            }

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
                category
                services {
                    photoPass
                    singleRider
                    premierAccess
                }
            }

            restaurants {
                active
                status
                name
                park {
                    name
                    slug
                }
                region
                category
                cuisines
                serviceTypes
                openingTime
                closingTime
                menu {
                    available
                    url
                }
                mobileReservation {
                    available
                    url
                }
                mobileOrder {
                    available
                    url
                }
            }
        }
    `
};
