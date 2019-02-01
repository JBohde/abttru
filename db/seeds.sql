-- Insert a set of records.

INSERT INTO patients
    (patient_name, user_name, password)
VALUES
    ('John Doe', 'JohnDoe', 'password');
INSERT INTO healthStats
    (patient_id, diet_recommendation, risk_factor, diet_restriction)
VALUES
    ('1', 'low-fat', 'high-cholesterol', 'sugar-conscious');
INSERT INTO doctors
    (patient_id, doctor_name, user_name, password)
VALUES
    ('1', 'Doogie Howser', 'Doogie', 'nph');
INSERT INTO savedRecipes
    (patient_id, recipe_name, recipe_img, recipe, recipe_uri, favorite)
VALUES
    ('1', 'Salad Tacos', 'https://www.edamam.com/web-img/453/453b12b11b3fa1832288c818d5b754df.jpg', 'http://thepioneerwoman.com/cooking/2013/01/salad-tacos/', 'http://www.edamam.com/ontologies/edamam.owl#recipe_54b6f6cdc6f4d67a2c1d00ba7279cfd4',  true);
