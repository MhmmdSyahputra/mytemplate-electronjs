module.exports = {
  extends: 'erb',
  plugins: ['@typescript-eslint'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'on',
    'react/react-in-jsx-scope': 'on',
    'react/jsx-filename-extension': 'on',
    'import/extensions': 'on',
    'import/no-unresolved': 'on',
    'import/no-import-module-exports': 'on',
    'no-shadow': 'on',
    '@typescript-eslint/no-shadow': 'error',
    'no-unused-vars': 'on',
    '@typescript-eslint/no-unused-vars': 'error',
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.jsx'],
    },
  },
};
