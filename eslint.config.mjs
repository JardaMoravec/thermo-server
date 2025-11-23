import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        ignores: ["src/migrations/**"]
    },
    {
        languageOptions: {
            globals: globals.browser
        }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "no-extra-semi": "error",
            "quotes": ["error", "single", {"avoidEscape": true, "allowTemplateLiterals": true}],
            "no-unused-vars": "error",
            "eqeqeq": ["error", "always"],
            "curly": ["error", "all"],
            "semi": ["error", "never"]
        }
    }
];
