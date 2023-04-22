module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: ['Open Sans', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
    },
    extend: {
      colors: {
        'system-blue': 'rgb(15,123,255)',
        'system-blue-light': 'rgb(217,234,255)' ,
        'On-Surface-Variant': 'rgba(179, 179, 179, 1)',
        'input': 'rgb(122,122,128)',
        'deaktive': 'rgba(67, 67, 67, 1)',
        'border': '#E1E1E5',
        'icon': 'rgb(189,188,191)',
        'icon-text': 'rgb(128,127,131)',
        'input-white': 'rgb(122,121,125)',
        
      },
      fontSize: {
        14: '14px',
      },
      backgroundColor: {
        'main-bg': 'rgb(243,243,248)',
        'secondery-bg': 'rgb(243,243,248)',
        'system-blue-bg': 'rgb(15,123,255)' ,
        'system-blue-light-bg': 'rgb(217,234,255)' ,
        'half-transparent': 'rgba(0, 0, 0, 0.5)',
        'input-bg': 'rgb(233,233,239)',
        'deaktive-bg': 'rgba(224, 224, 224, 1)',
        'input-white-bg': 'rgba(236, 236, 239, 1)',

      },
      theme: {
        extend: {
          zIndex: {
            '100': '100',
          }
        }
      },
    },
  },
  plugins: [],
};