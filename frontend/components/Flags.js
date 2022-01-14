import {h} from 'preact';

/**
 * Great Britain flag
 *
 * @returns {*}
 */
const en = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="inline-block align-middle h-6 w-6 mr-1 ml-2">
            <path fill="#012169" d="M0 0h640v480H0z"/>
            <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/>
            <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/>
            <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/>
            <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/>
        </svg>
    );
};

/**
 * French flag
 *
 * @returns {*}
 */
const fr = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="inline-block align-middle h-6 w-6 mr-1 ml-2">
            <g fillRule="evenodd" strokeWidth="1pt">
                <path fill="#fff" d="M0 0h640v480H0z"/>
                <path fill="#00267f" d="M0 0h213.3v480H0z"/>
                <path fill="#f31830" d="M426.7 0H640v480H426.7z"/>
            </g>
        </svg>
    );
};

/**
 * Contains all available flags
 *
 * @type {{}}
 */
const flags = {
    en,
    fr
};

/**
 * Flags component
 *
 * @param lang
 * @returns {JSX.Element}
 */
const Flags = ({lang}) => {
    const Cmp = flags[lang];
    return <Cmp/>;
};

/**
 * Export the flags component
 */
export default Flags;
