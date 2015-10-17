var bs = require('browser-sync').create()
var exec = require('child_process').exec

bs.init({
  server: 'build',
  files: [{
    match: ['src/*', 'layouts/*', 'partials/*'],
    fn: function (event, file) {
      if (event !== 'change') return

      exec('node index.js --reload', function (error, stdout, stderr) {
        if (error) return console.error(error)

        bs.reload()
      })
    }
  }]
})
