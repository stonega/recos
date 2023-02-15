var https = require('https');
var fs = require('fs');
const path = require('path')
const { parse } = require('url');

const next = require('next')
const port = parseInt(process.env.PORT) || 4002
const dev = true;
const app = next({ dev, dir: __dirname })
const handle = app.getRequestHandler()

var options = {
  key: fs.readFileSync('certs/localhost.key'),
  cert: fs.readFileSync('certs/localhost.crt'),
};

app.prepare().then(() => {
  https.createServer(options, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, err => {
    if (err) throw err
    console.log(`> Ready on localhost:${port}`)
  })
})