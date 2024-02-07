import {h, Component} from 'preact';
import clsx from 'clsx';

import Error from './Error';

import date from '../utils/date';
import geo from '../utils/geo';

export default class Restaurants extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {restaurants, park, sort, search, gps, debug} = this.props;

        const parkRestaurants = restaurants.filter((restaurant) => {
            return debug ? (restaurant.park.slug === park && restaurant.active) : (restaurant.park.slug === park && restaurant.status !== "UNDEFINED" && restaurant.active);
        }).sort((a, b) => {
            // Sort/group by distance (Location/GPS)
            if(sort === "NEAR_ME") {
                const distanceA = geo.getDistanceFromLatLonInKm(gps.latitude, gps.longitude, a.geo.lat, a.geo.lng);
                const distanceB = geo.getDistanceFromLatLonInKm(gps.latitude, gps.longitude, b.geo.lat, b.geo.lng);

                if (distanceA > distanceB) return 1;
                if (distanceA < distanceB) return -1;
            }

            // Sort/group by mobile order availability
            if(sort === "MOBILE_ORDER_AVAILABILITY") {
                if (a.mobileOrder.available > b.mobileOrder.available) return -1;
                if (a.mobileOrder.available < b.mobileOrder.available) return 1;
            }

            // Sort/group by reservation required
            if(sort === "RESERVATION_REQUIRED") {
                if (a.mobileReservation.available > b.mobileReservation.available) return -1;
                if (a.mobileReservation.available < b.mobileReservation.available) return 1;
            }

            // Sort/group by counter service
            if(sort === "COUNTER_SERVICE") {
                if (a.mobileReservation.available > b.mobileReservation.available) return 1;
                if (a.mobileReservation.available < b.mobileReservation.available) return -1;
            }

            // Sort/group by region
            if(sort === "REGION") {
                if (a.region > b.region) return 1;
                if (a.region < b.region) return -1;
            }

            // Sort/group attractions alphabetical on name
            if (a.name > b.name) return sort === "NAME_DESC" ? 1 : sort === "NAME_ASC" ? -1 : 1;
            if (a.name < b.name) return sort === "NAME_DESC" ? -1 : sort === "NAME_ASC" ? 1 : -1;
        }).filter((restaurant) => {
            return restaurant.name.toLowerCase().includes(search.toLowerCase());
        });

        if(parkRestaurants.length < 1) {
            return <Error message="We couldn&apos;t find any restaurants with your chosen filters" code="NO_RESTAURANTS_AFTER_FILTER_SORT"/>;
        }

        return (
            <div className="grid grid-row-auto gap-4 w-full max-w-5xl px-4 mx-auto">
                {sort === 'NEAR_ME' && Math.round(geo.getDistanceFromLatLonInKm(gps.latitude, gps.longitude, parkRestaurants[0].geo.lat, parkRestaurants[0].geo.lng) * 1000) > 500 &&
                    <div>
                        <article type="warning" className="grid gap-4 border rounded-lg shadow-lg bg-yellow-700 text-white dark:bg-yellow-700 dark:border-gray-700">
                            <div className="p-4">
                                <h2>
                                    <span className="align-middle font-bold">
                                        It looks like you are far away from the nearest restaurant. Please check the location settings from your browser and make sure &quot;Exact Location&quot; is turned on.
                                    </span>
                                </h2>
                            </div>
                        </article>
                    </div>
                }
                {parkRestaurants.map((item, key) => (
                    <div key={key}>
                        <article type="restaurant" className="grid gap-4 border rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-4">
                                <h2 className="font-bold">{item.name}<br/><span className="text-xs">({item.cuisines.join(', ')}{(item.cuisines.length > 0 && item.serviceTypes.length > 0) ? ', ' : ''}{item.serviceTypes.join(', ')})</span></h2>
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
                                        {item.mobileReservation.available &&
                                            <span className="bg-gray-200 rounded p-1 mr-1 pr-2 text-sm text-black h-8">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current inline-block h-6 w-6 align-middle mr-1">
                                                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                                                </svg>
                                                <span className="inline-block align-middle">Reservation</span>
                                            </span>
                                        }
                                        {item.mobileOrder.available &&
                                            <span className="bg-gray-200 rounded p-1 mr-1 pr-2 text-sm text-black h-8">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current inline-block h-6 w-6 align-middle mr-1">
                                                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                                                </svg>
                                                <span className="inline-block align-middle">Order</span>
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
                                    </div>
                                </div>
                            </div>
                            <div className={clsx("text-center p-0 rounded-r-lg flex flex-col justify-center text-white", item.status === "OPERATING" && date.checkPassedDateTime(item.openingTime) && date.checkUpcomingDateTime(item.closingTime) && "bg-green-700", item.status === "REFURBISHMENT" && "construction-color", (item.status === "CLOSED" || item.status === "CLOSED_OPS" || !date.checkUpcomingDateTime(item.closingTime)) && "bg-red-800", item.status === "OPERATING" && !date.checkPassedDateTime(item.openingTime) && "bg-yellow-700")}>
                                {item.status === "OPERATING" && date.checkPassedDateTime(item.openingTime) && date.checkUpcomingDateTime(item.closingTime) && item.menu.available &&
                                    <div className="grid grid-rows-2 h-full">
                                        <div className="border-b flex flex-col items-center justify-center">
                                            <span className="font-bold">Open</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center bg-blue-600 rounded-br-lg">
                                            <a href={item.menu.url} target="_blank" rel="noreferrer noopener" className="flex items-center w-full h-full px-1 text-white text-sm rounded-br-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200">
                                                <span className="underline" style="text-underline-offset: 3px; text-decoration-color: rgba(255, 255, 255, 0.5);">
                                                    Show Restaurant Menu
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                }
                                {item.status === "OPERATING" && !date.checkPassedDateTime(item.openingTime) && date.checkUpcomingDateTime(item.closingTime) && item.menu.available &&
                                    <div className="grid grid-rows-2 h-full">
                                        <div className="border-b flex flex-col items-center justify-center">
                                            <span className="font-bold">Opening<br/>Soon</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center bg-blue-600 rounded-br-lg">
                                            <a href={item.menu.url} target="_blank" rel="noreferrer noopener" className="flex items-center w-full h-full px-1 text-white text-sm rounded-br-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200">
                                                <span className="underline" style="text-underline-offset: 3px; text-decoration-color: rgba(255, 255, 255, 0.5);">
                                                    Show Restaurant Menu
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                }
                                {item.status === "OPERATING" && date.checkPassedDateTime(item.openingTime) && date.checkUpcomingDateTime(item.closingTime) && !item.menu.available && <div><span className="font-bold">Open</span></div>}
                                {item.status === "OPERATING" && !date.checkPassedDateTime(item.openingTime) && date.checkUpcomingDateTime(item.closingTime) && !item.menu.available && <div><span className="font-bold">Opening<br/>Soon</span></div>}
                                {item.status === "REFURBISHMENT" && <div className="text-sm font-bold">Under Construction</div>}
                                {(item.status === "CLOSED" || item.status === "CLOSED_OPS" || !date.checkUpcomingDateTime(item.closingTime)) && <div className="font-bold">Closed</div>}
                            </div>
                        </article>
                        {item.mobileOrder.available &&
                            <div className="border border-t-0 text-center bg-gradient-to-t from-yellow-900 to-yellow-700 text-white rounded-b-lg mx-10 row-span-1 shadow-lg p-2 dark:border-gray-700 pb-4">
                                <div className="flex flex-col justify-center text-lg font-bold border-b w-3/4 m-auto mb-2">Mobile Order</div>
                                <div>
                                    <div className="mb-4">
                                        Start your mobile order below:
                                    </div>
                                    <a href={item.mobileOrder.url} target="_blank" rel="noreferrer noopener" className="px-4 py-2 text-white text-base font-medium rounded-md border border-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                                        Open Mobile Order
                                    </a>
                                </div>
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
