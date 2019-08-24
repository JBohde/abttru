var this_id = $('#1').data().value;
var risk_factor = $('#2').data().value;
var diet_recommendation = $('#3').data().value;
var diet_restriction = $('#4').data().value;
// var fave_recipe = $("#5").data().value;
var edamamKey = 'b829a690de0595f2fa5b7cb02db4cd99';
var responseObject;
var id;
var nextSlide = 0;
var currentPlot = $('#macros-container');
var myModal = $('#login-modal');
var isModalShowing = false;
var image;
var caption;

$('.search').on('click', function(event) {
  event.preventDefault();
  userQ = $('#user-input')
    .val()
    .trim();
  $.ajax({
    url: `https://api.edamam.com/search?q=${userQ}&app_id=76461587&app_key=${edamamKey}&from=0&to=5&calories=591-722&Diet=${risk_factor}&Health=${diet_recommendation}`,
    method: 'GET',
  }).done(function(response) {
    responseObject = response;

    for (var i = 0; i < response.hits.length; i++) {
      function makeButton(i, label) {
        button = $('<button>');
        button.attr({
          name: response.hits[i].recipe.label,
          src: response.hits[i].recipe.image,
          value: response.hits[i].recipe.url,
          uri: response.hits[i].recipe.uri,
          class: 'btn btn-sm ' + label,
          'data-toggle': 'modal',
          'data-target': '#login-modal',
          role: 'button',
        });
        button.text(label.toUpperCase());
        if (i < 1) {
          itemActive.append(button);
        } else {
          itemDiv.append(button);
        }
      }

      var itemActive = $('#item-active');
      var itemDiv = $("<div class='col-md-4 recipe'>").attr({
        class: 'item',
        'data-id': i,
      });

      image = $('<img>').attr({
        id: response.hits[i].recipe.uri,
        src: response.hits[i].recipe.image,
        'data-id': i,
        class: 'img-responsive',
      });

      caption = $(`<a>`);
      caption.attr({
        href: response.hits[i].recipe.url,
        target: '_blank',
        role: 'button',
        class: 'plotly-anchor',
        position: 'absolute',
      });
      caption.text(response.hits[i].recipe.label);
      caption.css('color', 'black');

      if (i < 1) {
        itemActive.append(caption, image);
        makeButton(i, 'save');
        makeButton(i, 'fave');
        continue;
      }

      itemDiv.append(caption, image);
      makeButton(i, 'save');
      makeButton(i, 'fave');

      $('#item-list').append(itemDiv);
      $('.carousel').carousel('pause');
      $('.recipe-area').show();
      id = 1;
      responseObject = response;
      createPlots(responseObject, i);
    }

    $('.save').on('click', function(event) {
      name = event.currentTarget.name;
      src = event.currentTarget.getAttribute('src');
      recipe = event.currentTarget.getAttribute('value');
      uri = event.currentTarget.getAttribute('uri');
      var id = this_id;
      var confirmSave = '<h2>' + 'Your reciped has been saved!' + '</h2>';
      $('.modal-body').append(confirmSave);
      $.ajax({
        url: '/profile/save',
        method: 'POST',
        data: {
          id: id,
          recipe_name: name,
          recipe_img: src,
          recipe,
          recipe_uri: uri,
        },
      });
    });

    $('.fave').on('click', function(event) {
      name = event.currentTarget.id;
      src = event.currentTarget.getAttribute('src');
      recipe = event.currentTarget.getAttribute('value');
      uri = event.currentTarget.getAttribute('uri');
      var id = this_id;
      var confirmFavorite =
        '<h2>' + 'This is now your favorite recipe!' + '</h2>';
      $('.modal-body').append(confirmFavorite);
      $.ajax({
        url: '/profile/fave',
        method: 'PUT',
        data: {
          favorite: true,
          id,
          recipe,
        },
      });
    });
  });
});

$('.change-favorite').on('click', function(event) {
  recipe = event.currentTarget.getAttribute('value');
  var id = this_id;
  var confirmNewFavorite =
    '<h2>' + 'This is now your favorite recipe!' + '</h2>';
  $('.modal-body').append(confirmNewFavorite);
  $.ajax({
    url: '/profile/fave',
    method: 'PUT',
    data: {
      favorite: true,
      id,
      recipe,
    },
  });
});

$('.delete-recipe').on('click', function(event) {
  event.preventDefault();
  uri = event.currentTarget.getAttribute('value');
  var id = this_id;
  var confirmDelete = '<h2>' + 'This recipe has been deleted' + '</h2>';
  $('.modal-body').append(confirmDelete);
  $.ajax({
    url: '/profile/delete',
    method: 'DELETE',
    data: {
      id,
      uri,
    },
  });
});

// Sets a listener for closing the modal and resetting parameters
$('.close').on('click', function() {
  $('.header-content').empty();
  $('.modal-body').empty();
  $('.footer-content').empty();
  myModal.attr('class', 'modal fade out');
  myModal.attr('style', 'display: none');
  isModalShowing = false;
  // Reload the page to get the updated list
  window.location.reload(false);
});

$('.right').on('click', function() {
  nextSlide++;
  if (nextSlide > 4) {
    nextSlide = 0;
    createPlots(responseObject, nextSlide);
  }
  createPlots(responseObject, nextSlide);
});

$('.left').on('click', function() {
  nextSlide--;
  if (nextSlide < 0) {
    nextSlide = 4;
    createPlots(responseObject, nextSlide);
  }
  createPlots(responseObject, nextSlide);
});

