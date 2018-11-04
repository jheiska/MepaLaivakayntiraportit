//require("dotenv").config()
const Sequelize = require("sequelize")

// Lokaali tietokanta.
/*
const sequelize = new Sequelize(
  "postgres://jaakk:jaakko@localhost:5432/mepaTest"
)
*/

const sequelize = new Sequelize(process.env.POSTGRES, { dialect: "postgres" })

const Kaynti = sequelize.import("./kaynti")
const Laiva = sequelize.import("./laiva")
const User = sequelize.import("./user")
const Satama = sequelize.import("./satama")
const Kansalaisuus = sequelize.import("./kansalaisuus")

const connectDB = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.")
    })
    .catch(err => {
      console.error("Unable to connect to the database:", err)
    })

  Kaynti.belongsTo(Laiva)
  Laiva.hasMany(Kaynti)

  Laiva.belongsToMany(Kansalaisuus, {
    through: "LaivaKansalaisuus"
  })
  Kansalaisuus.belongsToMany(Laiva, {
    through: "LaivaKansalaisuus"
  })
  /*
  User.belongsTo(Satama)
  Satama.hasMany(User)
*/
  sequelize.sync()
}

module.exports = {
  sequelize,
  connectDB,
  Laiva,
  Kaynti,
  Satama,
  User,
  Kansalaisuus
}
