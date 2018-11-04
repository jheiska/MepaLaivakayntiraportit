const laivatRouter = require("express").Router()
const { Laiva, Kansalaisuus } = require("../models/db")

laivatRouter.get("/", async (request, response) => {
  try {
    const laivat = await Laiva.findAll({ include: [{ model: Kansalaisuus }] })
    response.json(laivat.map(laiva => formatLaiva(laiva)))
  } catch (error) {
    return response.status(500).json({ error: "Laivoja ei löytynyt" })
  }
})

laivatRouter.get("/:id", async (request, response) => {
  try {
    const laiva = await Laiva.findById(request.params.id, {
      include: [{ model: Kansalaisuus }]
    })
    response.json(formatLaiva(laiva))
  } catch (error) {
    return response.status(500).json({ error: "Laivaa ei löytynyt" })
  }
})

laivatRouter.delete("/:id", async (request, response) => {
  try {
    const laiva = await Laiva.findById(request.params.id)
    laiva.destroy()
    response.json("Laiva poistettu")
  } catch (error) {
    return response.status(500).json({ error: "Poisto epäonnistuii" })
  }
})

laivatRouter.post("/", async (request, response) => {
  const body = request.body
  if (body === undefined) {
    return response.status(400).json({ error: "content missing" })
  }

  const laiva = buildLaiva(body)
  try {
    await laiva.save()
    return response.status(200).json(formatLaiva(laiva))
  } catch (error) {
    response.status(500).json({ error: "something went wrong..." })
  }
})

const buildLaiva = laiva =>
  Laiva.build({
    nimi: laiva.nimi,
    lippu: laiva.lippu,
    kansalaisuudet: laiva.kansalaisuudet
  })

laivatRouter.put("/:id", async (request, response) => {
  try {
    const laiva = await Laiva.findById(request.params.id)
    const kansalaisuusId = request.body.kansalaisuus
    const kansalaisuus = await Kansalaisuus.findById(kansalaisuusId)

    await laiva.addKansalaisuus(kansalaisuus)
    //await laiva.removeKansalaisuus(kansalaisuus)
    response.json(kansalaisuus.valtio)
  } catch (error) {
    response.status(500).json({ error: "something went wrong..." })
  }
  /*
  const updatedLaiva = await Laiva.update(
    { kansalaisuudet: request.body.kansalaisuudet },
    { returning: true, where: { id: request.params.laivaId } }
  )
  
  response.json(formatLaiva(updatedLaiva))
  */
})

const formatLaiva = laiva => {
  const kansalaisuuslista = laiva.kansalaisuus
    ? laiva.kansalaisuus.map(kansalaisuus => kansalaisuus.valtio)
    : []
  return {
    id: laiva.id,
    nimi: laiva.nimi,
    lippu: laiva.lippu,
    kansalaisuudet: kansalaisuuslista
  }
}

module.exports = laivatRouter
