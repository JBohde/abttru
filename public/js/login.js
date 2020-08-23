$(document).ready(() => {
  $('#login').val($('#login option:first').val());
  $('#user-input').val('');
  let userQ;

  function createSlider(response) {
    $.each(response.hits, (i, hit) => {
      const { recipe } = hit;
      const itemDiv = $('<div>')
        .attr({
          class: 'carousel-item',
          'data-id': i,
        });

      const image = $('<img>')
        .attr({
          id: recipe.uri,
          class: 'img-fluid recipe-img',
          src: recipe.image,
          alt: recipe.label,
          'data-id': i,
        });

      const caption = $('<a>')
        .attr({
          href: recipe.url,
          target: '_blank',
          role: 'button',
          class: 'plotly-anchor',
          position: 'absolute',
        })
        .text(recipe.label);

      itemDiv.append(caption, image);
      $('.carousel-item').first().addClass('active');
      $('.carousel-inner').append(itemDiv);
      $('.carousel').carousel('pause');
      $('.recipe-area').css('visibility', 'visible');
    });
  }

  $('.search').on('click', event => {
    $('.doctor-form').hide();
    $('.please-login').hide();
    event.preventDefault();
    userQ = $('#user-input').val().trim();
    // risk_factor = $("#risk-factor").val().toLowerCase().trim();
    const dietFactor = $('#diet-factor').val().toLowerCase().trim();
    const dietRestriction = $('#diet-restriction').val().toLowerCase().trim();
    $.ajax({
      url: `https://api.edamam.com/search?q=${userQ}&app_id=76461587&app_key=b829a690de0595f2fa5b7cb02db4cd99&from=0&to=5&diet=${dietFactor}&health=${dietRestriction}`,
      method: 'GET',
    }).done(response => {
      $('.carousel-inner').empty();
      createSlider(response);
    });
  });

  $('.login').on('change', () => {
    const loginSelector = $('#login').val().toLowerCase().trim();
    if (loginSelector === 'patient') {
      $('.patient-form').show();
      $('.doctor-form').hide();
    } else if (loginSelector === 'dietitian') {
      $('.patient-form').hide();
      $('.doctor-form').show();
    }
  });
});
