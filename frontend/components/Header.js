import {h, Component} from 'preact';
import clsx from 'clsx';

import storage from '../modules/storage';
import date from '../utils/date';

export default class Header extends Component {
    /**
     * Update the sort
     *
     * @param e
     */
    updateSort(e) {
        storage.set('sort', e.target.value);
        this.props.updateSort(e.target.value);
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {parks, url, sort, updated} = this.props;

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
            <div className="grid grid-rows-2 grid-cols-2 gap-1 p-2 px-4">
                {parkEMT &&
                    <div className="text-center">
                        Extra Magic Time:<br/>{date.getHoursMinutes(`${parkEMT.date}T${parkEMT.startTime}`)} - {date.getHoursMinutes(`${parkEMT.date}T${parkEMT.endTime}`)}
                    </div>
                }
                {parkOpen &&
                    <div className={clsx(!parkEMT && "col-span-2", "text-center")}>
                        Open:<br/>{date.getHoursMinutes(`${parkOpen.date}T${parkOpen.startTime}`)} - {date.getHoursMinutes(`${parkOpen.date}T${parkOpen.endTime}`)}
                    </div>
                }
                <div>
                    <label htmlFor="search" style={{ position: 'absolute', top: '-1000px', left: '-1000px' }}>Search Activities</label>
                    <input type="text" id="search" placeholder="Search" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div>
                    <label htmlFor="sort" style={{ position: 'absolute', top: '-1000px', left: '-1000px' }}>Sort Activities</label>
                    <select id="sort" className="shadow border rounded w-full py-2 px-3 text-gray-700 mt-1 bg-white leading-tight focus:outline-none focus:shadow-outline" onChange={(e) => this.updateSort(e)}>
                        <option selected={sort === "NAME_DESC"} value="NAME_DESC">A-Z</option>
                        <option selected={sort === "NAME_ASC"} value="NAME_ASC">Z-A</option>
                        <option selected={sort === "WAIT_TIME_STANDBY_DESC"} value="WAIT_TIME_STANDBY_DESC">Shortest Standby Wait Time</option>
                        <option selected={sort === "WAIT_TIME_STANDBY_ASC"} value="WAIT_TIME_STANDBY_ASC">Longest Standby Wait Time</option>
                        <option selected={sort === "SINGLE_RIDER_AVAILABILITY"} value="SINGLE_RIDER_AVAILABILITY">Single Rider Availability</option>
                        <option selected={sort === "PREMIER_ACCESS_AVAILABILITY"} value="PREMIER_ACCESS_AVAILABILITY">Premier Access Availability</option>
                        <option selected={sort === "ATTRACTION_STATUS"} value="ATTRACTION_STATUS">Attraction Status</option>
                    </select>
                </div>
                {updated !== null &&
                    <div className="col-span-2 text-center text-sm">
                        Last updated: {date.getDateFormatted(updated)}
                    </div>
                }
            </div>
        );
    }
}
