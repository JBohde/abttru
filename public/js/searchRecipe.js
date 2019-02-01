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
        console.log(diet_option);
        console.log(diet_restriction);
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

function createSlider(response) {
    // we create indicators - we will target this 
    // in the for loop with <li> items
    let itemActive = $("#item-active");

    var activeImg = $("<img>").attr({
        "src": response.hits[0].recipe.image,
        "data-id": 0,
        "class": "img-responsive"
    });


    var activeCaption = $(`<a>`);
    activeCaption.attr({
        "href": response.hits[0].recipe.url,
        "target": "_blank",
        /*        "class": "btn btn-info", */
        "role": "button"

    });
    activeCaption.text(response.hits[0].recipe.label);
    activeCaption.css("color", "black");

    // let activeImg = $("<img src = 'response.hits[0].recipe.image' alt = 'recipe'>");
    itemActive.append(activeCaption);
    itemActive.append(activeImg);

    $('.carousel').carousel("pause");
    $("#panel-slider").show();

    id = 1;

    // populate our slider with text content

    for (let i = 1; i < response.hits.length; i++) {
        console.log(response.hits[i])

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
            "target": "_blank",
            /* "class": "btn btn-info", */
            "role": "button"
        });
        itemCaption.text(response.hits[i].recipe.label);
        itemCaption.css("color", "black");

        itemDiv.append(itemCaption);
        itemDiv.append(itemImg);

        $("#item-list").append(itemDiv);


    }
}