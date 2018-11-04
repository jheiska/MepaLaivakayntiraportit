const Laiva = (sequelize, DataTypes) => {
  return sequelize.define("laiva", {
    nimi: { type: DataTypes.STRING },
    lippu: DataTypes.STRING
  })
}

module.exports = Laiva
