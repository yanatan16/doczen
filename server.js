var enchilada = require('enchilada')
  , express = require('express')
  , path = require('path')

var app = express()

app.use('/js', enchilada({
   src: path.normalize(__dirname + '/js')
  ,transforms: ['brfs']
}))

app.use(express.static(__dirname + '/static'))


console.log("Listening on port 8000...")
app.listen(8000)

