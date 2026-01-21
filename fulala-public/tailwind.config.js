/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'fulala-red': '#FB3000',
        'tiger-orange': '#FCEBDC',
        'dough-white': '#FF8A14',
        'soy-brown': '#6B3900',
        'ink-black': '#000000',
      },
      fontFamily: {
        heading: ['Chewy', 'cursive'],
        body: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
