const kayntiRouter = require("express").Router()
const { Kaynti, Laiva } = require("../models/db")
const jwt = require("jsonwebtoken")

kayntiRouter.get("/", async (request, response) => {
  try {
    const kaynnit = await Kaynti.findAll({ include: [{ model: Laiva }] })
    response.json(kaynnit.map(kaynti => formatKaynti(kaynti)))
  } catch (error) {
    return response.status(500).json({ error: "Käyntien haku epäonnistui" })
  }
})

kayntiRouter.get("/:id", async (request, response) => {
  try {
    const kaynti = await Kaynti.findById(request.params.id)
    response.json(formatKaynti(kaynti))
  } catch (error) {
    return response.status(500).json({ error: "Käynnin haku epäonnistui" })
  }
})

kayntiRouter.delete("/:id", async (request, response) => {
  try {
    const kaynti = await Kaynti.findById(request.params.id)

    await kaynti.destroy()
    response.status(200).json("Käynti poistettu")
  } catch (error) {
    return response.status(500).json({ error: "Poisto epäonnistui" })
  }
})

const getTokenFrom = request => {
  const authorization = request.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7)
  }
  return null
}

kayntiRouter.post("/", async (request, response) => {
  const body = request.body
  try {
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.username) {
      return response.status(401).json({ error: "token missing or invalid" })
    }

    if (body === undefined) {
      return response.status(400).json({ error: "content missing" })
    }
    const kaynti = buildKaynti(body)

    await kaynti.save()
    response.json(body)
  } catch (exception) {
    if (exception.name === "JsonWebTokenError") {
      response.status(401).json({ error: "invalid token" })
    } else {
      response.status(500).json({ error: "something went wrong..." })
    }
  }
})

const buildKaynti = kaynti =>
  Kaynti.build({
    pvm: kaynti.pvm,
    kayttaja: kaynti.kayttaja,
    kavijat: kaynti.kavijat,
    satama: kaynti.satama,
    laivaId: kaynti.laivaId,
    palvelut: kaynti.palvelut,
    toimitukset: kaynti.toimitukset,
    kesto: kaynti.kesto,
    henkiloiden_maara: kaynti.henkiloiden_maara,
    keskustelujen_maara: kaynti.keskustelujen_maara,
    kuljetettujen_maara: kaynti.kuljetettujen_maara,
    merenkulkijoiden_viesti: kaynti.merenkulkijoiden_viesti,
    mepan_viesti: kaynti.mepan_viesti
  })

const formatKaynti = kaynti => {
  return {
    pvm: kaynti.pvm,
    kayttaja: kaynti.kayttaja,
    kavijat: kaynti.kavijat,
    satama: kaynti.satama,
    laiva: [kaynti.laiva.nimi, kaynti.laiva.lippu, kaynti.laiva.kansalaisuudet],
    palvelut: kaynti.palvelut,
    toimitukset: kaynti.palvelut,
    kesto: kaynti.kesto,
    henkiloiden_maara: kaynti.henkiloiden_maara,
    keskustelujen_maara: kaynti.keskustelujen_maara,
    kuljetettujen_maara: kaynti.kuljetettujen_maara,
    merenkulkijoiden_viesti: kaynti.merenkulkijoiden_viesti,
    mepan_viesti: kaynti.mepan_viesti
  }
}

module.exports = kayntiRouter
