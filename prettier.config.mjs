/** @type {import("prettier").Config} */
const config = {
  printWidth: 80,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  proseWrap: 'always',
  semi: false,
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
