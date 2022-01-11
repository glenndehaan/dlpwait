import {h, Component} from 'preact';

export default class Home extends Component {
    /**
     * Runs then component mounts
     */
    componentDidMount() {
        document.title = 'Home | DLP Wait Times';
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="w-5">
                Home
            </div>
        );
    }
}
