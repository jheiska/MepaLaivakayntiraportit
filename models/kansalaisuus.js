const Kansalaisuus = (sequelize, DataTypes) => {
  return sequelize.define("kansalaisuus", {
    valtio: { type: DataTypes.STRING }
  })
}

module.exports = Kansalaisuus
