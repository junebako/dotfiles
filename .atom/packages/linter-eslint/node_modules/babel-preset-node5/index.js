/* global module */

module.exports = function(context, opts = {}) {
  let loose = false;
  let modules = true;

  if (opts !== undefined) {
    if (opts.loose !== undefined) loose = opts.loose;
    if (opts.modules !== undefined) modules = opts.modules;
  }

  if (typeof loose !== 'boolean') throw new Error("Preset node5 'loose' option must be a boolean.");
  if (typeof loose !== 'boolean') throw new Error("Preset node5 'modules' option must be a boolean.");

  // be DRY
  const optsLoose = { loose };

  return {
    plugins: [
      require('babel-plugin-syntax-async-functions'),
      require('babel-plugin-syntax-object-rest-spread'),
      require('babel-plugin-syntax-trailing-function-commas'),
      [require('babel-plugin-transform-es2015-destructuring'), optsLoose],
      modules && [require('babel-plugin-transform-es2015-modules-commonjs'), optsLoose],
      require('babel-plugin-transform-es2015-parameters'),
      require('babel-plugin-transform-es2015-sticky-regex'),
      require('babel-plugin-transform-es2015-unicode-regex'),
      require('babel-plugin-transform-strict-mode'),
      require('babel-plugin-transform-object-rest-spread'),
      require('babel-plugin-transform-async-to-generator'),
    ].filter(Boolean) // filter out falsy values
  };
}
