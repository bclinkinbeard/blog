var metalsmith = require('metalsmith')
var markdown = require('metalsmith-markdown')
var stylus = require('metalsmith-stylus')
var layouts = require('metalsmith-layouts')
var permalinks = require('metalsmith-permalinks')
var uncss = require('metalsmith-uncss')
var metalsmithPrism = require('metalsmith-prism')
var collections = require('metalsmith-collections')
var assets = require('metalsmith-static')
var mif = require('metalsmith-if')

var slug = require('slug')
var yeticss = require('yeticss')

var argv = require('yargs').argv

metalsmith(__dirname)
  .clean(!argv.reload)
  .use(function (files, metalsmith, done){
    for (var file in files) {
      if (file.substr(-3) === '.md') files[file].slug = slug(files[file].title, {lower: true})
    }
    done()
  })
  .use(collections({
    posts: {
      sortBy: 'date',
      reverse: true,
      refer: false
    }
  }))
  .use(markdown({langPrefix: 'language-'}))
  .use(metalsmithPrism())
  .use(layouts({
    engine: 'handlebars',
    default: 'post.html',
    pattern: '*.html',
    partials: 'partials'
  }))
  .use(stylus({
    compress: true,
    use: [yeticss()]
  }))
  .use(permalinks({
    pattern: ':collection/:title',
    relative: false
  }))
  .use(mif(
    !argv.reload,
    assets({src: 'static', dest: '.'})
  ))
  .use(mif(
    !argv.reload,
    uncss({css: ['styles.css'], output: 'styles.css'})
  ))
  .build(function (err) {
    if (err) throw err
  })
