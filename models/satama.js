const Satama = (sequelize, DataTypes) => {
  return sequelize.define("satama", {
    kaupunki: DataTypes.STRING,
    koodi: DataTypes.STRING
  })
}

module.exports = Satama
