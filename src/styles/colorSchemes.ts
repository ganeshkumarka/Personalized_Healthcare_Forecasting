export const modernColorSchemes = {
  oceanic: {
    background: 'bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100',
    card: 'bg-white/90 backdrop-blur-sm',
    cardHover: 'hover:bg-white',
    accent: 'from-cyan-500 to-blue-500',
    border: 'border-blue-100'
  },
  sunset: {
    background: 'bg-gradient-to-br from-orange-100 via-rose-100 to-purple-100',
    card: 'bg-white/90 backdrop-blur-sm',
    cardHover: 'hover:bg-white',
    accent: 'from-orange-500 to-rose-500',
    border: 'border-rose-100'
  },
  forest: {
    background: 'bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100',
    card: 'bg-white/90 backdrop-blur-sm',
    cardHover: 'hover:bg-white',
    accent: 'from-emerald-500 to-teal-500',
    border: 'border-teal-100'
  },
  lavender: {
    background: 'bg-gradient-to-br from-purple-100 via-fuchsia-100 to-pink-100',
    card: 'bg-white/90 backdrop-blur-sm',
    cardHover: 'hover:bg-white',
    accent: 'from-purple-500 to-fuchsia-500',
    border: 'border-purple-100'
  }
};

export type ColorScheme = keyof typeof modernColorSchemes;
