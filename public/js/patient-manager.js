$(document).ready(function () {

    $(".delete-patient").on('click', function (event) {
        event.preventDefault();
        var target = $(event.target);
        $.ajax("/api/patient/" + target.attr("data-patient-id"), {
            type: "DELETE",
            data: {
                id: target.attr("data-patient-id")
            }
        }).then(function () {
            location.reload();
        });
    });
});