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
                                <div className="mt-2">
                                    <span className="text-sm">{item.region}</span>
                                    <div>
                                        {item.services.photoPass && <span className="bg-gray-200 rounded p-1 mr-1 text-sm text-black">Photo Pass</span>}
                                        {item.services.singleRider && <span className="bg-gray-200 rounded p-1 mr-1 text-sm text-black">Single Rider</span>}
                                    </div>
                                </div>
                            </div>
                            <div className={"p-0 rounded-r-lg flex flex-col justify-center text-white bg-blue-600"}>
                                <div className="grid grid-rows-2 h-full px-1 py-2 gap-2">
                                    {item.schedules.map((event, key) => (
                                        <div key={key} className="flex flex-col justify-center">
                                            <span className="font-bold text-left">{event.language !== "" && <Flags lang={event.language}/>} {date.getHoursMinutes(`${event.date}T${event.startTime}`)} - {date.getHoursMinutes(`${event.date}T${event.endTime}`)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </article>
                    </div>
                ))}
            </div>
        );
    }
}
