import {h, Component} from 'preact';

import Error from './Error';

import date from '../utils/date';

export default class Weather extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {weather, debug} = this.props;

        const weatherForecast = weather.hourly.filter((forecast) => {
            return !date.checkPassedDateTime(forecast.time);
        });

        if(weatherForecast.length < 1) {
            return <Error message="We couldn&apos;t find any weather data with your chosen filters" code="NO_WEATHER_AFTER_FILTER_SORT"/>;
        }

        return (
            <div className="grid grid-row-auto gap-4 w-full max-w-5xl px-4 mx-auto">
                {weatherForecast.map((item, key) => (
                    <div key={key}>
                        <article type="weather" className="grid gap-4 border rounded-lg shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-4">
                                <h2 className="font-bold">
                                    {item.wmo.description}
                                </h2>
                                <div className="mt-1">
                                    <div className="grid gap-2 grid-row-auto mt-4 w-36 grid-services">
                                        <span className="bg-gray-200 rounded p-1 mr-1 pr-2 text-sm text-black h-8">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current inline-block h-6 w-6 align-middle mr-1">
                                                <path d="M12,2c-5.33,4.55-8,8.48-8,11.8c0,4.98,3.8,8.2,8,8.2s8-3.22,8-8.2C20,10.48,17.33,6.55,12,2z M7.83,14 c0.37,0,0.67,0.26,0.74,0.62c0.41,2.22,2.28,2.98,3.64,2.87c0.43-0.02,0.79,0.32,0.79,0.75c0,0.4-0.32,0.73-0.72,0.75 c-2.13,0.13-4.62-1.09-5.19-4.12C7.01,14.42,7.37,14,7.83,14z"/>
                                            </svg>
                                            <span className="inline-block align-middle">{item.rain} mm</span>
                                        </span>
                                        <span className="bg-blue-300 rounded p-1 mr-1 pr-2 text-sm text-black h-8">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current inline-block h-6 w-6 align-middle mr-1">
                                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                                                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                                            </svg>
                                            <span className="inline-block align-middle">{date.getHoursMinutes(item.time)}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={"text-center p-0 rounded-r-lg flex flex-col justify-center text-white bg-blue-600"}>
                                <div className="text-sm font-bold">
                                    {item.temperature} &#8451;
                                </div>
                            </div>
                        </article>
                        {debug &&
                            <pre className="text-debug">{JSON.stringify(item, undefined, 2)}</pre>
                        }
                    </div>
                ))}
            </div>
        );
    }
}
