import express from "express"
import fs from "fs"
import path from "path"

const app = express()
const port = 9000

app.get('/api/all', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.json'), 'utf-8', (err, data) => {
    if (err) {
      res.send({
        error: {
          code: 500,
          message: err.message,
        },
        data: null
      })
    } else {
      try {
        let parsedData = JSON.parse(data)
        res.send({
          data: parsedData
        })
      } catch (err) {
        res.send({
          error: {
            code: 500,
            message: "Unable to read data",
          },
          data: null
        })
      }
    }
  })
})

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`)
})