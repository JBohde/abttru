const patientId = $('#patient-id').data().value;
let currentPlot = $('#macros-container');
const edamamKey = 'b829a690de0595f2fa5b7cb02db4cd99';
const edamamId = '76461587';
let responseObject;
let nextSlide = 0;
let itemDiv;

$('.patient-search').on('click', event => {
  event.preventDefault();
  const userQ = $('#user-input').val().trim();
  const { dataset: { risk, recommendation } } = event.target;

  $.ajax({
    url: `https://api.edamam.com/search?q=${userQ}&app_id=${edamamId}&app_key=${edamamKey}&from=0&to=5&calories=591-722&Diet=${risk}&Health=${recommendation}`,
    method: 'GET',
  }).done(response => {
    responseObject = response;

    function makeButton(recipe, label) {
      const button = $('<button role="button">');
      button.attr({
        class: `btn btn-sm ${label}`,
        'data-toggle': 'modal',
        'data-target': '#login-modal',
        'data-recipeName': recipe.label,
        'data-recipeImg': recipe.image,
        'data-recipe': recipe.url,
        'data-recipeUri': recipe.uri,
        role: 'button',
      });
      button.text(label.toUpperCase());
      return button;
    }

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < response.hits.length; i++) {
      const { recipe } = response.hits[i];

      itemDiv = $("<div'>").attr({
        class: 'item',
        'data-id': i,
      });

      const image = $('<img>').attr({
        id: recipe.uri,
        src: recipe.image,
        'data-id': i,
        class: 'img-responsive',
      });

      const caption = $('<a>');
      caption.attr({
        href: recipe.url,
        target: '_blank',
        role: 'button',
        class: 'plotly-anchor',
        position: 'absolute',
      });
      caption.text(recipe.label);
      caption.css('color', 'black');

      const saveButton = makeButton(recipe, 'save');
      const faveButton = makeButton(recipe, 'fave');

      itemDiv.append(caption, image, saveButton, faveButton);
      $('#sliders').addClass('carousel slide');
      $('.carousel-inner').append(itemDiv);
      $('.item').first().addClass('active');
      $('.carousel').carousel('pause');
      $('.recipe-area').show();
      responseObject = response;
      // eslint-disable-next-line no-use-before-define
      createPlots(responseObject, i);
    }

    $('.save').on('click', e => {
      const {
        dataset: {
          recipename,
          recipeimg,
          recipe,
          recipeuri
        },
      } = e.currentTarget;

      const id = patientId;
      const saveConfirmation = `<h2>${'Your reciped has been saved!'}</h2>`;
      $('.modal-body').append(saveConfirmation);
      $.ajax({
        url: '/profile/save',
        method: 'POST',
        data: {
          patientId: id,
          recipeName: recipename,
          recipeImg: recipeimg,
          recipe,
          recipeUri: recipeuri,
        },
      });
    });

    $('.fave').on('click', e => {
      const {
        dataset: {
          recipename,
          recipeimg,
          recipe,
          recipeuri
        },
      } = e.currentTarget;
      const id = patientId;

      const favoriteConfirmation = `<h2>${'This is now your favorite recipe!'}</h2>`;
      $('.modal-body').append(favoriteConfirmation);
      $.ajax({
        url: '/profile/fave',
        method: 'PUT',
        data: {
          favorite: true,
          patientId: id,
          recipeName: recipename,
          recipeImg: recipeimg,
          recipe,
          recipeUri: recipeuri,
        },
      });
    });
  });
});

$('.change-favorite').on('click', event => {
  const recipe = event.currentTarget.getAttribute('value');
  const id = patientId;
  const newFavoriteConfirmation = `<h2>${'This is now your favorite recipe!'}</h2>`;

  $('.modal-body').append(newFavoriteConfirmation);
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

$('.delete-recipe').on('click', e => {
  e.preventDefault();
  const { id } = e.currentTarget;
  const confirmDelete = `<h2>${'This recipe has been deleted'}</h2>`;
  $('.modal-body').append(confirmDelete);
  $.ajax({
    url: '/profile/delete',
    method: 'DELETE',
    data: { id },
  });
});

// Sets a listener for closing the modal and resetting parameters
$('.close').on('click', () => {
  const modal = $('#login-modal');
  $('.header-content').empty();
  $('.modal-body').empty();
  $('.footer-content').empty();
  modal.attr('class', 'modal fade out');
  modal.attr('style', 'display: none');
  window.location.reload(false);
});

function createPlots(response, index) {
  const plotDigest = response.hits[index].recipe.digest;
  const plotYield = response.hits[index].recipe.yield;

  const firstPlot = {
    values: [],
    labels: [],
  };
  const secondPlot = {
    values: [],
    labels: [],
  };
  const thirdPlot = {
    values: [],
    labels: [],
  };
  const fourthPlot = {
    values: [],
    labels: [],
  };

  const ultimateColors = [
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

  plotDigest.forEach((nutrient, i) => {
    if (
      nutrient.label === 'Fat'
      || nutrient.label === 'Carbs'
      || nutrient.label === 'Protein'
    ) {
      firstPlot.values.push(nutrient.total / plotYield);
      firstPlot.labels.push(nutrient.label);

      if (nutrient.label === 'Fat') {
        nutrient.sub.forEach(fat => {
          secondPlot.values.push(fat.total / plotYield);
          secondPlot.labels.push(fat.label);
        });
      }
    } else if ((i > 3) && (i < 11)) {
      thirdPlot.values.push(nutrient.total / plotYield);
      thirdPlot.labels.push(nutrient.label);
    } else if ((i > 10) && (i < 24)) {
      fourthPlot.values.push(nutrient.total / plotYield);
      fourthPlot.labels.push(nutrient.label);
    }
  });

  // // process nutrition data
  // const totalNutrients = response.hits[1].recipe.plotDigest;

  // // calculate totalNutrient per serving for our recipe
  // for (const key in totalNutrients) {
  //   if (totalNutrients.hasOwnProperty(key)) {
  //     const val = totalNutrients[key];
  //     const perServing = val.quantity / 8;
  //   }
  // }

  // populate the website with beautiful plots
  const dataOne = [
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

  const dataTwo = [
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

  const dataThree = [
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

  const dataFour = [
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

  const layoutOne = {
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
    width: 350,
    height: 400,
  };

  const layoutTwo = {
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
    width: 350,
    height: 400,
  };

  const layoutThree = {
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
    width: 350,
    height: 400,
  };

  const layoutFour = {
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
    width: 350,
    height: 400,
  };

  Plotly.newPlot('macros-container', dataOne, layoutOne);
  Plotly.newPlot('fats-container', dataTwo, layoutTwo);
  Plotly.newPlot('minerals-container', dataThree, layoutThree);
  Plotly.newPlot('vitamins-container', dataFour, layoutFour);
}

$('.plot-btn').on('click', e => {
  const { currentTarget: { id } } = e;
  const newPlot = $(`#${id}-container`);
  currentPlot.hide();
  currentPlot = newPlot;
  currentPlot.show();
});

$('.right').on('click', () => {
  // eslint-disable-next-line no-plusplus
  nextSlide++;
  if (nextSlide > 4) {
    nextSlide = 0;
    createPlots(responseObject, nextSlide);
  }
  createPlots(responseObject, nextSlide);
});

$('.left').on('click', () => {
  // eslint-disable-next-line no-plusplus
  nextSlide--;
  if (nextSlide < 0) {
    nextSlide = 4;
    createPlots(responseObject, nextSlide);
  }
  createPlots(responseObject, nextSlide);
});
