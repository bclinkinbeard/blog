var metalsmith = require('metalsmith')
var markdown = require('metalsmith-markdown')
var stylus = require('metalsmith-stylus')
var layouts = require('metalsmith-layouts')
var inPlace = require('metalsmith-in-place')
var permalinks = require('metalsmith-permalinks')
var browserSync = require('metalsmith-browser-sync')
var uncss = require('metalsmith-uncss')
var metalsmithPrism = require('metalsmith-prism')
var collections = require('metalsmith-collections')

var yeticss = require('yeticss')
var slug = require('slug')

var pipeline = metalsmith(__dirname)
  .use(function drafts(files, metalsmith, done){
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
  .use(inPlace({
    engine: 'handlebars',
    pattern: '*.html'
  }))
  .use(layouts({
    engine: 'handlebars',
    default: 'post.html',
    pattern: '*.html'
  }))
  .use(stylus({
    compress: true,
    use: [yeticss()]
  }))
  .use(permalinks({
    pattern: ':collection/:title',
    relative: false
  }))
  .use(uncss({css: ['styles.css'], output: 'styles.css'}))

if (process.argv[2] === '--dev') {
  pipeline.use(browserSync({
    server: 'build',
    files: ['src/*.*', 'layouts/*.*']
  }))
}

pipeline.build(function (err) {
    if (err) throw err
  })
