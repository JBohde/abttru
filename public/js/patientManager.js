$(document).ready(() => {
  $('.delete-patient').on('click', event => {
    event.preventDefault();
    const target = $(event.target);
    $.ajax(`/api/patient/${target.attr('data-patient-id')}`, {
      type: 'DELETE',
      data: {
        id: target.attr('data-patient-id'),
      },
    }).then(() => {
      window.location.reload();
    });
  });
});
