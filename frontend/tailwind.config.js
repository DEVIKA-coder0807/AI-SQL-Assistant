import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 24px 90px rgba(0, 0, 0, 0.38)',
        glow: '0 0 34px rgba(124, 58, 237, 0.28)',
        cyan: '0 0 28px rgba(6, 182, 212, 0.18)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at 20% 10%, rgba(124, 58, 237, 0.28), transparent 28%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.2), transparent 24%), linear-gradient(180deg, #0B1020 0%, #080B16 62%, #050713 100%)',
        'panel-gradient': 'linear-gradient(145deg, rgba(248, 250, 252, 0.1), rgba(148, 163, 184, 0.04))',
        'brand-gradient': 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 48%, #06B6D4 100%)',
      },
      colors: {
        brand: {
          bg: '#0B1020',
          primary: '#7C3AED',
          secondary: '#8B5CF6',
          accent: '#06B6D4',
          text: '#F8FAFC',
          muted: '#94A3B8',
        },
      },
    },
  },
  plugins: [forms],
}
