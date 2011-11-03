jQuery(document).ready(function($) {
	var beforeChangeAction = function () {
        $("a[id^='lnk']").each(function() {
            $("#" + this.id).die('click');
        });

    };

    var afterChangeAction = function () {
        $("a[id^='lnk']").each(function() {
            var id = this.id;
            $("#" + id).live('click', function (e) {				
                bindModalConfirmationDialogFor(id, redirectAction);
                openConfirmationDialog(e, "Any changes made will be lost. Are you sure you want to continue?");
            });
        });
    };

	$("#editForm").trackchanges({events: "change blur keyup mousedown", exclude: "exclude", beforeChangeAction: beforeChangeAction, afterChangeAction: afterChangeAction});  
});

function bindModalConfirmationDialogFor(fld, action) {
    var dialogOpts = {
        modal: true,
        autoOpen: false,
        buttons: {
            'No': function() {
                $(this).dialog('close');
            },
            'Yes': function() {
                action(fld);
                $(this).dialog('close');
            }
        }
    };
    $("#dialog-confirm").dialog(dialogOpts);
}

function openConfirmationDialog(e, message) {
    e.preventDefault();
    $("#dialog-confirm").html("<p><span class='ui-icon ui-icon-alert' style='float:left; margin: 0 7px 20px 0;'></span>" + message + "</p>");
    $("#dialog-confirm").dialog("open");
}

function redirectAction(fld) {	
    window.location.href = $("#"+fld).attr("href");
}