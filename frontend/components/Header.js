import {h, Component} from 'preact';
import clsx from 'clsx';

import date from '../utils/date';

export default class Header extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {parks, url} = this.props;

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
            <div className="grid grid-rows-2 grid-cols-2 gap-4 p-2 px-4">
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
                    <input type="text" placeholder="Search" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div>
                    <select className="shadow border rounded w-full py-2 px-3 text-gray-700 mt-1 bg-white leading-tight focus:outline-none focus:shadow-outline">
                        <option selected value="NAME_DESC">A-Z</option>
                        <option value="NAME_ASC">Z-A</option>
                        <option value="WAIT_TIME_STANDBY_DESC">Shortest Standby Wait Time</option>
                        <option value="WAIT_TIME_STANDBY_ASC">Longest Standby Wait Time</option>
                        <option value="WAIT_TIME_SINGLE_RIDER_DESC">Single Rider Availability</option>
                        <option value="PREMIER_ACCESS_DESC">Premier Access Availability</option>
                    </select>
                </div>
            </div>
        );
    }
}
