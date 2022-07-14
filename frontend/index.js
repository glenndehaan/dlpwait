// Must be the first import
if (process.env.NODE_ENV === 'development') {
    // Must use require here as import statements are only allowed
    // to exist at top-level.
    require("preact/debug");
}

import {h, render, Component} from 'preact';
import Router from 'preact-router';
import splitbee from '@splitbee/web';

import Header from './components/Header';
import Footer from './components/Footer';
import Dialog from './components/Dialog';

import Redirect from './pages/Redirect';
import Park from './pages/Park';
import PrivacyPolicy from './pages/PrivacyPolicy';

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
console.log(`DLP Wait\n\nCode Version: ${window.appVer}\nStorage Version: ${storage.get('version') || 0}\nNotification Permission: ${'Notification' in window ? Notification.permission : 'not available'}\nCreated by: Glenn de Haan (https://github.com/glenndehaan)`);

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

        splitbee.init();

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
            generic: {
                waitTimesUpdated: new Date('0')
            },
            attractions: [],
            entertainment: [],
            restaurants: [],
            updated: null,
            search: storage.get('search') || '',
            sort: storage.get('sort') || 'NAME_DESC',
            view: storage.get('view') || 'attractions',
            fetch: false,
            error: false,
            updateAvailableDialog: false
        }

        this.views = [
            'attractions',
            'entertainment',
            'restaurants'
        ]

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
                error: false,
                generic: {
                    waitTimesUpdated: new Date(data.data.generic.waitTimesUpdated)
                },
                parks: data.data.parks,
                attractions: data.data.attractions,
                entertainment: data.data.entertainment,
                restaurants: data.data.restaurants,
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

        splitbee.track("Sort", {
            type: sort
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
     * Switches between all available views
     */
    switchViews() {
        const currentView = this.views.indexOf(this.state.view);
        const newView = this.views[(currentView + 1) < this.views.length ? currentView + 1 : 0];

        storage.set('view', newView);
        storage.set('search', '');
        storage.set('sort', 'NAME_DESC');

        this.setState({
            search: '',
            sort: 'NAME_DESC',
            view: newView
        });

        if(this.mainDiv !== null) {
            this.mainDiv.scrollTop = 0;
        }

        splitbee.track("Switch Views", {
            view: newView
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
        const {fetch, error, url, generic, parks, attractions, entertainment, restaurants, sort, search, view, updated, updateAvailableDialog} = this.state;

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
                    <Header url={url} generic={generic} parks={parks} sort={sort} updated={updated} search={search} view={view} updateData={() => this.getData()} updateSort={(sort) => this.updateSort(sort)} updateSearch={(string) => this.updateSearch(string)} switchViews={() => this.switchViews()}/>
                </header>
                <main ref={c => this.mainDiv = c}>
                    <Router onChange={(e) => this.routerUpdate(e)}>
                        <Park path="/:park" parks={parks} attractions={attractions} entertainment={entertainment} restaurants={restaurants} sort={sort} search={search} view={view} error={error}/>
                        <PrivacyPolicy path="/privacy-policy"/>
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
