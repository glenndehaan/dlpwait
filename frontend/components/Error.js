import {h, Component} from 'preact';

import arrays from '../utils/arrays';
import storage from '../modules/storage';

export default class Error extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            showDetails: false
        };
    }

    /**
     * Show error details
     */
    showDetails() {
        this.setState({
            showDetails: true
        });
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {message, code = '', api = true} = this.props;
        const {showDetails} = this.state;

        return (
            <div className="flex-1 px-12 py-24 flex flex-col justify-center items-center text-primary">
                <button onClick={() => this.showDetails()}>
                    <span className="border border-dashed border-secondary border-black flex items-center justify-center w-24 h-24 bg-primary rounded-lg text-red-500 dark:border-white">
                        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="48px" viewBox="0 0 24 24" width="48px" className="fill-current">
                            <path d="M16.5,3c-0.96,0-1.9,0.25-2.73,0.69L12,9h3l-3,10l1-9h-3l1.54-5.39C10.47,3.61,9.01,3,7.5,3C4.42,3,2,5.42,2,8.5 c0,4.13,4.16,7.18,10,12.5c5.47-4.94,10-8.26,10-12.5C22,5.42,19.58,3,16.5,3z"/>
                        </svg>
                    </span>
                </button>
                <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">Oh no!?</h2>
                <p className="text-accent-6 px-10 text-center pt-2">{message}</p>
                {!showDetails &&
                    <p className="text-accent-6 text-sm italic px-10 text-center pt-2">Click the &quot;heart&quot; for technical details</p>
                }
                {showDetails &&
                    <p className="text-accent-6 px-8 text-center text-sm py-2 shadow border rounded text-gray-700 mt-4 leading-tight dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <div>{code} ({arrays.asciiToHex(code)})</div>
                        <div className="grid grid-cols-2 gap-2 p-2 bg-white dark:bg-gray-800 rounded my-2">
                            <span className="text-right">Browser Online:</span><span>{window.navigator.onLine ? 'Yes' : 'No'}</span>
                            <span className="text-right">API Online:</span><span>{api ? 'Yes' : 'No'}</span>
                            <span className="text-right">Code Version:</span><span>{window.appVer}</span>
                            <span className="text-right">Storage Version:</span><span>{storage.get('version') || 0}</span>
                            <span className="text-right">Notification Permission:</span><span>{'Notification' in window ? Notification.permission : 'not available'}</span>
                        </div>
                        <div>Created by: Glenn de Haan (https://github.com/glenndehaan)</div>
                    </p>
                }
            </div>
        );
    }
}
