# Ersatz Template

Basic, interim Bootstrap starter template. Build and watch tasks are separate:

    npm run build
    npm run watch

The `./dist` directory is entirely managed by Gulp. Place images in `./images` and fonts in `./fonts`.

## Install

Install in `path` with composer:

    composer create-project jkhughes/ersatz-template path

## Third-party PHP

Install with composer:

    composer require embed/embed

## Third-party JavaScript

Install with npm:

    npm install --save-dev magnific-popup
    npm install --save-dev tiny-slider

Add JavaScript sources to `gulpfile.js`:

~~~ javascript
const jsSrc = [
    './node_modules/jquery/dist/jquery.js',
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './node_modules/magnific-popup/dist/jquery.magnific-popup.js',
    './node_modules/tiny-slider/dist/tiny-slider.js',
    './src/js/**/*.js'
];
~~~

Add Sass sources to `src/scss/style.scss`:

~~~ scss
// Framework and library source
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/magnific-popup/src/main';
@import 'node_modules/tiny-slider/src/tiny-slider';
~~~

## Recommended third-party code

*   [Embed](https://packagist.org/packages/embed/embed)
*   [PHPMailer](https://packagist.org/packages/phpmailer/phpmailer)
*   [Schema](https://github.com/spatie/schema-org)
*   [Magnific Popup](https://www.npmjs.com/package/magnific-popup)
*   [Tiny Slider](https://www.npmjs.com/package/tiny-slider)

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).
