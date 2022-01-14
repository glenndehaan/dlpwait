import {h, Component} from 'preact';

export default class Error extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {message} = this.props;

        return (
            <div className="flex-1 px-12 py-24 flex flex-col justify-center items-center text-primary">
                <span className="border border-dashed border-secondary border-black flex items-center justify-center w-24 h-24 bg-primary rounded-lg text-red-500 dark:border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="48px" viewBox="0 0 24 24" width="48px" className="fill-current">
                        <path d="M16.5,3c-0.96,0-1.9,0.25-2.73,0.69L12,9h3l-3,10l1-9h-3l1.54-5.39C10.47,3.61,9.01,3,7.5,3C4.42,3,2,5.42,2,8.5 c0,4.13,4.16,7.18,10,12.5c5.47-4.94,10-8.26,10-12.5C22,5.42,19.58,3,16.5,3z"/>
                    </svg>
                </span>
                <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">Oh no!?</h2>
                <p className="text-accent-6 px-10 text-center pt-2">{message}</p>
            </div>
        );
    }
}
