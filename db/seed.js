const db = require('../models');

db.Doctor.create({
  firstName: 'Doogie',
  lastName: 'Howser',
  email: 'doogie@example.com',
  password: 'nph',
})
  .then(doctor => db.Patient.create({
    firstName: 'Joshua',
    lastName: 'Bohde',
    email: 'bohdecoded@gmail.com',
    password: 'password',
    doctorId: doctor.id,
  }))
  .tap(patient => db.Statistics.create({
    riskFactor: 'high-cholesterol',
    dietRecommendation: 'low-fat',
    dietRestriction: 'sugar-conscious',
    patientId: patient.id
  }))
  .then(patient => db.Recipes.create({
    patientId: patient.id,
    recipeName: 'Salad Tacos',
    recipeImg:
        'https://www.edamam.com/web-img/453/453b12b11b3fa1832288c818d5b754df.jpg',
    recipe: 'http://thepioneerwoman.com/cooking/2013/01/salad-tacos/',
    recipeUri:
        'http://www.edamam.com/ontologies/edamam.owl#recipe_54b6f6cdc6f4d67a2c1d00ba7279cfd4',
    favorite: true,
  }));
