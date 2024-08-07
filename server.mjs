import express from 'express';
import path from 'path';

const app = express()
const port = process.env.PORT || 5001

app.get('/weather', (req, res) => {
  console.log(`${req.ip} is asking for weather`)
  res.send({
    city: "karachi",
    temp_c: 26
  })
})

const __dirname = path.resolve();

app.use('/', express.static(path.join(__dirname, "/web/index.html")))
app.use('/', express.static(path.join(__dirname, "/web")))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})