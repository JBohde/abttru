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
let image;
let caption;
let saveBttn;
let faveBttn;

$(".search").on('click', function (event) {
    event.preventDefault();
    userQ = $("#user-input").val().trim();
    $.ajax({
        url: `https://api.edamam.com/search?q=${userQ}&app_id=76461587&app_key=b829a690de0595f2fa5b7cb02db4cd99&from=0&to=5&calories=591-722&Diet=${risk_factor}&Health=${diet_recommendation}`,
        method: "GET"
    }).done(function (response) {

        responseObject = response;


        for (let i = 0; i < response.hits.length; i++) {

            function makeButton(i,name){
                button = $("<button>");
                button.attr({
                    "id": response.hits[i].recipe.label,
                    "src": response.hits[i].recipe.image,
                    "value": response.hits[i].recipe.url,
                    "uri": response.hits[i].recipe.uri,
                    "class": "btn btn-info " + name,
                    "data-toggle": "modal",
                    "data-target": "#login-modal",
                    "role": "button"
                });
               button.text(name + " This!");
                // if(i < 1) {
                //     itemActive.append(button)
                // } else {
                //     itemDiv.append(button)
                // }
            }

            let itemActive = $("#item-active");
            let itemDiv = $("<div class='col-md-4 recipe'>").attr({
                "class": "item",
                "data-id": i
            });

            image = $("<img>").attr({
                "id": response.hits[i].recipe.uri,
                "src": response.hits[i].recipe.image,
                "data-id": i,
                "class": "img-responsive"
            });

            caption = $(`<a>`);
            caption.attr({
                "href": response.hits[i].recipe.url,
                "target": "_blank",
                "role": "button"
            });
            caption.text(response.hits[i].recipe.label);
            caption.css("color", "black");

            makeButton(i, "Save");
            makeButton(i, "Fave");

            if(i < 1) {
                itemActive.append(caption)
                .append(image)
                makeButton(i, "Save");
                makeButton(i, "Fave");
                continue;
            }

            itemDiv.append(caption)
            .append(image)
            makeButton(i, "Save");
            makeButton(i, "Fave");

            $("#item-list").append(itemDiv);
            $('.carousel').carousel("pause");
            $("#panel-slider").show();
            id = 1;
            responseObject = response;
            createPlots(responseObject, i);

        }

        $(".save").on('click', function (event) {
            name = event.currentTarget.id;
            src = event.currentTarget.getAttribute('src');
            recipe = event.currentTarget.getAttribute('value');
            uri = event.currentTarget.getAttribute('uri');
            let id = this_id;
            let itsFaved = "<h2>" + "Your reciped has been saved!" + "</h2>";
            $(".modal-body").append(itsFaved);
            $.ajax({
                url: "/profile/save",
                method: "POST",
                data: {
                    id: id,
                    recipe_name: name,
                    recipe_img: src,
                    recipe: recipe,
                    recipe_uri: uri
                }
            }).then(function (response) {
                console.log(response);
            });
        });

        $(".fave").on('click', function (event) {
            name = event.currentTarget.id;
            src = event.currentTarget.getAttribute('src');
            recipe = event.currentTarget.getAttribute('value');
            uri = event.currentTarget.getAttribute('uri');
            let id = this_id;
            let newFavorite = $(this).data("true");
            let itsFaved = "<h2>" + "This is now your favorite recipe!" + "</h2>";
            $(".modal-body").append(itsFaved);
            $.ajax({
                url: "profile/fave",
                method: "PUT",
                data: {
                    favorite: true,
                    id: id,
                    recipe: recipe,
                }
            }).then(function (response) {
                console.log(response);
            });
        });
    });
});

$(".change-favorite").on('click', function (event) {
    name = event.currentTarget.id;
    src = event.currentTarget.getAttribute('src');
    recipe = event.currentTarget.getAttribute('value');
    uri = event.currentTarget.getAttribute('uri');
    var id = this_id;
    var newFavorite = $(this).data("true");
    var itsFaved = "<h2>" + "This is now your favorite recipe!" + "</h2>";
    $(".modal-body").append(itsFaved);
    $.ajax({
        url: "profile/fave",
        method: "PUT",
        data: {
            favorite: true,
            id: id,
            recipe: recipe,
        }
    }).then(function () {
        console.log("This is your new favorite!");
    });
});

$(".delete-recipe").on('click', function (event) {
    event.preventDefault();
    uri = event.currentTarget.getAttribute('value');
    var id = this_id;
    var itsDeleted = "<h2>" + "This recipe has been deleted" + "</h2>";
    $(".modal-body").append(itsDeleted);
    $.ajax({
        url: "profile/delete",
        method: "DELETE",
        data: {
            id: id,
            uri: uri,
        }
    }).then(function () {
        console.log("Recipe Deleted!");
    });
})

// Sets a listener for closing the modal and resetting parameters
$(".close").on("click", function () {
    $(".header-content").empty();
    $(".modal-body").empty();
    $(".footer-content").empty();
    myModal.attr("class", "modal fade out");
    myModal.attr("style", "display: none");
    isModalShowing = false;
    // Reload the page to get the updated list
    window.location.reload(false);
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

    var dataOne = [{
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
    }];

    var dataTwo = [{
        values: secondPlot.values,
        labels: secondPlot.labels,
        text: 'Fats',
        textposition: 'inside',
        domain: {
            x: [0, .48],
            y: [0, .49]
        },
        name: 'Lipids',
        hoverinfo: 'label+percent+name',
        hole: .6,
        type: 'pie',
        marker: {
            colors: ultimateColors[1]
        }
    }];

    var dataThree = [{
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
    }];

    var dataFour = [{
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
        type: 'pie'
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

    var layoutOne = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        annotations:[{
            font: {
                size: 14
            },
            showarrow: false,
            text: 'Minerals',
            x: 0.15,
            y: 0.8
        }],
        showlegend: false,
        height: 600,
        width: 600
      };

    var layoutTwo = {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      annotations:[{
        font: { size: 14 },
        showarrow: false,
        text: 'Vitamins',
        x: 0.85,
        y: 0.8
      }],
      showlegend: false,
      height: 600,
      width: 600
    };
    
    var layoutThree = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        annotations:[{
          font: { size: 14 },
          showarrow: false,
          text: 'Macros',
          x: 0.15,
          y: 0.2
        }],
        showlegend: false,
        height: 600,
        width: 600
    };

    var layoutFour = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        annotations:[{
          font: { size: 14 },
          showarrow: false,
          text: 'Lipids',
          x: 0.82,
          y: 0.2
        }],
        showlegend: false,
        height: 600,
        width: 600
    };

    Plotly.newPlot('tester', data, layout);
    // Plotly.newPlot('tester-1', dataOne, layoutOne);
    // Plotly.newPlot('tester-2', dataTwo, layoutTwo);
    // Plotly.newPlot('tester-3', dataThree, layoutThree);
    // Plotly.newPlot('tester-4', dataFour, layoutFour);

}