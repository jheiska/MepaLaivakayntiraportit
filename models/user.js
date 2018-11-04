const User = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    username: DataTypes.STRING,
    nimi: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    oletussatama: DataTypes.STRING
    /*
    oletussatama: {
      type: DataTypes.STRING,
      references: {
        model: "satama",
        key: "koodi"
      }
    }
    */
  })
}

module.exports = User
