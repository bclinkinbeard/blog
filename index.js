var metalsmith = require('metalsmith')
var markdown = require('metalsmith-markdown')
var layouts = require('metalsmith-layouts')
var permalinks = require('metalsmith-permalinks')
var concat = require('metalsmith-concat')
var cleanCSS = require('metalsmith-clean-css')
var collections = require('metalsmith-collections')
var assets = require('metalsmith-static')
var mif = require('metalsmith-if')
var redirect = require('metalsmith-redirect');
var slug = require('slug')

var argv = require('yargs').argv

metalsmith(__dirname)
  .clean(!argv.reload)
  .use(function (files, metalsmith, done) {
    for (var file in files) {
      if (file.substr(-3) === '.md') files[file].slug = slug(files[file].title, {lower: true})
    }
    done()
  })
  .use(collections({
    posts: {
      sortBy: function (a, b) {
        return new Date(a.date) - new Date(b.date);
      },
      reverse: true,
      refer: false
    }
  }))
  .use(markdown({langPrefix: 'language-'}))
  .use(layouts({
    engine: 'handlebars',
    default: 'post.html',
    pattern: '*.html',
    partials: 'partials'
  }))
  .use(permalinks({
    pattern: ':collection/:slug',
    relative: false,

    linksets: [{
      match: { collection: 'indices' },
      pattern: 'posts'
    }]
  }))
  .use(concat({
    files: 'css/vendor/*.css',
    output: 'css/styles.css',
    forceOutput: true
  }))
  .use(concat({
    files: ['css/styles.css', 'css/custom.css'],
    output: 'css/styles.css',
    forceOutput: true
  }))
  .use(cleanCSS({
    files: 'css/styles.css'
  }))
  .use(redirect({
    '/': '/d3svg',
    '/blog': '/posts',
    '/posts/build-your-first-column-chart-with-d3-v4/': '/d3in5days',
  }))
  .use(mif(
    !argv.reload,
    assets({src: 'static', dest: '.'})
  ))
  .build(function (err) {
    // if (err) throw err
  })
