import {h, Component} from 'preact';

import Error from '../components/Error';
import Menu from '../components/Menu';
import Attractions from '../components/Attractions';
import Entertainment from '../components/Entertainment';
import Restaurants from '../components/Restaurants';
import Weather from '../components/Weather';

import geo from '../utils/geo';

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
        const {error, attractions, entertainment, restaurants, weather, park, parks, sort, search, view, favourites, menu, debug, gps, reloadFavourites, switchViews} = this.props;

        // Ensure menu is always available. Even if an error comes next...
        if(menu) {
            return <Menu view={view} switchViews={switchViews}/>;
        }

        if(error) {
            return <Error message="It seems we are unable to connect to the server at the moment. Please try again later..." code="NO_NETWORK_API_OFFLINE" api={!error}/>
        }

        const parkCheck = parks.find((item) => {
            return item.slug === park;
        });

        if(typeof parkCheck === "undefined") {
            return <Error message="It seems we can&apos;t recognize this park? Please check the URL!" code="PARK_SLUG_UNDEFINED_MALFORMED_DATA"/>
        }

        // GPS Errors
        if(sort === "NEAR_ME" && gps.error) {
            return <Error message="Error while getting GPS location. Please try again later..." code="GPS_ERROR"/>
        }
        if(sort === "NEAR_ME" && gps.denied) {
            return <Error message="GPS location permissions are currently denied! Please allow location services and try again..." code="GPS_DENIED"/>
        }
        if(sort === "NEAR_ME" && gps.latitude === null && gps.longitude === null) {
            return <Error message="Waiting for GPS signal. Please wait..." code="GPS_WAIT"/>
        }
        if(sort === "NEAR_ME" && Math.round(geo.getDistanceFromLatLonInKm(gps.latitude, gps.longitude, 48.8673104, 2.7834651)) > 5) {
            return <Error message="It seems you are currently not within the parks! This feature is therefore unavailable..." code="GPS_TO_FAR_FROM_STATIC_POINT"/>
        }

        if(view === 'attractions') {
            return <Attractions park={park} attractions={attractions} sort={sort} search={search} favourites={favourites} reloadFavourites={reloadFavourites} gps={gps} debug={debug}/>;
        }

        if(view === 'entertainment') {
            return <Entertainment park={park} entertainment={entertainment} sort={sort} search={search} debug={debug}/>;
        }

        if(view === 'restaurants') {
            return <Restaurants park={park} restaurants={restaurants} sort={sort} search={search} gps={gps} debug={debug}/>;
        }

        if(view === 'weather') {
            return <Weather weather={weather} debug={debug}/>;
        }
    }
}
