if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const db = require("./models/db")
const satamatRouter = require("./controllers/satamat")
const laivatRouter = require("./controllers/laivat")
const kaynnitRouter = require("./controllers/kaynnit")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const kansalaisuudetRouter = require("./controllers/kansalaisuudet")

app.use(express.static("build"))
app.use(bodyParser.json())
app.use(cors())
app.use("/api/laivat", laivatRouter)
app.use("/api/kaynnit", kaynnitRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)
app.use("/api/satamat", satamatRouter)
app.use("/api/kansalaisuudet", kansalaisuudetRouter)

/*
app.get("/", (req, res) => {
  res.send("MePa-sovellus!")
})
*/

db.connectDB()

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
