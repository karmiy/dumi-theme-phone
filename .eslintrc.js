module.exports = {
    root: true,
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
        '@react-native-community',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['react-hooks', '@typescript-eslint'],
    rules: {
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
        'jsx-quotes': ['error', 'prefer-single'],
        'no-undef': [0],
        '@typescript-eslint/no-var-requires': [0],
        curly: [2, 'multi-line'],
        '@typescript-eslint/explicit-module-boundary-types': [0],
        '@typescript-eslint/no-explicit-any': [0],
        '@typescript-eslint/ban-types': [0],
    },
};
