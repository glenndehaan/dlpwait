import {h, Component} from 'preact';

export default class Dialog extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        const {title = 'Title Text', description = 'Descriptive text', button = 'Button Text', onClick = () => {}} = this.props;

        return (
            <div className="dialog">
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-900 dark:border-gray-500 dark:text-gray-100">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mt-2">{title}</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500 dark:text-white">
                                    {description}
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300" onClick={() => onClick()}>
                                    {button}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
