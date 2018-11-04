const satamatRouter = require("express").Router()
const { Satama } = require("../models/db")

satamatRouter.get("/", async (request, response) => {
  try {
    const satamat = await Satama.findAll()
    response.json(satamat.map(s => formatSatama(s)))
  } catch (error) {
    return response.status(500).json({ error: "Satamien haku epäonnistui" })
  }
})

satamatRouter.get("/:id", async (request, response) => {
  try {
    const satama = await Satama.findById(request.params.id)
    response.json(formatSatama(satama))
  } catch (error) {
    return response.status(500).json({ error: "Satamaa ei löytynyt" })
  }
})

satamatRouter.delete("/:id", async (request, response) => {
  try {
    const satama = await Satama.findById(request.params.id)
    satama.destroy()
    response.json("Satama poistettu")
  } catch (error) {
    return response.status(500).json({ error: "Sataman poisto epäonnistui" })
  }
})

satamatRouter.post("/", async (request, response) => {
  const body = request.body
  if (body === undefined) {
    return response.status(400).json({ error: "content missing" })
  }

  const satama = buildSatama(body)
  try {
    const uusiSatama = await satama.save()
    return response.status(200).json(formatSatama(uusiSatama))
  } catch (error) {
    return response
      .status(500)
      .json({ error: "Sataman lisääminen epäonnistui" })
  }
})

const buildSatama = satama =>
  Satama.build({
    kaupunki: satama.kaupunki,
    koodi: satama.koodi
  })

const formatSatama = satama => {
  return {
    kaupunki: satama.kaupunki,
    koodi: satama.koodi
  }
}

module.exports = satamatRouter
