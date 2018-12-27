let this_id = $("#1").data().value;
let risk_factor = $("#2").data().value;
let diet_recommendation = $("#3").data().value;
let diet_restriction = $("#4").data().value;
// let fave_recipe = $("#5").data().value;
let responseObject;
let id;
let nextSlide = 0;
var myModal = $("#login-modal");
var isModalShowing = false;

$(".search").on('click', function (event) {
    event.preventDefault();
    userQ = $("#user-input").val().trim();
    // console.log(userQ);
    // console.log("--------------------");
    // console.log(risk_factor);
    // console.log(diet_recommendation);
    // console.log(diet_restriction);
    // console.log(fave_recipe);
    $.ajax({
        url: `https://api.edamam.com/search?q=${userQ}&app_id=76461587&app_key=b829a690de0595f2fa5b7cb02db4cd99&from=0&to=5&calories=591-722&Diet=${risk_factor}&Health=${diet_recommendation}`,
        method: "GET"
    }).done(function (response) {

        responseObject = response;


        for (let i = 0; i < response.hits.length; i++) {

            // console.log(response.hits[i])
            // console.log(this_id);
            // console.log(response.hits[i])
            let itemActive = $("#item-active");
            var saveLink = response.hits[0].recipe.url;
            let itemDiv = $("<div class='col-md-4 recipe'>").attr({
                "class": "item",
                "data-id": i
            });
            if (i < 1) {

                var activeImg = $("<img>").attr({
                    "src": response.hits[i].recipe.image,
                    "data-id": 0,
                    "class": "img-responsive"
                });

                var activeCaption = $(`<a>`);
                activeCaption.attr({
                    "href": response.hits[i].recipe.url,
                    "role": "button"
                });
                activeCaption.text(response.hits[i].recipe.label);
                activeCaption.css("color", "black");

                var addSaveBttn = $("<a>");
                addSaveBttn.attr({
                    "id": response.hits[i].recipe.url,
                    "class": "btn btn-info save-this",
                    "role": "button"
                });
                addSaveBttn.text("Save This!");

                console.log("its zero");

                // make function
                var addFavBttn = $("<a>");
                addFavBttn.addClass("btn btn default fav-this");
                addFavBttn.attr({
                    "id": response.hits[i].recipe.url,
                    "class": "btn btn-info",
                    "role": "button"
                });
                addFavBttn.text("Fave This!");

                itemActive.append(activeCaption);
                itemActive.append(activeImg);
                itemActive.append(addSaveBttn);
                itemActive.append(addFavBttn);

                $('.carousel').carousel("pause");
                $("#panel-slider").show();
                id = 1;
                responseObject = response;
                createPlots(responseObject, i);

                continue;
            }

            activeImg = $("<img>").attr({
                "src": response.hits[i].recipe.image,
                "data-id": i,
                "class": "img-responsive"
            });

            activeCaption = $(`<a>`);
            activeCaption.attr({
                "href": response.hits[i].recipe.url,
                "target": "_blank",
                "role": "button"
            });
            activeCaption.text(response.hits[i].recipe.label);
            activeCaption.css("color", "black");

            saveLink = response.hits[i].recipe.url;

            // make function
            addFavBttn = $("<a>");
            addFavBttn.attr({
                "id": response.hits[i].recipe.url,
                "class": "btn btn-info fave-this",
                "role": "button"
            });
            addFavBttn.text("Fave This!");

            // make function
            addSaveBttn = $("<a>");
            addSaveBttn.attr({
                "id": response.hits[i].recipe.url,
                "class": "btn btn-info save-this",
                "role": "button"
            });
            addSaveBttn.text("Save This!");

            itemDiv.append(activeCaption);
            itemDiv.append(activeImg);
            itemDiv.append(addSaveBttn);
            itemDiv.append(addFavBttn);

            $("#item-list").append(itemDiv);

        }

        console.log($(`#item-active`).hasClass("active"));

        $(".fave-this").on('click', function (event) {
            // console.log("favorited");
            uri = event.currentTarget.id;
            // console.log(uri);
            // console.log(this_id);
            var id = this_id;
            var newFavorite = $(this).data("true");
            // var newFavoriteState = { favorite: newFavorite }

            var itsFaved = "<h2>" + "This is now your favorite recipe!" + "</h2>";
            if (isModalShowing) return;
            isModalShowing = true;
            $(".modal-body").append(itsFaved);
            myModal.attr("class", "modal fade in");
            myModal.attr("style", "display: block");
            $.ajax({
                url: "profile/fave",
                method: "PUT",
                data: {
                    favorite: true,
                    id: id,
                    recipe: uri
                }
            }).done(function (response) {
                // console.log("This is your new favorite!");

            });
        });

        $(".save-this").on('click', function (event) {
            // console.log('saved');
            uri = event.currentTarget.id;
            // console.log(uri);
            // console.log(this_id);
            var id = this_id;
            var itsFaved = "<h2>" + "Your reciped has been saved!" + "</h2>";
            if (isModalShowing) return;
            isModalShowing = true;
            $(".modal-body").append(itsFaved);
            myModal.attr("class", "modal fade in");
            myModal.attr("style", "display: block");
            $.ajax({
                url: "/profile/save",
                method: "POST",
                data: {
                    save_recipe: uri,
                    id: id
                }
            }).done(function (response) {
                // console.log(response);

            });
        });

        // Sets a listener for closing the modal and resetting parameters
        $(".close").on("click", function () {
            $(".header-content").empty();
            $(".modal-body").empty();
            $(".footer-content").empty();
            myModal.attr("class", "modal fade out");
            myModal.attr("style", "display: none");
            isModalShowing = false;
        });

    });
});

