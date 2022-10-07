const colors = require('tailwindcss/colors');

module.exports = {
    mode: 'jit',
    content: ['./frontend/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'media',
    theme: {
        extend: {
            colors: {
                green: colors.emerald,
                yellow: colors.amber,
                purple: colors.violet,
            }
        }
    },
    variants: {
        extend: {}
    },
    plugins: []
};
