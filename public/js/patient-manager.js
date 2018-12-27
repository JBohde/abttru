$(document).ready(function () {

    $(".delete-patient").on('click', function (event) {
        event.preventDefault();
        // console.log(event.target);
        var target = $(event.target);
        // console.log(target.attr("data-patient-id"));
        // Send the POST request.
        $.ajax("/api/patient/" + target.attr("data-patient-id"), {
            type: "DELETE",
            data: {
                id: target.attr("data-patient-id")
            }
        }).then(function () {
            // Reload the page to get the updated list
            location.reload();
        });
    });
});