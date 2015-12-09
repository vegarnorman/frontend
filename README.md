# Frontend

A simple starting point for front-end development projects using modern tools and technologies. BYO frameworks for testing and development. This boilerplate includes:

+ Gulp for asset pipelining
+ Babel for ES2015 transpiling
+ Sass for CSS superpowers
+ BrowserSync for cross-device testing

## How?

1. Clone it
2. `npm install` it
3. `gulp` it and you're ready to go

*You'll just need to*
+ ...put all your images in `src/img`
+ ...stick all your Sass or CSS files in `src/scss`
+ ...let your JavaScript live in `src/js`
+ ...let your HTML files hang out in `src/html`

## Also

+ `gulp build` to build your project without serving it. You can also build individual components through the tasks `gulp html`, `gulp css`, `gulp js` or `gulp img`
+ This boilerplate makes no assumptions as to frameworks, libraries et al. As such, you might need to alter `gulpfile.js` to make it fit your needs. Want unit testing or linting? You'll have to set that up by yourself, too.
