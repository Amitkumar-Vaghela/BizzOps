/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        fontt: ['"JetBrains Mono"', 'monospace'],
        fontt2: ['Arial', 'monospace'],
        fontt3: ['"Space Grotesk"', 'monospace'],
        font4: ['"Work Sans"', 'monospace'],
      }
    },
  },
  plugins: [],
}