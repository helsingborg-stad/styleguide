/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ['./**/*.html', './**/*.scss', './**/*.blade.php', './views/**/*.{blade.php, php}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: getDarkTheme(),
        light: getLightTheme()
      }
    ],
    themeRoot: ":root",
    utils: true,
  }
}

function getDarkTheme() {
  return {
    'primary' : '#808080',
    'primary-focus' : '#737373',
    'primary-content' : '#f2f2f3',

    'secondary' : '#4d4d4d',
    'secondary-focus' : '#404040',
    'secondary-content' : '#f2f2f3',

    'accent' : '#1a1a1a',
    'accent-focus' : '#0d0d0d',
    'accent-content' : '#f2f2f3',

    'neutral' : '#f2f2f3',
    'neutral-focus' : '#e4e4e7',
    'neutral-content' : '#4d4d4d',

    'base-100' : '#ffffff',
    'base-200' : '#ffffff',
    'base-300' : '#ffffff',
    'base-content' : '#7d7d7d',

    'info' : '#1c92f2',
    'success' : '#009485',
    'warning' : '#ff9900',
    'error' : '#ff5724',

   '--rounded-box': '0',          
   '--rounded-btn': '0',        
   '--rounded-badge': '0',      

   '--animation-btn': '0',       
   '--animation-input': '0',       

   '--btn-text-case': 'uppercase',   
   '--navbar-padding': '.5rem',      
   '--border-btn': '1px',     
  }
}

function getLightTheme() {
  return {
    'primary' : '#65c3c8',
    'primary-focus' : '#42b2b8',
    'primary-content' : '#ffffff',

    'secondary' : '#ef9fbc',
    'secondary-focus' : '#e7739e',
    'secondary-content' : '#ffffff',

    'accent' : '#eeaf3a',
    'accent-focus' : '#e09915',
    'accent-content' : '#ffffff',

    'neutral' : '#261230',
    'neutral-focus' : '#200f29',
    'neutral-content' : '#ffffff',

    'base-100' : '#faf7f5',
    'base-200' : '#efeae6',
    'base-300' : '#e7e2df',
    'base-content' : '#261230',

    'info' : '#1c92f2',
    'success' : '#009485',
    'warning' : '#ff9900',
    'error' : '#ff5724',

   '--rounded-box': '1rem',          
   '--rounded-btn': '1.9rem',      
   '--rounded-badge': '1.9rem',      

   '--animation-btn': '.25s',       
   '--animation-input': '.2s',       

   '--btn-text-case': 'uppercase',   
   '--navbar-padding': '.5rem',
   '--border-btn': '2px', 
  }
}

