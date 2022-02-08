import {h, Component} from 'preact';

import Error from '../components/Error';
import Attractions from '../components/Attractions';
import Entertainment from '../components/Entertainment';

export default class Park extends Component {
    /**
     * Runs after component mounts
     */
    componentDidMount() {
        this.updatePageTitle();
    }

    /**
     * Runs after component updates
     */
    componentDidUpdate() {
        this.updatePageTitle();
    }

    /**
     * Updates the page title
     */
    updatePageTitle() {
        const parkInfo = this.props.parks.find((e) => {
            return e.slug === this.props.park;
        });

        document.title = `${parkInfo ? parkInfo.name : 'Park'} | DLP Wait Times`;
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {error, attractions, entertainment, park, parks, sort, search, entertainmentView} = this.props;

        if(error) {
            return <Error message="It seems we are unable to connect to the server at the moment. Please try again later..." code="NO_NETWORK_API_OFFLINE" api={!error}/>
        }

        const parkCheck = parks.find((item) => {
            return item.slug === park;
        });

        if(typeof parkCheck === "undefined") {
            return <Error message="It seems we can&apos;t recognize this park? Please check the URL!" code="PARK_SLUG_UNDEFINED_MALFORMED_DATA"/>
        }

        if(entertainmentView) {
            return <Entertainment park={park} entertainment={entertainment} sort={sort} search={search}/>;
        } else {
            return <Attractions park={park} attractions={attractions} sort={sort} search={search}/>
        }
    }
}
