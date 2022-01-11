import createUnistore from 'unistore';

import storage from './storage';

/**
 * Exports the store with the default state
 *
 * @return {any}
 */
const createStore = () => {
    const initialState = {
        players: [], // Defines the player names
        loss: [], // Defines the player index that need to collect a loss
        game: {
            time: {
                start: null, // Defines when a game has started
                end: null // Defines when a game has ended
            },
            loaded: false, // Defines if a game is loaded from memory
            started: false, // Defines if a game is started
            finished: false, // Defines if a game is finished
            points: {}, // Defines the player points
            wins: [], // Defines the player indexes that have won a round
            win: [], // Defines the players indexes that have won the game
            rotation: -1, // Defines the player index that needs to start in the next round
            turn: -1 // Defines the player index that is active
        },
        route: "intro" // Defines the current route
    };

    return process.env.NODE_ENV === 'production' ? createUnistore(initialState) : require("unistore/devtools")(createUnistore(initialState));
};

/**
 * All action for mutating the store
 *
 * @return {*}
 */
const actions = () => {
    return {
        updateRouter(state, payload) {
            window.scrollTo(0, 0);
            storage.set('route', payload);

            return {
                route: payload
            };
        },
        setPlayers(state, payload) {
            storage.set('players', payload);

            return {
                players: payload
            };
        },
        startGame(state) {
            const points = {};

            for(let item = 0; item < state.players.length; item++) {
                const player = state.players[item];
                points[player] = 0;
            }

            storage.set('game', {
                time: {
                    start: new Date().getTime(),
                    end: null
                },
                loaded: false,
                started: true,
                finished: false,
                points,
                wins: [],
                win: [],
                rotation: 1,
                turn: 0
            });

            return {
                game: {
                    time: {
                        start: new Date().getTime(),
                        end: null
                    },
                    loaded: false,
                    started: true,
                    finished: false,
                    points,
                    wins: [],
                    win: [],
                    rotation: 1,
                    turn: 0
                }
            };
        },
        addPoints(state, payload) {
            const newState = {
                game: {
                    ...state.game
                }
            };

            newState.game.points[state.players[state.game.turn]] += parseInt(payload);

            storage.set('game', newState.game);

            return newState;
        },
        removePoints(state, payload) {
            const newState = {
                loss: state.loss.filter((e, key) => {return key !== 0}),
                game: {
                    ...state.game
                }
            };

            newState.game.points[state.players[state.loss[0]]] -= parseInt(payload);

            storage.set('game', newState.game);
            storage.set('loss', newState.loss);

            return newState;
        },
        nextPlayer(state) {
            storage.set('game', {
                ...state.game,
                turn: (state.game.turn + 1) !== state.players.length ? (state.game.turn + 1) : 0
            });

            return {
                game: {
                    ...state.game,
                    turn: (state.game.turn + 1) !== state.players.length ? (state.game.turn + 1) : 0
                }
            };
        },
        endRound(state) {
            const newState = {
                loss: state.players.map((e, key) => {return key}).filter((e) => {return e !== state.game.turn}),
                game: {
                    ...state.game,
                    rotation: (state.game.rotation + 1) === state.players.length ? 0 : (state.game.rotation + 1),
                    turn: state.game.rotation
                }
            };

            newState.game.wins.push(state.game.turn);

            storage.set('game', newState.game);
            storage.set('loss', newState.loss);

            return newState;
        },
        gameOver(state) {
            const keys = Object.keys(state.game.points);
            const sort = keys.sort((a, b) => { return state.game.points[b] - state.game.points[a] });
            const same = sort.filter((e) => { return state.game.points[sort[0]] === state.game.points[e] });

            storage.set('game', {
                ...state.game,
                time: {
                    ...state.game.time,
                    end: new Date().getTime()
                },
                started: false,
                finished: true,
                win: same.map((e) => {
                    return state.players.indexOf(e);
                })
            });

            const archive = storage.get('archive');
            archive.push({
                players: state.players,
                game: {
                    ...state.game,
                    time: {
                        ...state.game.time,
                        end: new Date().getTime()
                    },
                    started: false,
                    finished: true,
                    win: same.map((e) => {
                        return state.players.indexOf(e);
                    })
                }
            });

            storage.set('archive', archive);

            return {
                game: {
                    ...state.game,
                    time: {
                        ...state.game.time,
                        end: new Date().getTime()
                    },
                    started: false,
                    finished: true,
                    win: same.map((e) => {
                        return state.players.indexOf(e);
                    })
                }
            };
        },
        restoreGame() {
            const newState = {};

            if(storage.get('route') !== null) {
                newState.route = storage.get('route');
            }

            if(storage.get('players') !== null) {
                newState.players = storage.get('players');
            }

            if(storage.get('game') !== null) {
                newState.game = storage.get('game');
            }

            if(storage.get('loss') !== null) {
                newState.loss = storage.get('loss');
            }

            return newState;
        },
        loadGame(state, payload) {
            return {
                players: payload.players,
                game: {
                    ...payload.game,
                    loaded: true
                }
            };
        }
    };
};

export {actions};
export default createStore();
