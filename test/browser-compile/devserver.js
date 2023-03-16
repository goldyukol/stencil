const express = require('express')
const app = express()
const port = 3000

app.use(function(req, res, next) {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
app.use(express.static('www'))

app.listen(port, () => {
  console.log(`Browser Compile app running on http://localhost:${port}`)
})
