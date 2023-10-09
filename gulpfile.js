/**
 * Import uswds-compile
 */
const uswds = require("@uswds/compile");

/**
 * USWDS version
 * Set the major version of USWDS you're using
 * (Current options are the numbers 2 or 3)
 */
uswds.settings.version = 3;

/**
 * Path settings
 */
uswds.paths.dist.css = './assets/css';
uswds.paths.dist.img = './assets/img';
uswds.paths.dist.fonts = './assets/fonts';
uswds.paths.dist.js = './assets/js';


/**
 * Exports
 * Add as many as you need
 */
exports.init = uswds.init;
exports.compile = uswds.compile;
exports.watch = uswds.watch;
