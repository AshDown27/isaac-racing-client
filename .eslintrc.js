module.exports = {
  // The linter base is the airbnb style guide, located here:
  // https://github.com/airbnb/javascript
  "extends": "airbnb-base",

  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "jquery": true,
  },

  // We modify the base for some specific things
  "rules": {
    // airbnb uses 2 spaces, but it is harder to read block intendation at a glance
    "indent": ["warn", 4],

    // Atom's ruler allows for less formal line length validation;
    // in some situations, it introduces unneeded complexity to break up a line
    "max-len": ["off"],

    // The client makes heavy use of the console
    "no-console": ["off"],

    // Proper use of continues can reduce indentation for long blocks of code
    "no-continue": ["off"],

    // The client passes around data that is meant to be mutable
    "no-param-reassign": ["off"],

    // I need to disable this because I'm not quite sure how to refactor around it
    "no-use-before-define": ["off"],

    // airbnb disallows these because it can lead to errors with minified code;
    // we don't have to worry about this in for loops though
    "no-plusplus": ["error", {
        "allowForLoopAfterthoughts": true,
    }],

    // Clean code can arise from for-of statements if used properly
    "no-restricted-syntax": ["off", "ForOfStatement"],

    // Most people turn off this setting
    "no-mixed-operators": ["off"],

    // It can be bad to remove unused arguments from a function copied an API example
    "no-unused-vars": ["warn", {
        "vars": "local",
        "args": "none",
    }],

    // This is recommended here:
    // https://blog.javascripting.com/2015/09/07/fine-tuning-airbnbs-eslint-config/
    // (airbnb doesn't include this by default for some reason)
    "quote-props": ["warn", "consistent-as-needed"],

    // This is stupid
    "prefer-destructuring": ["off"],

    // Also stupid
    "operator-linebreak": ["off"],
  },
  "globals": {
    "Lang": true,
    "nodeRequire": true,
  },
};
