// Must be the first import
if (process.env.NODE_ENV === 'development') {
    // Must use require here as import statements are only allowed
    // to exist at top-level.
    require("preact/debug");
}

import {h, render, Component} from 'preact';
import Router from 'preact-router';
import splitbee from '@splitbee/web';
import clsx from 'clsx';

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
import geo from './utils/geo';

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

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.querySelector('html').setAttribute('style', 'color-scheme: dark;');
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const newColorScheme = event.matches ? "dark" : "light";

            if(newColorScheme === 'light') {
                document.querySelector('html').removeAttribute('style');
            } else {
                document.querySelector('html').setAttribute('style', 'color-scheme: dark;');
            }
        });

        this.state = {
            url: '/',
            parks: [],
            generic: {
                waitTimesUpdated: new Date('0')
            },
            weather: {
                current: {
                    wmo: {
                        description: ""
                    },
                    temperature: 0
                },
                expected: {
                    wmo: {
                        description: ""
                    },
                    temperature: 0
                }
            },
            attractions: [],
            entertainment: [],
            restaurants: [],
            updated: null,
            search: storage.get(`search_${storage.get('view') || 'attractions'}`) || '',
            sort: storage.get(`sort_${storage.get('view') || 'attractions'}`) || 'NAME_DESC',
            view: storage.get('view') || 'attractions',
            favourites: storage.get('favourites') || [],
            menu: false,
            fetch: false,
            error: false,
            updateAvailableDialog: false,
            gps: {
                error: false,
                denied: false,
                latitude: null,
                longitude: null
            }
        }

        this.views = [
            'attractions',
            'entertainment',
            'restaurants',
            'weather'
        ]

        window.site = {};
        window.site.production = process.env.NODE_ENV === 'production';

        this.mainDiv = null;
        this.gpsUpdate = null;
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

        if(this.state.sort === 'NEAR_ME') {
            this.loadGpsData();
        }
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
                weather: data.data.weather,
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
        storage.set(`sort_${this.state.view}`, sort);

        this.setState({
            sort
        });

        if(sort === 'NEAR_ME') {
            this.loadGpsData();
        } else {
            this.unloadGpsData();
        }

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
        storage.set(`search_${this.state.view}`, string);

        this.setState({
            search: string
        });
    }

    /**
     * Reload the favourites into the state
     */
    reloadFavourites() {
        storage.set(`sort_${this.state.view}`, this.state.view === 'attractions' ? this.state.favourites.length > 0 ? 'FAVOURITES' : 'NAME_DESC' : 'NAME_DESC');

        this.setState({
            favourites: storage.get('favourites') || [],
            sort: this.state.view === 'attractions' ? this.state.favourites.length > 0 ? 'FAVOURITES' : 'NAME_DESC' : 'NAME_DESC'
        });
    }

    /**
     * Switches between all available views
     *
     * @param view
     */
    switchViews(view = undefined) {
        if(typeof view !== "undefined") {
            storage.set('view', view);

            this.setState({
                search: storage.get(`search_${view}`) || '',
                sort: storage.get(`sort_${view}`) || 'NAME_DESC',
                view: view,
                menu: false
            });

            if(storage.get(`sort_${view}`) !== "NEAR_ME") {
                this.unloadGpsData();
            } else {
                this.loadGpsData();
            }

            if(this.mainDiv !== null) {
                this.mainDiv.scrollTop = 0;
            }

            splitbee.track("Switch Views", {
                view: view
            });

            return;
        }

        const currentView = this.views.indexOf(this.state.view);
        const newView = this.views[(currentView + 1) < this.views.length ? currentView + 1 : 0];

        storage.set('view', newView);

        this.setState({
            search: storage.get(`search_${newView}`) || '',
            sort: storage.get(`sort_${newView}`) || 'NAME_DESC',
            view: newView
        });

        if(storage.get(`sort_${newView}`) !== "NEAR_ME") {
            this.unloadGpsData();
        } else {
            this.loadGpsData();
        }

        if(this.mainDiv !== null) {
            this.mainDiv.scrollTop = 0;
        }

        splitbee.track("Switch Views", {
            view: newView
        });
    }

    /**
     * Toggle the menu state
     */
    toggleMenu() {
        this.setState({
            menu: !this.state.menu
        });
    }

    /**
     * Loads new GPS data
     */
    async loadGpsData() {
        const currentPosition = await geo.getCurrentPosition();
        this.setState({
            gps: {
                error: currentPosition.error,
                denied: currentPosition.denied,
                latitude: currentPosition.latitude,
                longitude: currentPosition.longitude
            }
        });

        this.gpsUpdate = navigator.geolocation.watchPosition((pos) => {
            console.warn('GPS Update!');

            this.setState({
                gps: {
                    error: false,
                    denied: false,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }
            });
        });
    }

    /**
     * Unloads the GPS data
     */
    unloadGpsData() {
        if(this.gpsUpdate !== null) {
            navigator.geolocation.clearWatch(this.gpsUpdate);
        }

        this.setState({
            gps: {
                error: false,
                denied: false,
                latitude: null,
                longitude: null
            }
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
        const {fetch, error, url, generic, weather, parks, attractions, entertainment, restaurants, sort, search, view, favourites, menu, gps, updated, updateAvailableDialog} = this.state;

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
                    <Header url={url} generic={generic} weather={weather} parks={parks} sort={sort} updated={updated} search={search} view={view} favourites={favourites} menu={menu} updateData={() => this.getData()} updateSort={(sort) => this.updateSort(sort)} updateSearch={(string) => this.updateSearch(string)} switchViews={(view) => this.switchViews(view)} toggleMenu={() => this.toggleMenu()}/>
                </header>
                <main className={clsx((menu || view === 'weather') && 'full')} ref={c => this.mainDiv = c}>
                    <Router onChange={(e) => this.routerUpdate(e)}>
                        <Park path="/:park" parks={parks} attractions={attractions} entertainment={entertainment} restaurants={restaurants} weather={weather} sort={sort} search={search} view={view} favourites={favourites} menu={menu} gps={gps} error={error} reloadFavourites={() => this.reloadFavourites()} switchViews={(view) => this.switchViews(view)}/>
                        <PrivacyPolicy path="/privacy-policy"/>
                        <Redirect path="/" to="/disneyland-park"/>
                    </Router>
                </main>
                {!menu && view !== 'weather' &&
                    <footer>
                        <Footer url={url}/>
                    </footer>
                }
            </div>
        );
    }
}

render(<App/>, document.body);
