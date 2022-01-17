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
            return entertainment.park.slug === park && entertainment.schedules.length > 0;
        }).filter((entertainment) => {
            let items = 0;

            for(let item = 0; item < entertainment.schedules.length; item++) {
                const event = entertainment.schedules[item];
                if(!date.checkPassedDateTime(`${event.date}T${event.startTime}`)) {
                    items++;
                }
            }

            return items > 0;
        }).sort((a, b) => {
            if(sort === "NAME_DESC") {
                return a.name.localeCompare(b.name);
            }

            if(sort === "NAME_ASC") {
                return b.name.localeCompare(a.name);
            }

            return 0;
        }).filter((entertainment) => {
            return entertainment.name.toLowerCase().includes(search.toLowerCase());
        });

        if(parkEntertainment.length < 1) {
            return <Error message="It seems there is no entertainment available at the moment"/>;
        }

        return (
            <div className="grid grid-row-auto gap-4 w-full max-w-5xl px-4 mx-auto">
                {parkEntertainment.map((item, key) => (
                    <div key={key}>
                        <article type="entertainment" className="grid gap-4 border rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-4">
                                <h2 className="font-bold">{item.name}</h2>
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
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-r-lg flex flex-col justify-center text-white bg-blue-600 whitespace-nowrap">
                                <div className="grid grid-rows-auto px-1 py-2 gap-2">
                                    {item.schedules.map((event, key) => {
                                        if(!date.checkPassedDateTime(`${event.date}T${event.startTime}`)) {
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
                        </article>
                    </div>
                ))}
            </div>
        );
    }
}
