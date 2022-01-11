import {h, Component} from 'preact';
import clsx from 'clsx';

export default class Footer extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {url} = this.props;

        return (
            <div className="grid grid-cols-2 gap-5 text-center">
                <a href="/disneyland-park" className={clsx("border-r border-gray-300", url === "/disneyland-park" && "text-blue-500")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="block w-10 h-10 m-auto fill-current transition-colors">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                    <span className="text-sm transition-colors">Disneyland</span>
                </a>
                <a href="/walt-disney-studios-park" className={clsx(url === "/walt-disney-studios-park" && "text-blue-500")}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="block w-10 h-10 m-auto fill-current transition-colors">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                    <div className="text-sm transition-colors">Walt Disney Studios</div>
                </a>
            </div>
        );
    }
}
