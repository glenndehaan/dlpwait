import {h, Component} from 'preact';

import date from '../utils/date';

export default class Park extends Component {
    /**
     * Runs after component mounts
     */
    componentDidMount() {
        document.title = 'Home | DLP Wait Times';
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {attractions, park} = this.props;
        const parkAttractions = attractions.filter((attraction) => {
            return attraction.park.slug === park && attraction.status !== "UNDEFINED";
        });

        console.log('parkAttractions', parkAttractions);

        return (
            <div className="grid grid-row-auto gap-4">
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
                                </div>
                            </div>
                            <div className="text-center bg-green-500 p-0 rounded-r-lg flex flex-col justify-center">
                                {item.waitTime.standby.minutes} min
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
