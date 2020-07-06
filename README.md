# Ersatz Template

Basic, interim Bootstrap starter template. Build and watch tasks are separate:

    npm run build
    npm run watch

The `dist` directory is entirely managed by Gulp. Image optimization is automatic. Optimized SVG images have unique ID attributes to avoid conflicts when embedded in HTML. Append `#base64` to image URLs in Sass to use data URIs instead of external images.

## Third-party PHP

Install with composer:

    composer require embed/embed

## Third-party JavaScript

Install with npm:

    npm install --save-dev magnific-popup
    npm install --save-dev tiny-slider

Add JavaScript sources to `gulpfile.js`:

~~~ javascript
const config = {
    paths: {
        src: {
            js: [
                './node_modules/jquery/dist/jquery.js',
                './node_modules/bootstrap/dist/js/bootstrap.js',
                './node_modules/magnific-popup/dist/jquery.magnific-popup.js',
                './node_modules/tiny-slider/dist/tiny-slider.js',
                './src/js/**/*.js'
            ]
        }
    }
};
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
