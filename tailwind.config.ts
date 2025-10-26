import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'fa-cyan': '#39D0FF',
        'fa-red': '#FF3B3B',
        'fa-amber': '#FFB341',
        'fa-teal': '#19C6A6',
        'fa-indigo': '#5C6FFF',
        'fa-gray': {
          0: '#0A0C10',
          1: '#141821',
          2: '#1B2230',
          3: '#242C3A',
          4: '#2F394B',
          5: '#5E6A81',
          6: '#8F9BB0',
          7: '#C6CFDA',
          8: '#E6EBF2',
        },
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '24px',
        '6': '32px',
        '7': '48px',
        '8': '64px',
      },
      fontSize: {
        'micro': ['12px', '16px'],
        'small': ['14px', '20px'],
        'body': ['16px', '24px'],
        'h3': ['22px', '28px'],
        'h2': ['28px', '34px'],
        'h1': ['36px', '44px'],
      },
      borderRadius: {
        '0': '4px',
        '1': '8px',
        '2': '12px',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        'flow-atlas-dark': {
          'primary': '#39D0FF',
          'secondary': '#5C6FFF',
          'accent': '#19C6A6',
          'neutral': '#1B2230',
          'base-100': '#141821',
          'base-200': '#1B2230',
          'base-300': '#242C3A',
          'info': '#39D0FF',
          'success': '#19C6A6',
          'warning': '#FFB341',
          'error': '#FF3B3B',
        },
      },
      {
        'flow-atlas-light': {
          'primary': '#5C6FFF',
          'secondary': '#39D0FF',
          'accent': '#19C6A6',
          'neutral': '#F8FAFD',
          'base-100': '#FFFFFF',
          'base-200': '#F8FAFD',
          'base-300': '#E6EBF2',
          'info': '#39D0FF',
          'success': '#19C6A6',
          'warning': '#FFB341',
          'error': '#FF3B3B',
        },
      },
    ],
    darkTheme: 'flow-atlas-dark',
    base: true,
    styled: true,
    utils: true,
  },
}

export default config
