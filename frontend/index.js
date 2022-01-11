// Must be the first import
if (process.env.NODE_ENV === 'development') {
    // Must use require here as import statements are only allowed
    // to exist at top-level.
    require("preact/debug");
}

import {h, render, Component} from 'preact';
import Router from 'preact-router';

import Home from './pages/Home';

import storage from './modules/storage';
import {validateServiceWorkerInstance} from './utils/sw';

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

        window.site = {};
        window.site.production = process.env.NODE_ENV === 'production';
    }

    /**
     * Function runs then component mounts
     */
    componentWillMount() {
        // this.getProjects();
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div id="root">
                <div>
                    <div>
                        <Router>
                            <Home path="/"/>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}

render(<App/>, document.body);
