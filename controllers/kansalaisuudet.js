const kansalaisuudetRouter = require("express").Router()
const { Kansalaisuus } = require("../models/db")

kansalaisuudetRouter.get("/", async (request, response) => {
  try {
    const kansalaisuudet = await Kansalaisuus.findAll()
    response.json(kansalaisuudet.map(s => formatkansalaisuus(s)))
  } catch (error) {
    return response.status(500).json({ error: "Kansalaisuuksia ei löytynyt" })
  }
})

kansalaisuudetRouter.get("/:id", async (request, response) => {
  try {
    const kansalaisuus = await Kansalaisuus.findById(request.params.id)
    response.json(formatkansalaisuus(kansalaisuus))
  } catch (error) {
    return response.status(500).json({ error: "Kansalaisuutta ei löytynyt" })
  }
})

kansalaisuudetRouter.delete("/:id", async (request, response) => {
  try {
    const kansalaisuus = await Kansalaisuus.findById(request.params.id)
    kansalaisuus.destroy()
    response.json("kansalaisuus poistettu")
  } catch (error) {
    return response
      .status(500)
      .json({ error: "Kansalaisuuden poisto epäonnistui" })
  }
})

kansalaisuudetRouter.post("/", async (request, response) => {
  const body = request.body
  if (body === undefined) {
    return response.status(400).json({ error: "content missing" })
  }
  const kansalaisuus = buildKansalaisuus(body)
  try {
    const uusiKansalaisuus = await kansalaisuus.save()
    response.status(200).json(JSON.parse(uusiKansalaisuus))
  } catch (error) {
    response.status(500).json({ error: "something went wrong..." })
  }
})

const buildKansalaisuus = kansalaisuus =>
  Kansalaisuus.build({
    valtio: kansalaisuus.valtio
  })

const formatkansalaisuus = kansalaisuus => {
  return {
    valtio: kansalaisuus.valtio
  }
}

module.exports = kansalaisuudetRouter
