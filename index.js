var https = require('https'),
    request = require('request'),
    url = require('url');

const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

var port = process.env.PORT || 3128,
    proxyURL = process.env.PROXY_URL || 'https://awsesurlgoeshere',
    allowOrigin = process.env.ALLOW_ORIGIN || '*',
    allowMethods = process.env.ALLOW_METHODS || '*',
    allowCredentials = process.env.ALLOW_CREDENTIALS || 'true'
    allowHeaders = process.env.ALLOW_HEADERS || 'X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization,x-search-state,x-search-query,x-search-filters'

https.createServer(options, function (req, res) {
  var r = request(url.resolve(proxyURL, req.url));

  // Add CORS Headers
  r.on('response', function(_r) {
    _r.headers['Access-Control-Allow-Origin'] = allowOrigin;
    _r.headers['Access-Control-Allow-Methods'] = allowMethods;
    _r.headers['Access-Control-Allow-Credentials'] = allowCredentials;
    _r.headers['Access-Control-Allow-Headers'] = allowHeaders;
  });

  // Stream the response
  req.pipe(r).pipe(res);
}).listen(port);
