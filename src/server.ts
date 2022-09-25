import express from "express"
import fs from "fs"
import path from "path"
import { Company } from "./types"
import companyHasSpecialties from "./utils/companyHasSpecialties"

const app = express()
const port = 9000
const SIMULATE_NETWORK = 1000 // Delay answering in search call by milliseconds

/**
 * Return all companies
 */
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
        const parsedData = JSON.parse(data)
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

/**
 * Return companies matching a search string and specialties
 */
 app.get('/api/search', (req, res) => {
  const searchQuery = req.query.q;
  const specialties = req.query.specialties

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
        const parsedData: Company[] = JSON.parse(data)
        const nameMatched = typeof searchQuery === 'string' ? parsedData.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())) : parsedData
        const specialtyMatched = (() => {
          if (typeof specialties === 'string') {
            return nameMatched.filter(c => c.specialties.includes(specialties))
          } else if (Array.isArray(specialties)) {
            return nameMatched.filter(c => companyHasSpecialties(c, specialties as string[]))
          }
          return nameMatched
        })()

        // Delay sending the response to simulate a slower network / overhead of fetching from db
        setTimeout(() => {
          res.send({
            data: specialtyMatched
          })
        }, SIMULATE_NETWORK)

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