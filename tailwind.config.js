/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tulip: {
          50:  '#FFF5F7',
          100: '#FFE4EB',
          200: '#FFBDD0',
          300: '#FF8FAF',
          400: '#F5607A',
          500: '#E8314F',
          600: '#C9183A',
          700: '#A01030',
          800: '#7A0E26',
          900: '#520A1A',
        },
        stem: {
          400: '#6B9E6B',
          500: '#4A7C59',
          600: '#2D5E3E',
          700: '#1A3D28',
        },
        soil: {
          50:  '#FAF7F4',
          100: '#F3EDE5',
          200: '#E5D6C3',
          300: '#CEBA9A',
          400: '#A8916E',
          500: '#7D6548',
        },
        night: {
          800: '#1A1220',
          900: '#0F0A14',
        },
        petal: {
          cream: '#FFF8F0',
          blush: '#FFE8EE',
          rose:  '#F9C9D4',
          mauve: '#E8A0B4',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['Lato', 'system-ui', 'sans-serif'],
        script:  ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        'petal':  '0 2px 16px rgba(232,49,79,0.10)',
        'card':   '0 4px 32px rgba(90,40,60,0.09)',
        'deep':   '0 12px 48px rgba(90,40,60,0.16)',
        'tulip':  '0 0 0 3px rgba(232,49,79,0.15)',
        'inset':  'inset 0 2px 8px rgba(90,40,60,0.08)',
      },
      backgroundImage: {
        'petal-gradient': 'linear-gradient(135deg, #FFF5F7 0%, #FFE4EB 50%, #FFF8F0 100%)',
        'night-gradient': 'linear-gradient(160deg, #1A1220 0%, #2D1B35 50%, #1A2510 100%)',
        'stem-gradient':  'linear-gradient(180deg, #6B9E6B 0%, #2D5E3E 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out',
        'slide-up':   'slideUp 0.45s cubic-bezier(0.16,1,0.3,1)',
        'sway':       'sway 4s ease-in-out infinite',
        'sway-slow':  'sway 6s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
        'petal-fall': 'petalFall 8s ease-in infinite',
        'bloom':      'bloom 0.6s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        sway:      { '0%,100%': { transform: 'rotate(-2deg)' }, '50%': { transform: 'rotate(2deg)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        petalFall: {
          '0%':   { transform: 'translateY(-20px) rotate(0deg)', opacity: 0.8 },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: 0 },
        },
        bloom:     { from: { transform: 'scale(0.7)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
