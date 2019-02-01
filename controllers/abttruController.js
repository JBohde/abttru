const path = require("path");
const db = require("../models");
const expressValidator = require("express-validator");
const axios = require('axios');
let hbs;
let faveRecipe;

module.exports = function (app) {

    app.get("/home", function (req, res) {
        res.render(path.join(__dirname, "../views/home-page.handlebars"));
    });

    app.post("/profile", function (req, res) {
        // console.log(req.body);
        var userName = req.body.patient_name;
        var userPassWord = req.body.password;

        db.patient.findAll({
            where: {
                patient_name: userName,
                password: userPassWord
            },
        }).then(patient => {
            // console.log(patient);
            if (patient.length == 0) {
                res.redirect('/');
            }
            else {
                req.session.user_name = userName;
                res.redirect('/profile');
            }
        });
    });

    app.get("/profile", function (req, res) {
        console.log("--------------------------");
        // console.log(req);

        db.patient.belongsTo(db.healthStats, { foreignKey: 'id', constraints: false });
        db.patient.belongsTo(db.savedRecipes, { foreignKey: 'id', constraints: false });
        db.patient.findAll({
            where: { patient_name: req.session.user_name },
            include: [{ model: db.healthStats }, { model: db.savedRecipes }], // load all healthStats

        }).then(patient => {
                // console.log(patient);
                let hbsPatient = { patients: patient.map(x => x.dataValues), recipes: [], faveRecipe: [] };
                
            db.savedRecipes.findAll({
                where: { patient_id: patient.map(x => x.dataValues.id).toString() },
            }).then(savedRecipes => { 
                // console.log(savedRecipes);
                hbsPatient.recipes = savedRecipes.map(x => x.dataValues);
                
                let recipeName = savedRecipes.map(x => x.dataValues.recipe_name);
                // console.log(recipeName);
                let recipeImg = savedRecipes.map(x => x.dataValues.recipe_img);
                // console.log(recipeImg);
                let recipeUrl = savedRecipes.map(x => x.dataValues.recipe);
                // console.log(recipeUrl);
                let recipeUri = savedRecipes.map(x => x.dataValues.recipe_uri);
                // console.log(recipeUri);
                // console.log(recipeUri[0].replace(/[#]/gi, '%23'));
                // let formattedUri = recipeUri[0].replace(/[#]/gi, '%23', /[:]/gi, '%3A', /[/]/, '%2F');

                // // res.json(savedRecipes);
                // //NEED TO REPLACE # with %23!!//
                // axios.get('https://api.edamam.com/search?r=' + formattedUri + '&app_id=76461587&app_key=b829a690de0595f2fa5b7cb02db4cd99')
                //     .then(response => {
                //         // faveRecipe = response.data;
                //         // console.log(faveRecipe);
                //         // console.log(response.data.explanation);
                //     }).catch(error => {
                //         console.log(error);
                // });
            }).then(() => {
                console.log(hbsPatient);
                res.render("patient-page", hbsPatient);});
            
        }).catch(function (error) {
            console.log(error);
        });
    });

    app.post("/profile/save", function (req, res) {
        console.log(req.body);
        // Save a recipe with the data available to us in req.body
        db.savedRecipes.create({
            patient_id: req.body.id,
            recipe_name: req.body.recipe_name,
            recipe_img: req.body.recipe_img,
            recipe: req.body.recipe,
            recipe_uri: req.body.recipe_uri,   
        }).then(function (savedRecipe) {
            res.send(savedRecipe);
        });
    });

    app.put("/profile/fave", function (req, res) {
        // Save a recipe with the data available to us in req.body
        console.log(req.body);
        console.log(req.body.id);
        console.log("------------------------");

        db.savedRecipes.update({
            favorite: false
        }, { where: {
                favorite: true,
                patient_id: req.body.id
            }
        }).then(function (savedRecipes) {
            db.savedRecipes.update({
                favorite: req.body.favorite
                }, { where: {
                        patient_id: req.body.id,
                        recipe: req.body.recipe
                }
            }).then(function (savedRecipe) {
                    console.log(savedRecipe);
            });
        });
    });

    app.delete("/profile/delete", function (req, res) {
        console.log(req.body);
        db.savedRecipes.destroy({
            where: {
                patient_id: req.body.id,
                recipe_uri: req.body.uri
            }
        }).then(function (res) {
            console.log(res)
        });
    });

    // ******* DOCTOR ROUTES ******* //
    app.post("/doctor", function (req, res) {
        console.log(req.body);
        var doctorName = req.body.doctor_name;
        var password = req.body.password;

        db.doctor.findAll({
            where: {
                doctor_name: doctorName,
                password: password
            }
        }).then(function (response) {
            var doctorObj = response;
            console.log(doctorObj.length);
            if (doctorObj.length == 0) {
                res.redirect('/');
            }
            else {
                req.session.doctor_name = doctorName;
                res.redirect('/doctor/form');
            }

        });


    });

    app.get("/doctor/form", function (req, res) {
        db.patient.belongsTo(db.healthStats, { foreignKey: 'id', constraints: false });
        db.patient.belongsTo(db.savedRecipes, { foreignKey: 'id', constraints: false });
        db.patient.findAll({
            include: [{ model: db.healthStats }, { model: db.savedRecipes }], // load all healthStats 
        }).then(patient => {
            let hbsPatient = { patients: patient.map(x => x.dataValues) };
            res.render("doctor-page", hbsPatient);
        })
    });

    app.get("/patient/list", function (req, res) {
        db.patient.findAll({
        }).then(patient => {
            hbsObj = { patients: patient.map(x => x.dataValues) };
            console.log(hbsObj);
            res.render("doctor-page", hbsObj);
        });
    });

    app.get("/api/patient/:patient_name", function (req, res) {
        db.patient.belongsTo(db.healthStats, { foreignKey: 'id', constraints: false });
        db.patient.belongsTo(db.savedRecipes, { foreignKey: 'id', constraints: false });
        db.patient.findAll({
            where: { user_name: "JohnDoe" },
            include: [{ model: db.healthStats }, { model: db.savedRecipes }], // load all healthStats 
        }).then(patient => {
            let hbsPatient = { patients: patient.map(x => x.dataValues) };
            res.render("doctor-page", hbsPatient);
        })
    });

    app.post("/api/patient", function (req, res) {

        req.checkBody('patient_name', 'Username field cannot be empty.').notEmpty();
        req.checkBody('patient_name', 'Username must be between 4-15 characters long.').len(4, 15);
        const errors = req.validationErrors();

        if (errors) {
            console.log(`errors: ${JSON.stringify(errors)}`);
            res.render('doctor-page', { errors: errors });
        } else {

            const patientName = req.body.patient_name;
            console.log('-------------------------------------------');
            console.log(req.body);

            // Create an patient with the data available to us in req.body
            db.patient.belongsTo(db.healthStats, { foreignKey: 'id', constraints: false });
            console.log("Patient Data:");
            console.log(JSON.stringify(req.body, null, 2));
            db.patient.create({
                patient_name: req.body.patient_name,
                user_name: 'default_username',
                password: req.body.password
            }),
                db.healthStats.create({
                    patient_id: db.patient.id,
                    risk_factor: req.body.risk_factor,
                    diet_recommendation: req.body.diet_recommendation,
                    diet_restriction: req.body.diet_restriction
                }).then(() => {
                    res.redirect('/doctor/form')
                });
        }

    });

    app.delete("/api/patient/:id", function (req, res) {
        console.log(req.params.id);
        db.patient.destroy({
            where: {
                id: req.params.id
            }
        }).then(() => {
            res.send({ id: req.params.id });
        });
    });

};

