import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'sidebar-bg': 'var(--sidebar)',
        canvas: {
          DEFAULT: 'var(--surface)',
          subtle: 'var(--surface-2)',
        },
        line: 'var(--border)',
        ink: {
          DEFAULT: 'var(--text)',
          faint: 'var(--text-muted)',
          sidebar: 'var(--text-sidebar)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
