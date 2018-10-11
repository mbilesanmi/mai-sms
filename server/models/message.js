module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 160],
          msg: 'Message content must be between 1 and 160 characters in length'
        }
      },
    },
    
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'sent'
    },
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Contact, {
      as: 'sender',
      foreignKey: 'senderId',
      onDelete: 'CASCADE',
    })
    Message.belongsTo(models.Contact, {
      as: 'reciever',
      foreignKey: 'receiverId',
      onDelete: 'CASCADE',
    })
  };

  return Message;
};
