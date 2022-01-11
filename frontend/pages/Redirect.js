import { Component } from 'preact';
import { route } from 'preact-router';

export default class Redirect extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        route(this.props.to, true);
        return null;
    }
}
