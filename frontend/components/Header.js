import {h, Component} from 'preact';

export default class Header extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {parks, url} = this.props;
        const parkFilter = parks.filter((item) => {
            return item.slug === url.replace('/', '');
        });
        const park = parkFilter[0];

        console.log('park', park);

        return (
            <div className="grid grid-rows-2 grid-cols-2 gap-4">
                <div>Open: <br/></div>
                <div>2</div>
                <div className="col-span-2">3</div>
            </div>
        );
    }
}
