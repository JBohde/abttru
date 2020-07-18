$(() => {
/* eslint-disable no-undef */
  const patientId = $('#patient-id').data().value;
  let currentPlot = $('#macros-container');
  const edamamKey = 'b829a690de0595f2fa5b7cb02db4cd99';
  const edamamId = '76461587';

  let responseObject;
  let nextSlide = 0;

  $('#user-input').val('');

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
        const button = $('<button>');
        button.attr({
          role: 'button',
          class: `btn ${label}`,
          'data-toggle': 'modal',
          'data-target': '#login-modal',
          'data-recipeName': recipe.label,
          'data-recipeImg': recipe.image,
          'data-recipe': recipe.url,
          'data-recipeUri': recipe.uri,
        });
        button.text(label.toUpperCase());
        return button;
      }

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < response.hits.length; i++) {
        const { recipe } = response.hits[i];

        const itemDiv = $('<div>').attr({
          class: 'carousel-item',
          'data-id': i,
        });

        const image = $('<img>').attr({
          id: recipe.uri,
          src: recipe.image,
          class: 'img-fluid recipe-img',
          alt: recipe.label,
          'data-id': i,
        });

        const caption = $('<a>');
        caption.attr({
          href: recipe.url,
          target: '_blank',
          role: 'button',
          class: 'plotly-anchor',
        });
        caption.text(recipe.label);

        const saveButton = makeButton(recipe, 'save');
        const faveButton = makeButton(recipe, 'fave');
        itemDiv.append(caption, image, saveButton, faveButton);
        $('.carousel-item').first().addClass('active');
        $('.carousel-inner').append(itemDiv);
        $('.carousel').carousel('pause');
        $('.recipe-area').show();
        responseObject = response;
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
});
