module.exports = function (sequelize, DataTypes) {
    var savedRecipes = sequelize.define("savedRecipes", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        patient_id: {
            type: DataTypes.INTEGER,
        },
        recipe_name: {
            type: DataTypes.STRING,
        },
        recipe_img: {
            type: DataTypes.STRING,
        },
        recipe: {
            type: DataTypes.STRING,
        },
        recipe_uri: {
            type: DataTypes.STRING,
        },
        favorite: {
            type: DataTypes.BOOLEAN, defaultValue: false
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        }
    });

    return savedRecipes;
};