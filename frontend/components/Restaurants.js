import {h, Component} from 'preact';
import clsx from 'clsx';

import Error from './Error';

import date from '../utils/date';

export default class Restaurants extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {restaurants, park, sort, search} = this.props;

        const parkRestaurants = restaurants.filter((restaurant) => {
            return restaurant.park.slug === park && restaurant.status !== "UNDEFINED";
        }).sort((a, b) => {
            if(sort === "NAME_DESC") {
                return a.name.localeCompare(b.name);
            }

            if(sort === "NAME_ASC") {
                return b.name.localeCompare(a.name);
            }

            return 0;
        }).filter((restaurant) => {
            return restaurant.name.toLowerCase().includes(search.toLowerCase());
        });

        if(parkRestaurants.length < 1) {
            return <Error message="We couldn&apos;t find any restaurants with your chosen filters" code="NO_RESTAURANTS_AFTER_FILTER_SORT"/>;
        }

        return (
            <div className="grid grid-row-auto gap-4 w-full max-w-5xl px-4 mx-auto">
                {parkRestaurants.map((item, key) => (
                    <div key={key}>
                        <article type="attraction" className="grid gap-4 border rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-4">
                                <h2 className="font-bold">{item.name}<br/><span className="text-xs">({item.cuisines.join(', ')}{(item.cuisines.length > 0 && item.serviceTypes.length > 0) ? ', ' : ''}{item.serviceTypes.join(', ')})</span></h2>
                                <div className="mt-1">
                                    <span className="text-sm">{item.region}</span>
                                    <div className="grid gap-2 grid-row-auto mt-4 w-36 grid-services">
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
                            <div className={clsx("text-center p-0 rounded-r-lg flex flex-col justify-center text-white", item.status === "OPERATING" && date.checkPassedDateTime(item.openingTime) && "bg-green-700", item.status === "REFURBISHMENT" && "construction-color", (item.status === "CLOSED" || item.status === "CLOSED_OPS") && "bg-red-800", item.status === "OPERATING" && !date.checkPassedDateTime(item.openingTime) && "bg-yellow-700")}>
                                {item.status === "OPERATING" && date.checkPassedDateTime(item.openingTime) && item.menu.available &&
                                    <div className="grid grid-rows-2 h-full">
                                        <div className="border-b flex flex-col items-center justify-center">
                                            <span className="font-bold">Open</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center bg-blue-600 rounded-r-lg">
                                            <a href={item.menu.url} target="_blank" rel="noreferrer noopener" className="flex items-center w-full h-full px-1 text-white text-sm rounded-br-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200">
                                                <span className="underline" style="text-underline-offset: 3px; text-decoration-color: rgba(255, 255, 255, 0.5);">
                                                    Show Restaurant Menu
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                }
                                {item.status === "OPERATING" && !date.checkPassedDateTime(item.openingTime) && item.menu.available &&
                                    <div className="grid grid-rows-2 h-full">
                                        <div className="border-b flex flex-col items-center justify-center">
                                            <span className="font-bold">Opening<br/>Soon</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center bg-blue-600 rounded-r-lg">
                                            <a href={item.menu.url} target="_blank" rel="noreferrer noopener" className="flex items-center w-full h-full px-1 text-white text-sm rounded-br-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200">
                                                <span className="underline" style="text-underline-offset: 3px; text-decoration-color: rgba(255, 255, 255, 0.5);">
                                                    Show Restaurant Menu
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                }
                                {item.status === "OPERATING" && date.checkPassedDateTime(item.openingTime) && !item.menu.available && <div><span className="font-bold">Open</span></div>}
                                {item.status === "OPERATING" && !date.checkPassedDateTime(item.openingTime) && !item.menu.available && <div><span className="font-bold">Opening<br/>Soon</span></div>}
                                {item.status === "REFURBISHMENT" && <div className="text-sm font-bold">Under Construction</div>}
                                {(item.status === "CLOSED" || item.status === "CLOSED_OPS") && <div className="font-bold">Closed</div>}
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
                    </div>
                ))}
            </div>
        );
    }
}
