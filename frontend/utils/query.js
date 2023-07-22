/**
 * Export the GraphQL Query
 */
export default {
    query: `
        {
            generic {
                waitTimesUpdated
            }

            weather {
                current {
                    wmo {
                        description
                    }
                    temperature
                }
                expected {
                    wmo {
                        description
                    }
                    temperature
                }
                hourly {
                    wmo {
                        description
                    }
                    temperature
                    rain
                    time
                }
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
                geo {
                    lat
                    lng
                }
                openingTime
                closingTime
                services {
                    photoPass
                    singleRider
                    premierAccess
                    virtualQueue
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
                history {
                    waitTime {
                        standby {
                            minutes
                            timestamp
                        }
                    }
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
                duration {
                    hours
                    minutes
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
                    virtualQueue
                }
                virtualQueue {
                    available
                    queues {
                        status
                        openingTime
                        closingTime
                        nextTimeSlot
                    }
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
                geo {
                    lat
                    lng
                }
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
