const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const { User } = require("../models/db")

usersRouter.get("/", async (request, response) => {
  try {
    const users = await User.findAll()
    response.json(users.map(user => formatUser(user)))
  } catch (error) {
    return response.status(500).json({ error: "Käyttäjien haku epäonnistui" })
  }
})

usersRouter.get("/:id", async (request, response) => {
  try {
    const user = await User.findById(request.params.id)
    response.json(formatUser(user))
  } catch (error) {
    return response.status(500).json({ error: "Käyttäjän haku epäonnistui" })
  }
})

const formatUser = user => {
  return {
    id: user.id,
    username: user.username,
    nimi: user.nimi,
    oletussatama: user.oletussatama
  }
}

usersRouter.post("/", async (request, response) => {
  const body = request.body

  if (body === undefined) {
    return response.status(400).json({ error: "content missing" })
  }

  try {
    const existingUser = await User.findAll({
      where: {
        username: body.username
      }
    })
    if (existingUser.length > 0) {
      return response
        .status(400)
        .json({ error: "Käyttäjätunnus on jo olemassa" })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    await User.create({
      username: body.username,
      nimi: body.nimi,
      oletussatama: body.oletussatama,
      passwordHash
    })
    response.json(body)
  } catch (error) {
    response.status(500).json({ error: "Käyttäjän luominen epäonnistui" })
  }
})

usersRouter.delete("/:id", async (request, response) => {
  try {
    const user = await User.findById(request.params.id)
    user.destroy()
    response.json("Käyttäjä poistettu")
  } catch (error) {
    return response.status(500).json({ error: "Käyttäjän poisto epäonnistui" })
  }
})

module.exports = usersRouter
