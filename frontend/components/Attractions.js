import {h, Component} from 'preact';
import clsx from 'clsx';

import Error from './Error';

import storage from '../modules/storage';

import date from '../utils/date';
import geo from '../utils/geo';
import number from '../utils/number';

export default class Attractions extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            showWaitTimeMetric: false
        };
    }

    /**
     * Add/remove an item from the favourites list
     *
     * @param name
     */
    updateFavourite(name) {
        const favourites = this.props.favourites;

        if(favourites.includes(name)) {
            favourites.splice(favourites.indexOf(name), 1);
            storage.set('favourites', favourites);
        } else {
            favourites.push(name);
            storage.set('favourites', favourites);
        }

        this.props.reloadFavourites();
    }

    /**
     * Shows or hides the wait time metric
     */
    toggleWaitTimeMetric() {
        this.setState({
            showWaitTimeMetric: !this.state.showWaitTimeMetric
        });
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {showWaitTimeMetric} = this.state;
        const {attractions, park, sort, search, favourites, gps, debug} = this.props;

        const parkAttractions = attractions.filter((attraction) => {
            return attraction.park.slug === park && attraction.status !== "UNDEFINED";
        }).sort((a, b) => {
            // Remap status text to numeric number to improve sort
            const statusMap = {
                OPERATING: 1,
                REFURBISHMENT: 4,
                DOWN: 2,
                CLOSED: 3,
                UNDEFINED: 5
            };

            // Sort/group by favourites
            if(sort === "FAVOURITES") {
                if (favourites.includes(a.name) > favourites.includes(b.name)) return -1;
                if (favourites.includes(a.name) < favourites.includes(b.name)) return 1;
            }

            // Sort/group by distance (Location/GPS)
            if(sort === "NEAR_ME") {
                const distanceA = geo.getDistanceFromLatLonInKm(gps.latitude, gps.longitude, a.geo.lat, a.geo.lng);
                const distanceB = geo.getDistanceFromLatLonInKm(gps.latitude, gps.longitude, b.geo.lat, b.geo.lng);

                if (distanceA > distanceB) return 1;
                if (distanceA < distanceB) return -1;
            }

            // Sort/group by single rider availability
            if(sort === "SINGLE_RIDER_AVAILABILITY") {
                if (a.waitTime.singleRider.available > b.waitTime.singleRider.available) return -1;
                if (a.waitTime.singleRider.available < b.waitTime.singleRider.available) return 1;
            }

            // Sort/group by premier access availability
            if(sort === "PREMIER_ACCESS_AVAILABILITY") {
                if (a.premierAccess.available > b.premierAccess.available) return -1;
                if (a.premierAccess.available < b.premierAccess.available) return 1;
            }

            // Sort/group by photo pass availability
            if(sort === "PHOTO_PASS_AVAILABILITY") {
                if (a.services.photoPass > b.services.photoPass) return -1;
                if (a.services.photoPass < b.services.photoPass) return 1;
            }

            // Sort/group attractions on status first
            if(sort !== "ATTRACTION_STATUS_UNDER_CONSTRUCTION" && sort !== "ATTRACTION_STATUS_TEMPORARY_CLOSED" && sort !== "ATTRACTION_STATUS_CLOSED") {
                if (statusMap[a.status] > statusMap[b.status]) return sort === "ATTRACTION_STATUS" ? -1 : 1;
                if (statusMap[a.status] < statusMap[b.status]) return sort === "ATTRACTION_STATUS" ? 1 : -1;
            } else {
                if(sort === "ATTRACTION_STATUS_UNDER_CONSTRUCTION") {
                    const specialStatusMap = {
                        OPERATING: 2,
                        REFURBISHMENT: 1,
                        DOWN: 3,
                        CLOSED: 4,
                        UNDEFINED: 5
                    };

                    if (specialStatusMap[a.status] > specialStatusMap[b.status]) return 1;
                    if (specialStatusMap[a.status] < specialStatusMap[b.status]) return -1;
                }

                if(sort === "ATTRACTION_STATUS_TEMPORARY_CLOSED") {
                    const specialStatusMap = {
                        OPERATING: 2,
                        REFURBISHMENT: 4,
                        DOWN: 1,
                        CLOSED: 3,
                        UNDEFINED: 5
                    };

                    if (specialStatusMap[a.status] > specialStatusMap[b.status]) return 1;
                    if (specialStatusMap[a.status] < specialStatusMap[b.status]) return -1;
                }

                if(sort === "ATTRACTION_STATUS_CLOSED") {
                    const specialStatusMap = {
                        OPERATING: 2,
                        REFURBISHMENT: 4,
                        DOWN: 3,
                        CLOSED: 1,
                        UNDEFINED: 5
                    };

                    if (specialStatusMap[a.status] > specialStatusMap[b.status]) return 1;
                    if (specialStatusMap[a.status] < specialStatusMap[b.status]) return -1;
                }
            }

            // Sort/group by waiting times
            if(sort === "WAIT_TIME_STANDBY_DESC") {
                if (a.waitTime.standby.minutes > b.waitTime.standby.minutes) return 1;
                if (a.waitTime.standby.minutes < b.waitTime.standby.minutes) return -1;
            }
            if(sort === "WAIT_TIME_STANDBY_ASC") {
                if (a.waitTime.standby.minutes > b.waitTime.standby.minutes) return -1;
                if (a.waitTime.standby.minutes < b.waitTime.standby.minutes) return 1;
            }

            // Sort/group attractions alphabetical on name
            if (a.name > b.name) return sort === "NAME_DESC" ? 1 : sort === "NAME_ASC" ? -1 : 1;
            if (a.name < b.name) return sort === "NAME_DESC" ? -1 : sort === "NAME_ASC" ? 1 : -1;
        }).filter((attraction) => {
            return attraction.name.toLowerCase().includes(search.toLowerCase());
        });

        if(parkAttractions.length < 1) {
            return <Error message="We couldn&apos;t find any attractions with your chosen filters" code="NO_ATTRACTIONS_AFTER_FILTER_SORT"/>;
        }

        return (
            <div className="grid grid-row-auto gap-4 w-full max-w-5xl px-4 mx-auto">
                {parkAttractions.map((item, key) => (
                    <div key={key}>
                        <article type="attraction" className="grid gap-4 border rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-4">
                                <h2>
                                    <button aria-label="Add/remove attraction to/from favourites" className={clsx("align-middle h-5 w-5 mr-1", favourites.includes(item.name) ? "text-red-500" : "text-gray-400")} onClick={() => this.updateFavourite(item.name)}>
                                        <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M16.5 5c-1.54 0-3.04.99-3.56 2.36h-1.87C10.54 5.99 9.04 5 7.5 5 5.5 5 4 6.5 4 8.5c0 2.89 3.14 5.74 7.9 10.05l.1.1.1-.1C16.86 14.24 20 11.39 20 8.5c0-2-1.5-3.5-3.5-3.5z" opacity=".3"/>
                                            <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
                                        </svg>
                                    </button>
                                    <span className="align-middle font-bold">
                                        {item.name}
                                    </span>
                                </h2>
                                <div className="mt-1">
                                    <span className="text-sm">{item.region}</span>
                                    <div className="grid gap-2 grid-row-auto mt-4 w-36 grid-services">
                                        {sort === 'NEAR_ME' &&
                                            <span className="bg-gray-200 rounded p-1 mr-1 pr-2 text-sm text-black h-8">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="fill-current inline-block h-6 w-6 align-middle mr-1">
                                                    <path d="M480-80q-106 0-173-31t-67-79q0-27 24.5-51t67.5-39l18 58q-16 5-29.5 14T299-190q17 20 70.5 35T480-140q57 0 111-15t71-35q-8-8-21-17t-30-15l17-58q43 15 67.5 39t24.5 51q0 48-67 79T480-80Zm0-215q21.103-39 44.552-71.5Q548-399 571-428q44-57 69.5-98T666-634.074q0-77.666-54.214-131.796-54.215-54.13-132-54.13Q402-820 348-765.87t-54 131.796Q294-567 319.5-526t69.5 98q23 29 46.448 61.5Q458.897-334 480-295Zm0 109q-12 0-21-6.771T446-211q-24-73-60.019-121-36.02-48-69.981-92-34-44-58-91.5t-24-118.541Q234-737 305.319-808.5 376.639-880 480-880q103.361 0 174.681 71.319Q726-737.361 726-634q0 71-23.873 118.341Q678.253-468.319 644-424q-34 44-70 92t-59.852 120.732Q510-200 501-193t-21 7Zm.208-388Q505-574 522.5-591.708q17.5-17.709 17.5-42.5Q540-659 522.292-676.5q-17.709-17.5-42.5-17.5Q455-694 437.5-676.292q-17.5 17.709-17.5 42.5Q420-609 437.708-591.5q17.709 17.5 42.5 17.5ZM480-634Z"/>
                                                </svg>
                                                <span className="inline-block align-middle">{Math.round(geo.getDistanceFromLatLonInKm(gps.latitude, gps.longitude, item.geo.lat, item.geo.lng) * 1000)} m</span>
                                            </span>
                                        }
                                        {item.services.photoPass &&
                                            <span className="bg-gray-200 rounded p-1 mr-1 pr-2 text-sm text-black h-8">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current inline-block h-6 w-6 align-middle mr-1">
                                                    <circle cx="12" cy="12" r="3.2"/>
                                                    <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                                                </svg>
                                                <span className="inline-block align-middle">Photo Pass</span>
                                            </span>
                                        }
                                        {item.services.singleRider &&
                                            <span className="bg-gray-200 rounded p-1 mr-1 pr-2 text-sm text-black h-8">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current inline-block h-6 w-6 align-middle mr-1">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                                </svg>
                                                <span className="inline-block align-middle">Single Rider</span>
                                            </span>
                                        }
                                        {item.status !== "REFURBISHMENT" &&
                                            <span className="bg-blue-300 rounded p-1 mr-1 pr-2 text-sm text-black h-8">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current inline-block h-6 w-6 align-middle mr-1">
                                                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                                                    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                                                </svg>
                                                <span className="inline-block align-middle">{date.getHoursMinutes(item.openingTime)} - {date.getHoursMinutes(item.closingTime)}</span>
                                            </span>
                                        }
                                        {item.status === "OPERATING" && item.history.waitTime.standby.timestamp && item.history.waitTime.standby.minutes !== 0 &&
                                            <span onClick={() => this.toggleWaitTimeMetric()} className={clsx("bg-gray-200 rounded p-1 mr-1 pr-2 text-sm text-black h-8 cursor-pointer select-none", number.isWithinFivePlusMinus(item.history.waitTime.standby.minutes, item.waitTime.standby.minutes) === "within" && "bg-orange-200", number.isWithinFivePlusMinus(item.history.waitTime.standby.minutes, item.waitTime.standby.minutes) === "higher" && "bg-red-200", number.isWithinFivePlusMinus(item.history.waitTime.standby.minutes, item.waitTime.standby.minutes) === "lower" && "bg-green-200")}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current inline-block h-6 w-6 align-middle mr-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                                </svg>
                                                {!showWaitTimeMetric && number.isWithinFivePlusMinus(item.history.waitTime.standby.minutes, item.waitTime.standby.minutes) === "within" && <span className="inline-block align-middle">Average Wait</span>}
                                                {!showWaitTimeMetric && number.isWithinFivePlusMinus(item.history.waitTime.standby.minutes, item.waitTime.standby.minutes) === "higher" && <span className="inline-block align-middle">Longer Wait</span>}
                                                {!showWaitTimeMetric && number.isWithinFivePlusMinus(item.history.waitTime.standby.minutes, item.waitTime.standby.minutes) === "lower" && <span className="inline-block align-middle">Shorter Wait</span>}
                                                {showWaitTimeMetric && <span className="inline-block align-middle">{item.history.waitTime.standby.minutes} min</span>}
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={clsx("text-center p-0 rounded-r-lg flex flex-col justify-center text-white", item.status === "OPERATING" && "bg-green-700", item.status === "REFURBISHMENT" && "construction-color", (item.status === "CLOSED" || item.status === "CLOSED_OPS") && "bg-red-800", item.status === "DOWN" && "bg-yellow-700")}>
                                {item.status === "OPERATING" && item.waitTime.singleRider.available &&
                                    <div className="grid grid-rows-2 h-full">
                                        <div className="border-b flex flex-col items-center justify-center">
                                            <span className="font-bold">Standby:</span>
                                            <span>{item.waitTime.standby.minutes} min</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="font-bold">Single Rider:</span>
                                            <span>{item.waitTime.singleRider.minutes} min</span>
                                        </div>
                                    </div>
                                }
                                {item.status === "OPERATING" && !item.waitTime.singleRider.available && <div><span className="font-bold">Standby:</span><br/>{item.waitTime.standby.minutes} min</div>}
                                {item.status === "DOWN" && <div className="text-sm font-bold">Temporary Closed (Breakdown)</div>}
                                {item.status === "REFURBISHMENT" && <div className="text-sm font-bold">Under Construction</div>}
                                {(item.status === "CLOSED" || item.status === "CLOSED_OPS") && <div className="font-bold">Closed</div>}
                            </div>
                        </article>
                        {item.services.premierAccess &&
                            <div className="border border-t-0 text-center bg-gradient-to-t from-purple-800 to-purple-600 text-white rounded-b-lg mx-10 row-span-1 shadow-lg p-2 dark:border-gray-700">
                                <div className="flex flex-col justify-center text-lg font-bold border-b w-3/4 m-auto mb-2">Premier Access</div>
                                {!item.premierAccess.available &&
                                    <div>There are no passes available!</div>
                                }
                                {item.premierAccess.available &&
                                    <div>
                                        Next available slot / price:<br/>
                                        {date.getHoursMinutes(item.premierAccess.nextTimeSlotStart)} - {date.getHoursMinutes(item.premierAccess.nextTimeSlotEnd)} / &euro; {item.premierAccess.price} <span className="text-sm">per person</span>
                                    </div>
                                }
                            </div>
                        }
                        {debug &&
                            <pre className="text-debug">{JSON.stringify(item, undefined, 2)}</pre>
                        }
                    </div>
                ))}
            </div>
        );
    }
}
