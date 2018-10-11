module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5, 30],
          msg: 'Name must be at least 5 characters in length'
        }
      }
    },
    phoneNum: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Phone number already exists'
      },
      validate: {
        notEmpty: true
      }
    }
  });

  Contact.associate = function(models) {
    // associations can be defined here
  };
  return Contact;
};