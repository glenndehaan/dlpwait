import {h, Component, Fragment} from 'preact';
import {connect} from 'unistore/preact';
import {actions} from '../modules/store';

import Intro from './Intro';

import storage from '../modules/storage';

/**
 * Define all pages
 */
const pages = {
    intro: Intro
};

class Pages extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        if(storage.get('archive') === null) {
            storage.set('archive', []);
        }

        this.state = {
            restoreGame: false,
            updateAvailableDialog: false
        };
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        if ('serviceWorker' in navigator) {
            if(navigator.serviceWorker.controller !== null) {
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    this.setState({
                        updateAvailableDialog: true
                    });
                });
            }
        }

        const game = storage.get('game');

        if(this.props.route === 'intro') {
            if (game !== null) {
                if (game.started && !game.finished) {
                    this.setState({
                        restoreGame: true
                    });
                }
            }
        }
    }

    /**
     * Restores a game
     */
    restoreGame() {
        this.closeRestoreGame();
        this.props.restoreGame();
    }

    /**
     * Closes the restore game dialog
     *
     * @param clear
     */
    closeRestoreGame(clear = false) {
        if(clear) {
            storage.remove('route');
            storage.remove('game');
            storage.remove('players');
            storage.remove('loss');
        }

        this.setState({
            restoreGame: false
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
        const {route} = this.props;
        // const {restoreGame, updateAvailableDialog} = this.state;

        const Cmp = pages[route];

        if(Cmp) {
            return (
                <>
                    {/*{updateAvailableDialog &&*/}
                    {/*    <Dialog title="Update available!" next={() => this.update()} update={true}>*/}
                    {/*        Sorry for the interruption but we have an important update available...<br/>*/}
                    {/*        This only takes a second*/}
                    {/*    </Dialog>*/}
                    {/*}*/}
                    {/*{restoreGame &&*/}
                    {/*    <Dialog title="Restore unfinished game?" next={() => this.restoreGame()} cancel={() => this.closeRestoreGame(true)}>*/}
                    {/*        A game has been found in storage that was unfinished.<br/>*/}
                    {/*        Do you want to restore this game?*/}
                    {/*    </Dialog>*/}
                    {/*}*/}
                    {/*<Notification/>*/}
                    {/*<PlayersOverview/>*/}
                    <main>
                        <Cmp/>
                    </main>
                </>
            );
        } else {
            console.error(`Missing page for route: ${route}`);
            return null;
        }
    }
}

/**
 * Connect the store to the component
 */
export default connect('route', actions)(Pages);
