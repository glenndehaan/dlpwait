import {h, Component} from 'preact';

import Flags from './Flags';
import Error from './Error';

import date from '../utils/date';

export default class Entertainment extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {entertainment, park, sort, search} = this.props;

        const parkEntertainment = entertainment.filter((entertainment) => {
            return entertainment.park.slug === park && (entertainment.schedules.length > 0 || entertainment.virtualQueue.available);
        }).filter((entertainment) => {
            let items = 0;

            for(let item = 0; item < entertainment.schedules.length; item++) {
                const event = entertainment.schedules[item];
                if(!date.checkPassedDateTime(`${event.date}T${event.startTime}`)) {
                    items++;
                }
            }

            return items > 0 || entertainment.virtualQueue.available;
        }).sort((a, b) => {
            // Sort/group by photo pass availability
            if(sort === "PHOTO_PASS_AVAILABILITY") {
                if (a.services.photoPass > b.services.photoPass) return -1;
                if (a.services.photoPass < b.services.photoPass) return 1;
            }

            // Sort/group by meet & greet
            if(sort === "MEET_AND_GREET_CATEGORY") {
                if ((a.category === 'Character Experience - Meet & Greet') > (b.category === 'Character Experience - Meet & Greet')) return -1;
                if ((a.category === 'Character Experience - Meet & Greet') < (b.category === 'Character Experience - Meet & Greet')) return 1;
            }

            // Sort/group by shows
            if(sort === "SHOWS_CATEGORY") {
                if ((a.category === 'Character Experience - Meet & Greet') > (b.category === 'Character Experience - Meet & Greet')) return 1;
                if ((a.category === 'Character Experience - Meet & Greet') < (b.category === 'Character Experience - Meet & Greet')) return -1;
            }

            // Sort/group attractions alphabetical on name
            if (a.name > b.name) return sort === "NAME_DESC" ? 1 : sort === "NAME_ASC" ? -1 : 1;
            if (a.name < b.name) return sort === "NAME_DESC" ? -1 : sort === "NAME_ASC" ? 1 : -1;
        }).filter((entertainment) => {
            return entertainment.name.toLowerCase().includes(search.toLowerCase());
        });

        if(parkEntertainment.length < 1) {
            return <Error message="We couldn&apos;t find any entertainment with your chosen filters" code="NO_ENTERTAINMENT_AFTER_FILTER_SORT"/>;
        }

        return (
            <div className="grid grid-row-auto gap-4 w-full max-w-5xl px-4 mx-auto">
                {parkEntertainment.map((item, key) => (
                    <div key={key}>
                        <article type="entertainment" className="grid gap-4 border rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-4">
                                <h2 className="font-bold">{item.name}<br/><span className="text-xs">({item.category})</span></h2>
                                <div className="mt-1">
                                    <span className="text-sm">{item.region}</span>
                                    <div className="grid gap-2 grid-row-auto mt-4 w-32 grid-services">
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
                                        {(item.duration.hours !== 0 || item.duration.minutes !== 0) &&
                                            <span className="bg-blue-300 rounded p-1 mr-1 pr-2 text-sm text-black h-8">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" className="fill-current inline-block h-6 w-6 align-middle mr-1">
                                                    <path d="M360 196v-60h240v60H360Zm90 447h60V413h-60v230Zm30 332q-74 0-139.5-28.5T226 869q-49-49-77.5-114.5T120 615q0-74 28.5-139.5T226 361q49-49 114.5-77.5T480 255q67 0 126 22.5T711 340l51-51 42 42-51 51q36 40 61.5 97T840 615q0 74-28.5 139.5T734 869q-49 49-114.5 77.5T480 975Zm0-60q125 0 212.5-87.5T780 615q0-125-87.5-212.5T480 315q-125 0-212.5 87.5T180 615q0 125 87.5 212.5T480 915Zm0-299Z"/>
                                                </svg>
                                                <span className="inline-block align-middle">
                                                    {item.duration.hours !== 0 ? `${item.duration.hours} h`: ''}
                                                    {item.duration.hours !== 0 && item.duration.minutes !== 0 ? ', ' : ''}
                                                    {item.duration.minutes !== 0 ? `${item.duration.minutes} m`: ''}
                                                </span>
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                            {!item.services.virtualQueue &&
                                <div className="p-4 rounded-r-lg flex flex-col justify-center text-white bg-blue-600 whitespace-nowrap">
                                    <div className="grid grid-rows-auto px-1 py-2 gap-2">
                                        {item.schedules.map((event, key) => {
                                            if (!date.checkPassedDateTime(`${event.date}T${event.startTime}`)) {
                                                return (
                                                    <div key={key} className="flex flex-col justify-center">
                                                        <span className="font-bold text-left">
                                                            {event.language !== "" && <Flags lang={event.language}/>}
                                                            <span className="inline-block align-middle">{date.getHoursMinutes(`${event.date}T${event.startTime}`)}</span>
                                                        </span>
                                                    </div>
                                                )
                                            }

                                            return null;
                                        })}
                                    </div>
                                </div>
                            }
                        </article>
                        {item.services.virtualQueue &&
                            <div className="border border-t-0 text-center bg-gradient-to-t from-blue-800 to-blue-600 text-white rounded-b-lg mx-10 row-span-1 shadow-lg p-2 dark:border-gray-700">
                                <div className="flex flex-col justify-center text-lg font-bold border-b w-3/4 m-auto mb-2">Virtual Queue</div>

                                <div>
                                    Timeslot / status:<br/>
                                    {item.virtualQueue.queues.filter((item) => {
                                        return item.status !== "FINISHED";
                                    }).map((item, key) => (
                                        <div key={key} className="text-sm">
                                            {date.getHoursMinutes(item.openingTime)} - {date.getHoursMinutes(item.closingTime)}&nbsp;/&nbsp;
                                            {item.status === 'OPEN' && <span>Available - Slot: {date.getHoursMinutes(item.nextTimeSlot)}</span>}
                                            {item.status === 'CLOSED' && <span>Opening Soon</span>}
                                            {item.status === 'FULL' && <span>Full</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                ))}
            </div>
        );
    }
}
