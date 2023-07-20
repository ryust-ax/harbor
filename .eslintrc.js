module.exports = {
    "env": {
        "node": true,
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "codeceptjs/codeceptjs": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:codeceptjs/recommended",
        "plugin:vue/vue3-essential"
    ],
    "plugins": [
        "vue",
        "codeceptjs"
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    ignorePatterns: [
        "*/**/!.*",
        "node_modules/",
        "output",
        "mochawesome-report"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "comma-dangle": [
            "error",
            "never"
        ]
    },
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        },
        {
            files: ["**/step_definitions/**/*.js"],
            rules: {
                "no-undef": "off",
                "new-cap": "off",
                "no-negated-condition": "off"
            }
        }
    ]
};
