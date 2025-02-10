/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      keyframes: {
        grow: {
          '0%': { flexGrow: 0 },
          '100%': { flexGrow: 1 },
        },
        shrink: {
          '0%': { flexGrow: 1 },
          '100%': { flexGrow: 0 },
        },
      },
      animation: {
        grow: 'grow 2s ease-in-out',
        shrink: 'shrink 2s ease-in-out',
      },
      colors: {
        primary: '#2d30ec',
        'matrix-red': {
          DEFAULT: '#eb6e6c4d',
          dark: '#ff4444a5',
        },
        'matrix-green': {
          DEFAULT: '#4caf4f6f',
          dark: '#4CAF50a5',
        },
        'matrix-orange': {
          DEFAULT: '#F2B5344d',
          dark: '#ffc400a5',
        },
        'matrix-blue': {
          DEFAULT: '#556FF54d',
          dark: '#2196F3a5',
        },
        'matrix-red-active': {
          DEFAULT: '#ff4444',
          dark: '#ff4444',
        },
        'matrix-green-active': {
          DEFAULT: '#62CA9E',
          dark: '#4CAF50',
        },
        'matrix-orange-active': {
          DEFAULT: '#ffc400',
          dark: '#ffc400',
        },
        'matrix-blue-active': {
          DEFAULT: '#2196F3',
          dark: '#2196F3',
        },
      },
      transitionProperty: {
        all: 'all',
        width: 'width',
        height: 'height',
      },
      transitionDuration: {
        300: '300ms',
      },
      transitionTimingFunction: {
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
