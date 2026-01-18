/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1F5B6B",
                "primary-dark": "#164551",
                "primary-light": "#2A7A8F",
                secondary: "#E8DCC4",
                "secondary-dark": "#D4C5A8",
            },
        },
    },
    plugins: [],
}
