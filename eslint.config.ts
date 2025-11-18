import eslint from '@fonds/eslint-config'

export default eslint({
  vue: {
    a11y: false,
  },
  typescript: {
    erasableOnly: true,
  },
  formatters: true,
  type: 'app',
  jsx: {
    a11y: true,
  },
})
