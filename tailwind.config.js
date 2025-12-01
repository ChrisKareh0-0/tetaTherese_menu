/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#17351A',
                    light: '#BACC5C',
                    white: '#ffffff',
                }
            }
        },
    },
    plugins: [],
}
