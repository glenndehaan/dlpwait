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

        this.state = {
            url: '/',
            parks: [],
            attractions: [],
            entertainment: [],
            error: false
        }

        window.site = {};
        window.site.production = process.env.NODE_ENV === 'production';
    }

    /**
     * Function runs then component mounts
     */
    componentWillMount() {
        this.getData();
    }

    /**
     * Get all data from the API
     */
    async getData() {
        const data = await fetch(window.site.production ? 'https://api.dlpwait.com' : 'http://localhost:4001', query);

        if(data) {
            this.setState({
                parks: data.data.parks,
                attractions: data.data.attractions,
                entertainment: data.data.entertainment
            });
        } else {
            this.setState({
                error: true
            });
        }
    }

    /**
     * Handle route updates
     *
     * @param e
     */
    routerUpdate(e) {
        this.setState({
            url: e.url
        });
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {url, parks, attractions, entertainment} = this.state;

        return (
            <div id="root">
                <header>
                    <Header url={url} parks={parks}/>
                </header>
                <main>
                    <Router onChange={(e) => this.routerUpdate(e)}>
                        <Park path="/:park" attractions={attractions} entertainment={entertainment}/>
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
