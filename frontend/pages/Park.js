import {h, Component} from 'preact';
import clsx from 'clsx';

import Error from '../components/Error';

import date from '../utils/date';

export default class Park extends Component {
    /**
     * Runs after component mounts
     */
    componentDidMount() {
        this.updatePageTitle();
    }

    /**
     * Runs after component updates
     */
    componentDidUpdate() {
        this.updatePageTitle();
    }

    /**
     * Updates the page title
     */
    updatePageTitle() {
        const parkInfo = this.props.parks.find((e) => {
            return e.slug === this.props.park;
        });

        document.title = `${parkInfo ? parkInfo.name : 'Park'} | DLP Wait Times`;
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {error, attractions, park, sort, search} = this.props;

        if(error) {
            return <Error/>
        }

        const parkAttractions = attractions.filter((attraction) => {
            return attraction.park.slug === park && attraction.status !== "UNDEFINED";
        }).sort((a, b) => {
            if(sort === "NAME_DESC") {
                return a.name.localeCompare(b.name);
            }

            if(sort === "NAME_ASC") {
                return b.name.localeCompare(a.name);
            }

            if(sort === "WAIT_TIME_STANDBY_DESC") {
                return a.waitTime.standby.minutes - b.waitTime.standby.minutes;
            }

            if(sort === "WAIT_TIME_STANDBY_ASC") {
                return b.waitTime.standby.minutes - a.waitTime.standby.minutes;
            }

            if(sort === "SINGLE_RIDER_AVAILABILITY") {
                return b.waitTime.singleRider.available - a.waitTime.singleRider.available;
            }

            if(sort === "PREMIER_ACCESS_AVAILABILITY") {
                return b.premierAccess.available - a.premierAccess.available;
            }

            if(sort === "ATTRACTION_STATUS") {
                return b.status.localeCompare(a.status);
            }

            return 0;
        }).sort((a, b) => {
            if(sort === "WAIT_TIME_STANDBY_DESC" || sort === "WAIT_TIME_STANDBY_ASC" || sort === "SINGLE_RIDER_AVAILABILITY" || sort === "PREMIER_ACCESS_AVAILABILITY") {
                return b.status === "OPERATING" ? 1 : -1;
            }

            if(sort === "ATTRACTION_STATUS") {
                return b.status === "OPERATING" ? -1 : 1;
            }

            return 0;
        }).filter((attraction) => {
            return attraction.name.toLowerCase().includes(search.toLowerCase());
        });

        return (
            <div className="grid grid-row-auto gap-4 w-full max-w-5xl px-4 mx-auto">
                {parkAttractions.map((item, key) => (
                    <div key={key}>
                        <article className="grid gap-4 border rounded-lg shadow-lg">
                            <div className="p-4">
                                <h2 className="font-bold">{item.name}</h2>
                                <div className="mt-2">
                                    <span className="text-sm">{item.region}</span>
                                    <div>
                                        {item.services.photoPass && <span className="bg-gray-200 rounded p-1 mr-1 text-sm">Photo Pass</span>}
                                        {item.services.singleRider && <span className="bg-gray-200 rounded p-1 mr-1 text-sm">Single Rider</span>}
                                    </div>
                                    {item.status !== "REFURBISHMENT" &&
                                        <div className="mt-2">
                                            <span className="bg-blue-300 rounded p-1 mr-1 text-sm">{date.getHoursMinutes(item.openingTime)} - {date.getHoursMinutes(item.closingTime)}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className={clsx("text-center p-0 rounded-r-lg flex flex-col justify-center", item.status === "OPERATING" && "bg-green-500", item.status === "REFURBISHMENT" && "construction-color text-white", (item.status === "CLOSED" || item.status === "CLOSED_OPS") && "bg-red-400", item.status === "DOWN" && "bg-yellow-500")}>
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
                            <div className="border border-t-0 text-center bg-gradient-to-r from-red-500 to-red-400 text-white rounded-b-lg mx-10 row-span-1 shadow-lg p-2">
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
                    </div>
                ))}
            </div>
        );
    }
}
