$(document).ready(function () {
    var currentURL = window.location.origin;
    let userQ;

    $(document).on('click', ".search", function (event) {
        $(".patient-form").hide();
        $(".doctor-form").hide();
        $(".please-login").hide();
        event.preventDefault();
        userQ = $("#user-input").val().trim();
        // risk_factor = $("#risk-factor").val().toLowerCase().trim();
        diet_option = $("#diet-factor").val().toLowerCase().trim();
        diet_restriction = $("#diet-restriction").val().toLowerCase().trim();
        // console.log(risk_factor);
        // console.log(diet_option);
        // console.log(diet_restriction);
        $.ajax({
            url: `https://api.edamam.com/search?q=${userQ}&app_id=76461587&app_key=b829a690de0595f2fa5b7cb02db4cd99&from=0&to=5&diet=${diet_option}&health=${diet_restriction}`,
            method: "GET"
        }).done(function (response) {

            createSlider(response);

        });
    });
    $(document).on('change', '.login', function () {
        login_option = $("#login").val().toLowerCase().trim();
        if (login_option === "patient") {
            $(".patient-form").show();
            $(".doctor-form").hide();
        }
        else if (login_option === "dietitian") {
            $(".patient-form").hide();
            $(".doctor-form").show();
        }
        else {
            $(".patient-form").hide();
            $(".doctor-form").hide();
        }

    });
});

//     $(document).on('click', ".patient-login", function (event) {
//         event.preventDefault();
//     console.log("click");
//     alert("click")
//     var userName = $("#inputUsername").val();
//     var passWord = $("#inputPassword").val();
//     console.log(userName);
//     console.log(passWord);

//         $.ajax({
//             url: "/profile",
//             method: "GET",
//             body: {
//                 user_name: userName,
//                 password: passWord
//             }
//         }).done();
//     });
// //  });

function createSlider(response) {
    // we create indicators - we will target this 
    // in the for loop with <li> items
    let itemActive = $("#item-active");

    var activeImg = $("<img>").attr({
        "src": response.hits[0].recipe.image,
        "data-id": 0,
        "class": "img-responsive"
    });


    // let activeCaption = $("<h3>").text(response.hits[0].recipe.label);

    var activeCaption = $(`<a>`);
    activeCaption.attr({
        "href": response.hits[0].recipe.url,
        /*        "class": "btn btn-info", */
        "role": "button"

    });
    activeCaption.text(response.hits[0].recipe.label);
    activeCaption.css("color", "black");

    var saveLink = response.hits[0].recipe.uri;


    // // make function
    // var addFavBttn = $("<a>");
    // addFavBttn.addClass("btn btn default fav-this");
    // addFavBttn.attr({
    //     "id": saveLink,
    //     "class": "btn btn-info",
    //     "role": "button"
    // });
    // addFavBttn.text("Fave This!");


    // // make function
    // var addSaveBttn = $("<a>");
    // addSaveBttn.addClass("btn btn default save-this");
    // addSaveBttn.attr({
    //     "id": saveLink,
    //     "class": "btn btn-info",
    //     "role": "button"
    // });
    // addSaveBttn.text("Save This!");



    // let activeImg = $("<img src = 'response.hits[0].recipe.image' alt = 'recipe'>");
    itemActive.append(activeCaption);
    itemActive.append(activeImg);

    // itemActive.append(addSaveBttn);

    // itemActive.append(addFavBttn);



    $('.carousel').carousel("pause");

    $("#panel-slider").show();


    // console.log(response.hits[0].recipe.image);
    // console.log(response.hits[1].recipe.image);
    // start of plotly code
    id = 1;

    // createPlots(responseObject, 0);

    // populate our slider with text content

    for (let i = 1; i < response.hits.length; i++) {
        // console.log(response.hits[i])

        let itemDiv = $("<div>").attr({
            class: "item",
            "data-id": i
        });


        var itemImg = $("<img>").attr({
            "src": response.hits[i].recipe.image,
            "id": "image" + i,
            "class": "img-responsive"
        });

        var itemCaption = $(`<a>`);
        itemCaption.attr({
            "href": response.hits[i].recipe.url,
            /* "class": "btn btn-info", */
            "role": "button"
        });
        itemCaption.text(response.hits[i].recipe.label);
        itemCaption.css("color", "black");

        // var saveLink = response.hits[i].recipe.uri;

        // // make function
        // var addFavBttn = $("<a>");
        // // addFavBttn.addClass("btn btn default fav-this");
        // addFavBttn.attr({
        //     "id": saveLink,
        //     "class": "btn btn-info fav-this",
        //     "role": "button"
        // });
        // addFavBttn.text("Fave This!");


        // // make function
        // var addSaveBttn = $("<a>");
        // // addSaveBttn.addClass("btn btn default save-this");
        // addSaveBttn.attr({
        //     "id": saveLink,
        //     "class": "btn btn-info save-this",
        //     "role": "button"
        // });
        // addSaveBttn.text("Save This!");

        itemDiv.append(itemCaption);
        itemDiv.append(itemImg);

        // itemDiv.append(addSaveBttn);

        // itemDiv.append(addFavBttn);

        $("#item-list").append(itemDiv);


    }
}