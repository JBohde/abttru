$(document).ready(() => {
  let userQ;

  function createSlider(response) {
    const itemActive = $('#item-active');

    const activeImg = $('<img>').attr({
      src: response.hits[0].recipe.image,
      'data-id': 0,
      class: 'img-responsive',
    });

    const activeCaption = $('<a>');
    activeCaption.attr({
      href: response.hits[0].recipe.url,
      target: '_blank',
      /*        "class": "btn btn-info", */
      role: 'button',
    });
    activeCaption.text(response.hits[0].recipe.label);
    activeCaption.css('color', 'black');

    itemActive.append(activeCaption);
    itemActive.append(activeImg);

    $('.carousel').carousel('pause');
    $('#panel-slider').show();

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < response.hits.length; i++) {
      const itemDiv = $('<div>').attr({
        class: 'item',
        'data-id': i,
      });

      const itemImg = $('<img>').attr({
        src: response.hits[i].recipe.image,
        id: `image${i}`,
        class: 'img-responsive',
      });

      const itemCaption = $('<a>');
      itemCaption.attr({
        href: response.hits[i].recipe.url,
        target: '_blank',
        role: 'button',
      });
      itemCaption.text(response.hits[i].recipe.label);
      itemCaption.css('color', 'black');

      itemDiv.append(itemCaption);
      itemDiv.append(itemImg);

      $('#item-list').append(itemDiv);
    }
  }

  $('.search').on('click', event => {
    $('.doctor-form').hide();
    $('.please-login').hide();
    event.preventDefault();
    userQ = $('#user-input')
      .val()
      .trim();
    // risk_factor = $("#risk-factor").val().toLowerCase().trim();
    const dietFactor = $('#diet-factor')
      .val()
      .toLowerCase()
      .trim();
    const dietRestriction = $('#diet-restriction')
      .val()
      .toLowerCase()
      .trim();
    $.ajax({
      url: `https://api.edamam.com/search?q=${userQ}&app_id=76461587&app_key=b829a690de0595f2fa5b7cb02db4cd99&from=0&to=5&diet=${dietFactor}&health=${dietRestriction}`,
      method: 'GET',
    }).done(response => {
      createSlider(response);
    });
  });

  $('.login').on('change', () => {
    const loginSelector = $('#login')
      .val()
      .toLowerCase()
      .trim();
    if (loginSelector === 'patient') {
      $('.patient-form').show();
      $('.doctor-form').hide();
    } else if (loginSelector === 'dietitian') {
      $('.patient-form').hide();
      $('.doctor-form').show();
    }
  });
});
