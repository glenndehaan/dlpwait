// Must be the first import
if (process.env.NODE_ENV === 'development') {
    // Must use require here as import statements are only allowed
    // to exist at top-level.
    require("preact/debug");
}

import {h, render, Component} from 'preact';
import Router from 'preact-router';

import Header from './components/Header';
import Footer from './components/Footer';
import Dialog from './components/Dialog';

import Redirect from './pages/Redirect';
import Park from './pages/Park';

import storage from './modules/storage';

import {validateServiceWorkerInstance} from './utils/sw';
import fetch from './utils/fetch';
import query from './utils/query';

import 'tailwindcss/tailwind.css';

/**
 * Run storage updates
 */
storage.update();

/**
 * Log intro
 */
console.log(`DLP Wait\n\nCode Version: ${window.appVer}\nStorage Version: ${storage.get('version') || 0}\nCreated by: Glenn de Haan (https://github.com/glenndehaan)`);

/**
 * Validate service worker
 */
validateServiceWorkerInstance("/kill-switch.txt");

/**
 * Initialize the app
 */
class App extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        if ('serviceWorker' in navigator) {
            if(navigator.serviceWorker.controller !== null) {
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    this.setState({
                        updateAvailableDialog: true
                    });
                });
            }
        }

        this.state = {
            url: '/',
            parks: [],
            attractions: [],
            entertainment: [],
            updated: null,
            search: storage.get('search') || '',
            sort: storage.get('sort') || 'NAME_DESC',
            fetch: false,
            error: false,
            updateAvailableDialog: false
        }

        window.site = {};
        window.site.production = process.env.NODE_ENV === 'production';

        this.mainDiv = null;
    }

    /**
     * Function runs then component mounts
     */
    componentWillMount() {
        this.getData();

        // Get new data every 2 minutes
        setInterval(() => {
            this.getData();
        }, 2 * 60 * 1000);
    }

    /**
     * Get all data from the API
     */
    async getData() {
        const data = await fetch(window.site.production ? 'https://api.dlpwait.com' : `http://${window.location.hostname}:4001`, query);

        if(data) {
            this.setState({
                fetch: true,
                parks: data.data.parks,
                attractions: data.data.attractions,
                entertainment: data.data.entertainment,
                updated: new Date()
            });
        } else {
            this.setState({
                fetch: true,
                error: true,
                updated: new Date()
            });
        }
    }

    /**
     * Handle route updates
     *
     * @param e
     */
    routerUpdate(e) {
        if(this.mainDiv !== null) {
            this.mainDiv.scrollTop = 0;
        }

        this.setState({
            url: e.url
        });
    }

    /**
     * Update the sort
     *
     * @param sort
     */
    updateSort(sort) {
        storage.set('sort', sort);

        this.setState({
            sort
        });
    }

    /**
     * Update the search
     *
     * @param string
     */
    updateSearch(string) {
        storage.set('search', string);

        this.setState({
            search: string
        });
    }

    /**
     * Updates the app
     */
    update() {
        window.location.reload();
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {fetch, error, url, parks, attractions, entertainment, sort, search, updated, updateAvailableDialog} = this.state;

        // Prevent layout shifts
        if(!fetch) {
            return null;
        }

        return (
            <div id="root" className="bg-white dark:bg-gray-900 dark:text-gray-100">
                {updateAvailableDialog &&
                    <Dialog title="Update Ready!" description="Sorry for the interruption but we have an important update available... Click the update button below to update now." button="Update" onClick={() => this.update()}/>
                }
                <header>
                    <Header url={url} parks={parks} sort={sort} updated={updated} search={search} updateSort={(sort) => this.updateSort(sort)} updateSearch={(string) => this.updateSearch(string)}/>
                </header>
                <main ref={c => this.mainDiv = c}>
                    <Router onChange={(e) => this.routerUpdate(e)}>
                        <Park path="/:park" parks={parks} attractions={attractions} entertainment={entertainment} sort={sort} search={search} error={error}/>
                        <Redirect path="/" to="/disneyland-park"/>
                    </Router>
                </main>
                <footer>
                    <Footer url={url}/>
                </footer>
            </div>
        );
    }
}

render(<App/>, document.body);
