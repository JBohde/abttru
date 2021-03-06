module.exports = function (sequelize, DataTypes) {
  const Recipes = sequelize.define('Recipes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      field: 'patient_id',
      type: DataTypes.UUID,
      references: {
        model: 'patients',
        key: 'id',
      },
    },
    recipeName: {
      field: 'recipe_name',
      type: DataTypes.STRING,
    },
    recipeImg: {
      field: 'recipe_img',
      type: DataTypes.STRING,
    },
    recipe: {
      type: DataTypes.STRING,
    },
    recipeUri: {
      field: 'recipe_uri',
      type: DataTypes.STRING,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
    },
  });

  Recipes.associate = models => {
    Recipes.belongsTo(models.Patient, {
      as: 'patient',
      foreignKey: 'patientId',
      targetKey: 'id',
    });
  };

  return Recipes;
};
