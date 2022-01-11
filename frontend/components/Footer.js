import {h, Component} from 'preact';

export default class Footer extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="grid grid-cols-2 gap-6 text-center">
                <a href="/disneyland-park">
                    <div className="grid grid-rows-2 gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000" className="flex justify-self-center w-12 h-12">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        <span>Disneyland Park</span>
                    </div>
                </a>
                <a href="/walt-disney-studios-park">
                    <div className="grid grid-rows-2 gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000" className="flex justify-self-center w-12 h-12">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        <span>Walt Disney Studios Park</span>
                    </div>
                </a>
            </div>
        );
    }
}
