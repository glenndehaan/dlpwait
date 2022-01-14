import {h, Component} from 'preact';
import clsx from 'clsx';

import date from '../utils/date';

export default class Header extends Component {
    /**
     * Update the sort
     *
     * @param e
     */
    updateSort(e) {
        this.props.updateSort(e.target.value);
    }

    /**
     * Update the search
     *
     * @param e
     */
    updateSearch(e) {
        this.props.updateSearch(e.target.value);
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {parks, url, sort, search, entertainmentView, updated, updateData, switchViews} = this.props;

        const parkFilter = parks.find((item) => {
            return item.slug === url.replace('/', '');
        });
        const parkOpen = parkFilter ? parkFilter.schedules.find((item) => {
            return item.status === "OPERATING";
        }) : false;
        const parkEMT = parkFilter ? parkFilter.schedules.find((item) => {
            return item.status === "EXTRA_MAGIC_HOURS";
        }) : false;

        return (
            <div className={clsx("grid grid-cols-2 gap-1 p-2 px-4 bg-white dark:bg-gray-800", !parkOpen && !parkEMT && "grid-rows-2" , (parkOpen || parkEMT) && "grid-rows-3")}>
                <div className="col-span-2 grid-title-bar">
                    <div className="text-3xl font-bold flex items-center">
                        <a href="/">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current inline-block h-8 w-8 align-middle mr-2">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                            </svg>
                            <h1 className="inline-block align-middle">DLP Wait</h1>
                        </a>
                    </div>
                    <div className="flex justify-center items-center mx-auto">
                        <button aria-label="Attractions / Entertainment" onClick={() => switchViews()}>
                            {!entertainmentView &&
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current h-10 w-10">
                                    <path d="M2,16.5C2,19.54,4.46,22,7.5,22s5.5-2.46,5.5-5.5V10H2V16.5z M7.5,18.5C6.12,18.5,5,17.83,5,17h5 C10,17.83,8.88,18.5,7.5,18.5z M10,13c0.55,0,1,0.45,1,1c0,0.55-0.45,1-1,1s-1-0.45-1-1C9,13.45,9.45,13,10,13z M5,13 c0.55,0,1,0.45,1,1c0,0.55-0.45,1-1,1s-1-0.45-1-1C4,13.45,4.45,13,5,13z"/>
                                    <path d="M11,3v6h3v2.5c0-0.83,1.12-1.5,2.5-1.5c1.38,0,2.5,0.67,2.5,1.5h-5V14v0.39c0.75,0.38,1.6,0.61,2.5,0.61 c3.04,0,5.5-2.46,5.5-5.5V3H11z M14,8.08c-0.55,0-1-0.45-1-1c0-0.55,0.45-1,1-1s1,0.45,1,1C15,7.64,14.55,8.08,14,8.08z M19,8.08 c-0.55,0-1-0.45-1-1c0-0.55,0.45-1,1-1s1,0.45,1,1C20,7.64,19.55,8.08,19,8.08z"/>
                                </svg>
                            }
                            {entertainmentView &&
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current h-10 w-10">
                                    <path d="M10.43,18.75C10.8,18.29,11.37,18,12,18c0.63,0,1.19,0.29,1.56,0.75c0.39-0.09,0.76-0.21,1.12-0.36l-1.42-3.18 c-0.39,0.15-0.82,0.23-1.26,0.23c-0.46,0-0.9-0.09-1.3-0.25l-1.43,3.19C9.65,18.54,10.03,18.67,10.43,18.75z M5.15,10 c-0.16,0.59-0.25,1.21-0.25,1.85c0,0.75,0.12,1.47,0.33,2.15c0.63,0.05,1.22,0.4,1.56,0.99c0.33,0.57,0.35,1.23,0.11,1.79 c0.27,0.27,0.56,0.53,0.87,0.76l1.52-3.39v0c-0.47-0.58-0.75-1.32-0.75-2.13c0-1.89,1.55-3.41,3.46-3.41 c1.91,0,3.46,1.53,3.46,3.41c0,0.82-0.29,1.57-0.78,2.16l1.5,3.35c0.32-0.24,0.62-0.5,0.9-0.79c-0.22-0.55-0.2-1.2,0.12-1.75 c0.33-0.57,0.9-0.92,1.52-0.99c0.22-0.68,0.34-1.41,0.34-2.16c0-0.64-0.09-1.27-0.25-1.86c-0.64-0.04-1.26-0.39-1.6-1 c-0.36-0.62-0.35-1.36-0.03-1.95c-0.91-0.98-2.1-1.71-3.44-2.05C13.39,5.6,12.74,6,12,6c-0.74,0-1.39-0.41-1.74-1.01 C8.92,5.33,7.73,6.04,6.82,7.02C7.15,7.62,7.17,8.37,6.8,9C6.45,9.62,5.81,9.97,5.15,10z M3.85,9.58C3.07,8.98,2.83,7.88,3.34,7 c0.51-0.88,1.58-1.23,2.49-0.85c1.11-1.17,2.56-2.03,4.18-2.42C10.15,2.75,10.99,2,12,2c1.01,0,1.85,0.75,1.98,1.73 c1.63,0.39,3.07,1.24,4.18,2.42c0.91-0.38,1.99-0.03,2.49,0.85c0.51,0.88,0.27,1.98-0.51,2.58c0.23,0.77,0.35,1.58,0.35,2.42 s-0.12,1.65-0.35,2.42c0.78,0.6,1.02,1.7,0.51,2.58c-0.51,0.88-1.58,1.23-2.49,0.85c-0.4,0.43-0.85,0.81-1.34,1.15l1.34,3H16.3 l-0.97-2.17c-0.43,0.18-0.88,0.33-1.34,0.44C13.85,21.25,13.01,22,12,22c-1.01,0-1.85-0.75-1.98-1.73 C9.54,20.15,9.08,20,8.64,19.81L7.66,22H5.78l1.36-3.03c-0.47-0.33-0.91-0.71-1.3-1.12C4.92,18.23,3.85,17.88,3.34,17 c-0.51-0.88-0.27-1.98,0.51-2.58C3.62,13.65,3.5,12.84,3.5,12S3.62,10.35,3.85,9.58z"/>
                                </svg>
                            }
                        </button>
                    </div>
                    <div className="flex justify-center items-center mx-auto">
                        <button aria-label="Notifications" onClick={() => alert('Feature not implemented yet!')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current h-10 w-10">
                                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                            </svg>
                        </button>
                    </div>
                    <div className="flex justify-center items-center mx-auto">
                        <button aria-label="Reload Data" onClick={() => updateData()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current h-10 w-10">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="search" style={{ position: 'absolute', top: '-1000px', left: '-1000px' }}>Search Activities</label>
                    <input type="text" id="search" autoComplete="off" placeholder={entertainmentView ? "Search entertainment" : "Search attractions"} value={search} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" onKeyUp={(e) => this.updateSearch(e)}/>
                </div>
                <div className="relative inline-block w-full">
                    <label htmlFor="sort" style={{ position: 'absolute', top: '-1000px', left: '-1000px' }}>Sort Activities</label>
                    <select id="sort" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 bg-white leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white" onChange={(e) => this.updateSort(e)}>
                        <option selected={sort === "NAME_DESC"} value="NAME_DESC">A-Z</option>
                        <option selected={sort === "NAME_ASC"} value="NAME_ASC">Z-A</option>
                        <option disabled={entertainmentView} selected={sort === "WAIT_TIME_STANDBY_DESC"} value="WAIT_TIME_STANDBY_DESC">Shortest Standby Wait Time</option>
                        <option disabled={entertainmentView} selected={sort === "WAIT_TIME_STANDBY_ASC"} value="WAIT_TIME_STANDBY_ASC">Longest Standby Wait Time</option>
                        <option disabled={entertainmentView} selected={sort === "SINGLE_RIDER_AVAILABILITY"} value="SINGLE_RIDER_AVAILABILITY">Single Rider Availability</option>
                        <option disabled={entertainmentView} selected={sort === "PREMIER_ACCESS_AVAILABILITY"} value="PREMIER_ACCESS_AVAILABILITY">Premier Access Availability</option>
                        <option disabled={entertainmentView} selected={sort === "ATTRACTION_STATUS"} value="ATTRACTION_STATUS">Attraction Status</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"/>
                        </svg>
                    </div>
                </div>
                {parkEMT &&
                    <div className="text-center text-sm pt-1">
                        Extra Magic Time:<br/>{date.getHoursMinutes(`${parkEMT.date}T${parkEMT.startTime}`)} - {date.getHoursMinutes(`${parkEMT.date}T${parkEMT.endTime}`)}
                    </div>
                }
                {parkOpen &&
                    <div className={clsx(!parkEMT && "col-span-2", "text-center text-sm pt-1")}>
                        Open:<br/>{date.getHoursMinutes(`${parkOpen.date}T${parkOpen.startTime}`)} - {date.getHoursMinutes(`${parkOpen.date}T${parkOpen.endTime}`)}
                    </div>
                }

                {updated !== null &&
                    <div className="col-span-2 text-center text-sm border-t pt-2">
                        Last updated: {date.getDateFormatted(updated)}
                    </div>
                }
            </div>
        );
    }
}
