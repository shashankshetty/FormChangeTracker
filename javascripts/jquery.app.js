jQuery(document).ready(function($) {
	var beforeChangeAction = function () {
        $("#buttons").css("background-color", "#bcd3e9");
        if ($("#changed-text").length > 0) {
            $("#changed-text").remove();
        }
    };

    var afterChangeAction = function () {
        $("#buttons").css("background-color", "#fbec88");		
        if ($("#changed-text").length === 0) {
            $("#buttons").prepend("<span id='changed-text'>Changes not saved</span>");
        }
    };

	$("#editForm").trackchanges({events: "change blur keyup mousedown", exclude: "exclude", beforeChangeAction: beforeChangeAction, afterChangeAction: afterChangeAction});  
});