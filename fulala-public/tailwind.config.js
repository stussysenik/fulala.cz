/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'fulala-red': '#E83636',
        'tiger-orange': '#FCEBDC',
        'dough-white': '#FFFFFF',
        'soy-brown': '#6B3900',
        'ink-black': '#000000',
      },
      fontFamily: {
        heading: ['Fredoka', 'cursive'],
        body: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
