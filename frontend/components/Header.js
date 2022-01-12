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

        const parkFilter = parks.filter((item) => {
            return item.slug === url.replace('/', '');
        });
        const parkOpen = parkFilter[0] ? parkFilter[0].schedules.filter((item) => {
            return item.status === "OPERATING";
        }) : [];
        const parkEMT = parkFilter[0] ? parkFilter[0].schedules.filter((item) => {
            return item.status === "EXTRA_MAGIC_HOURS";
        }) : [];

        return (
            <div className="grid grid-rows-2 grid-cols-2 gap-4 p-2">
                {parkEMT[0] &&
                    <div className="text-center">
                        Extra Magic Time:<br/>{date.getHoursMinutes(`${parkEMT[0].date}T${parkEMT[0].startTime}`)} - {date.getHoursMinutes(`${parkEMT[0].date}T${parkEMT[0].endTime}`)}
                    </div>
                }
                {parkOpen[0] &&
                    <div className={clsx(!parkEMT[0] && "col-span-2", "text-center")}>
                        Open:<br/>{date.getHoursMinutes(`${parkOpen[0].date}T${parkOpen[0].startTime}`)} - {date.getHoursMinutes(`${parkOpen[0].date}T${parkOpen[0].endTime}`)}
                    </div>
                }
                <div>
                    <input type="text" placeholder="Search" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-100"/>
                </div>
                <div>
                    <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-100">
                        <option disabled selected>Sort</option>
                    </select>
                </div>
            </div>
        );
    }
}
