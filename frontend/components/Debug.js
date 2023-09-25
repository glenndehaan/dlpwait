import {h, Component} from 'preact';

import storage from '../modules/storage';

export default class Debug extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {store} = this.props;
        // eslint-disable-next-line no-unused-vars
        const {attractions, entertainment, gps, restaurants, parks, weather, favourites, updateAvailableDialog, ...restStore} = {...store};

        return (
            <div className="fixed w-full bottom-0 left-0 z-debug bg-gray-900/[.80] pointer-events-none">
                <div className="grid grid-debug gap-2">
                    <div className="text-debug">
                        <h2 className="italic font-bold">STATES</h2>
                        <pre className="text-debug overflow-auto">{JSON.stringify(restStore, undefined, 2)}</pre>
                    </div>
                    <div className="text-debug">
                        <h2 className="italic font-bold">APP VERSION</h2>
                        <pre className="overflow-auto">{window.appVer}</pre>
                        <h2 className="italic font-bold">STORAGE VERSION</h2>
                        <pre className="overflow-auto">{storage.get('version') || 0}</pre>
                        <h2 className="italic font-bold">SERVICE WORKER</h2>
                        <pre className="overflow-auto">{'serviceWorker' in navigator ? navigator.serviceWorker.controller.state : 'not available'}</pre>
                        <h2 className="italic font-bold">NOTIFICATION</h2>
                        <pre className="overflow-auto">{'Notification' in window ? Notification.permission : 'not available'}</pre>
                        <h2 className="italic font-bold">GPS</h2>
                        <pre className="text-debug overflow-auto">{JSON.stringify(store.gps, undefined, 2)}</pre>
                    </div>
                </div>
                <pre className="text-debug overflow-auto">{navigator.userAgent} ({window.innerWidth}x{window.innerHeight}, {window.devicePixelRatio})</pre>
            </div>
        );
    }
}
