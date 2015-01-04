# Personal website

This repository contains all source files for http://www.jvandemo.com.

## Local development

First install all dependencies:

```sh
$ npm install
$ bower install
```

Then run gulp to build and watch files during development:

```sh
$ gulp
```

Finally start the harp server from your project directory:

```sh
$ harp server
```

And navigate to `http://localhost:9000` in your browser to preview your work:

![Homepage](http://i.imgur.com/dORKysf.png)


## Testing

To run unit tests:

```sh
$ gulp test
```

This will run all tests in `public/**/_build/**/*.spec.js`.

## Deployment

First compile a static version:

```sh
$ harp compile . dist
```

Then deploy to divshot:

```sh
$ divshot deploy
```

The site can now be previewed at: http://development.www-jvandemo-com.divshot.io.

To push to `staging` or `production`:

```sh
$ divshot promote development production
```

The production environment is the one that is displayed when visiting http://www.jvandemo.com.

## Change log

### v0.3.0

- Add divshot configuration
- Add dynamic meta support
- Add public data component

### v0.2.0

- Add global styles
- Add articles layout
- Add about page
- Add hire-me page
- Add initial dummy content

### v0.1.0

- Initial version generated using AngularJS Express
