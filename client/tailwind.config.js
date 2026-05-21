// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo
        secondary: '#7C3AED', // Purple
        background: '#F8FAFC',
        sidebar: '#111827',
        card: '#FFFFFF',
        text: '#1F2937',
        success: '#22C55E',
        danger: '#EF4444',
        accent: '#06B6D4',
      },
      borderRadius: {
        'lg': '1rem',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