$('.plot-btn').on('click', function() {
  const { id } = this;
  const newPlot = $(`#${id}-container`);
  currentPlot.hide();
  currentPlot = newPlot;
  currentPlot.show();
});

function createPlots(response, i) {
  var digest = response.hits[i].recipe.digest;
  var yield = response.hits[i].recipe.yield;

  var servingArray = [];
  var firstPlot = {
    values: [],
    labels: [],
  };
  var secondPlot = {
    values: [],
    labels: [],
  };
  var thirdPlot = {
    values: [],
    labels: [],
  };
  var fourthPlot = {
    values: [],
    labels: [],
  };

  var ultimateColors = [
    ['#2E5894', '#8FD400', '#9C2542'],
    ['#0095B7', '#2D383A', '#1AB385', '#A50B5E'],
    [
      '#ABAD48',
      '#469496',
      '#436CB9',
      '#469A84',
      '#353839',
      '#2D5DA1',
      '#64609A',
    ],
    [
      '#E97451',
      '#FC80A5',
      '#C62D42',
      '#C9A0DC',
      '#76D7EA',
      '#FF8833',
      '#29AB87',
      '#AF593E',
      '#01786F',
      '#FFCBA4',
      '#FCD667',
      '#ED0A3F',
      '#FBE870',
    ],
  ];

  digest.forEach((nutrient, i) => {
    if (
      nutrient.label === 'Fat' ||
      nutrient.label === 'Carbs' ||
      nutrient.label === 'Protein'
    ) {
      firstPlot.values.push(nutrient.total / yield);
      firstPlot.labels.push(nutrient.label);

      if (nutrient.label === 'Fat') {
        nutrient.sub.forEach(fat => {
          secondPlot.values.push(fat.total / yield);
          secondPlot.labels.push(fat.label);
        });
      }
    }

    // else if (nutrient.label != "Cholesterol" & nutrient.label != "Folate equivalent (total)" & nutrient.label != "Folate (food)") {
    //     console.log(nutrient);
    //     console.log(digest.slice(1, 5));
    //     thirdPlot.values.push(nutrient.daily / yield);
    //     thirdPlot.labels.push(nutrient.label);

    // }
    else if ((i > 3) & (i < 11)) {
      thirdPlot.values.push(nutrient.total / yield);
      thirdPlot.labels.push(nutrient.label);
    } else if ((i > 10) & (i < 24)) {
      fourthPlot.values.push(nutrient.total / yield);
      fourthPlot.labels.push(nutrient.label);
    }
  });

  // process nutrition data
  var totalNutrients = response.hits[1].recipe.digest;

  // calculate totalNutrient per serving for our recipe
  for (var key in totalNutrients) {
    if (totalNutrients.hasOwnProperty(key)) {
      var val = totalNutrients[key];
      var perServing = val.quantity / 8;
    }
  }
  // populate the website with beautiful plots
  var dataOne = [
    {
      values: firstPlot.values,
      labels: firstPlot.labels,
      name: 'Macronutrients',
      hoverinfo: 'label+percent+name',
      hole: 0.6,
      type: 'pie',
      marker: {
        colors: ultimateColors[0],
      },
    },
  ];

  var dataTwo = [
    {
      values: secondPlot.values,
      labels: secondPlot.labels,
      text: 'Fats',
      textposition: 'inside',
      name: 'Lipids',
      hoverinfo: 'label+percent+name',
      hole: 0.6,
      type: 'pie',
      marker: {
        colors: ultimateColors[1],
      },
    },
  ];

  var dataThree = [
    {
      values: thirdPlot.values,
      labels: thirdPlot.labels,
      name: 'Minerals',
      textposition: 'inside',
      hoverinfo: 'label+percent+name',
      hole: 0.6,
      type: 'pie',
    },
  ];

  var dataFour = [
    {
      values: fourthPlot.values,
      labels: fourthPlot.labels,
      text: 'Vitamins',
      textposition: 'inside',
      name: 'Vitamins',
      hoverinfo: 'label+percent+name',
      hole: 0.6,
      type: 'pie',
    },
  ];

  var layoutOne = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    annotations: [
      {
        font: { size: 18, color: '#749541' },
        showarrow: false,
        text: 'Macros',
        x: 0.5,
        y: 0.5,
      },
    ],
    showlegend: false,
    width: 375,
    height: 400,
  };

  var layoutTwo = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    annotations: [
      {
        font: { size: 18, color: '#749541' },
        showarrow: false,
        text: 'Fats',
        x: 0.5,
        y: 0.5,
      },
    ],
    showlegend: false,
    width: 375,
    height: 400,
  };

  var layoutThree = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    annotations: [
      {
        font: { size: 18, color: '#749541' },
        showarrow: false,
        text: 'Minerals',

        x: 0.5,
        y: 0.5,
      },
    ],
    showlegend: false,
    width: 375,
    height: 400,
  };

  var layoutFour = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    annotations: [
      {
        font: { size: 18, color: '#749541' },
        showarrow: false,
        text: 'Vitamins',
        x: 0.5,
        y: 0.5,
      },
    ],
    showlegend: false,
    width: 375,
    height: 400,
  };

  Plotly.newPlot('macros-container', dataOne, layoutOne);
  Plotly.newPlot('fats-container', dataTwo, layoutTwo);
  Plotly.newPlot('minerals-container', dataThree, layoutThree);
  Plotly.newPlot('vitamins-container', dataFour, layoutFour);
}