$(".right").on('click', function (event) {
    // console.log('right clicked modafoca!');
    nextSlide++;
    if (nextSlide > 4) {
        nextSlide = 0;
        createPlots(responseObject, nextSlide);
    }
    // console.log(nextSlide);
    createPlots(responseObject, nextSlide);
});

$(".left").on('click', function (event) {
    // console.log('right clicked modafoca!');
    nextSlide--;
    if (nextSlide < 0) {
        nextSlide = 4;
        createPlots(responseObject, nextSlide);
    }
    // console.log(nextSlide);
    createPlots(responseObject, nextSlide);
});




function createPlots(response, i) {
    let arrayDigest = response.hits[i].recipe.digest;
    let reciYield = response.hits[i].recipe.yield;

    let servingArray = [];
    let firstPlot = {
        values: [],
        labels: []
    };
    let secondPlot = {
        values: [],
        labels: []
    }
    let thirdPlot = {
        values: [],
        labels: []
    }
    let fourthPlot = {
        values: [],
        labels: []
    }

    var ultimateColors = [
        ['#2E5894', '#8FD400', '#9C2542'],
        ['#0095B7', '#2D383A', '#1AB385', '#A50B5E'],
        ['#ABAD48', '#469496', '#436CB9', '#469A84', '#353839', '#2D5DA1', '#64609A'],
        ['#E97451', '#FC80A5', '#C62D42', '#C9A0DC', '#76D7EA', '#FF8833', '#29AB87', '#AF593E', '#01786F', '#FFCBA4', '#FCD667', '#ED0A3F', '#FBE870']
    ];

    arrayDigest.forEach((nutrient, i) => {
        // console.log(nutrient.label, nutrient.unit);
        // push nutrient servings for each nutrient
        if (nutrient.label === "Fat" || nutrient.label === "Carbs" || nutrient.label === "Protein") {
            firstPlot.values.push(nutrient.total / reciYield);
            firstPlot.labels.push(nutrient.label);

            if (nutrient.label === "Fat") {
                nutrient.sub.forEach(fat => {

                    secondPlot.values.push(fat.total / reciYield);
                    secondPlot.labels.push(fat.label);
                })

            }
        }

        // else if (nutrient.label != "Cholesterol" & nutrient.label != "Folate equivalent (total)" & nutrient.label != "Folate (food)") {
        //     console.log(nutrient);
        //     console.log(arrayDigest.slice(1, 5));
        //     thirdPlot.values.push(nutrient.daily / reciYield);
        //     thirdPlot.labels.push(nutrient.label);

        // }
        else if (i > 3 & i < 11) {
            // console.log(nutrient, i);
            // console.log(arrayDigest.slice(1, 5));
            thirdPlot.values.push((nutrient.total) / reciYield);
            thirdPlot.labels.push(nutrient.label);

        }
        else if (i > 10 & i < 24) {
            // console.log(nutrient, i);
            // console.log(arrayDigest.slice(1, 5));
            fourthPlot.values.push(nutrient.total / reciYield);
            fourthPlot.labels.push(nutrient.label);

        }

    });

    // process nutrition data
    let totalNutrients = response.hits[1].recipe.digest;

    // calculate totalNutrient per serving for our recipe
    for (var key in totalNutrients) {
        if (totalNutrients.hasOwnProperty(key)) {
            var val = totalNutrients[key];
            var perServing = val.quantity / 8;

        }
    }
    // populate the website with beautiful plots
    var data = [{
        values: firstPlot.values,
        labels: firstPlot.labels,
        domain: {
            x: [0, .48],
            y: [0, .49]
        },
        name: 'Macronutrients',
        hoverinfo: 'label+percent+name',
        hole: .6,
        type: 'pie',
        marker: {
            colors: ultimateColors[0]
        }
    }, {
        values: secondPlot.values,
        labels: secondPlot.labels,
        text: 'Fats',
        textposition: 'inside',
        domain: {
            x: [0.52, 1],
            y: [0, .49]
        },
        name: 'Lipids',
        hoverinfo: 'label+percent+name',
        hole: .6,
        type: 'pie',
        marker: {
            colors: ultimateColors[1]
        }
    }, {

        values: thirdPlot.values,
        labels: thirdPlot.labels,
        domain: {
            x: [0, .48],
            y: [.51, 1]
        },
        name: 'Minerals',
        hoverinfo: 'label+percent+name',
        hole: .6,
        type: 'pie'
    }, {
        values: fourthPlot.values,
        labels: fourthPlot.labels,
        text: 'Vitamins',
        textposition: 'inside',
        domain: {
            x: [0.52, 1],
            y: [0.52, 1]
        },
        name: 'Vitamins',
        hoverinfo: 'label+percent+name',
        hole: .6,
        type: 'pie',

    }];

    var layout = {
        title: 'Nutrient Breakdown',
        titlefont:
            {
                size: 30
            },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        annotations: [
            {
                font: {
                    size: 14
                },
                showarrow: false,
                text: 'Minerals',
                x: 0.15,
                y: 0.8
            },
            {
                font: {
                    size: 14
                },
                showarrow: false,
                text: 'Vitamins',
                x: 0.85,
                y: 0.8
            },
            {
                font: {
                    size: 14
                },
                showarrow: false,
                text: 'Macros',
                x: 0.15,
                y: 0.2
            },
            {
                font: {
                    size: 14
                },
                showarrow: false,
                text: 'Lipids',
                x: 0.82,
                y: 0.2
            },

        ],
        showlegend: false,
        height: 750,
        width: 750
        //plot_bgcolor='rgb(254, 247, 234, 0.2)'
    };

    Plotly.newPlot('tester', data, layout);

}