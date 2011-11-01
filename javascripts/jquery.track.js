$.fn.trackChanges = function(opts, beforeAction, afterAction) {
    opts = jQuery.extend({
        events: "change",
        exclude: null
    }, opts);

    var changedElementsCount = 0;
    var __changedElements = {
        set: function(k, v) {
            this[k] = v;
            if (v == undefined) {
                changedElementsCount = changedElementsCount - 1;
            }
            else {
                changedElementsCount = changedElementsCount + 1;
            }
        },
        get: function(k) {
            return this[k];
        }
    };

    var __defaultState = {
        set: function(k, v) {
            this[k] = v;
        },
        get: function(k) {
            return this[k];
        }
    };

    this.each(function() {
        var form = $(this)[0];
        if ($(this).length > 0 && form.className == "exclude") {
            return;
        }
        var elements = form.elements;
        for (var i = 0; i < elements.length; i++) {
            var element = $(this)[0].elements[i];
            if ($(element).hasClass(opts.exclude)) {
                continue;
            }
            if ($(element).is("input[type='radio']")) {
                if (element.checked) {
                    __defaultState.set(element.id, element.value);
                }
            }
            else if ($(element).is("input[type='checkbox']")) {
                var checked = element.checked ? true : false;
                __defaultState.set(element.id + "_" + element.value, checked)
            }
            else if ($(element).is("input[type='text']") || $(element).is("textarea") || $(element).is("select")) {
                __defaultState.set(element.id, element.value);
            }
            attachAddToChangedElementsListEvent(element, opts.events, beforeAction, afterAction);
        }
    });

    function attachAddToChangedElementsListEvent(element, events, beforeAction, afterAction) {
        $(element).bind(events, function() {
            addToChangedElementsList(this, beforeAction, afterAction);
        });
    }

    function addElementIfNotPresent(id, value, action) {
        if (__changedElements.get(id) === undefined) {
            __changedElements.set(id, value);
        }
        if (changedElementsCount == 1) {
            action();
        }
    }

    function removeElementsIfPresent(id, action) {
        if (__changedElements.get(id) !== undefined) {
            __changedElements.set(id, undefined);
        }
        if (changedElementsCount == 0) {
            action();
        }
    }

    function addToChangedElementsList(element, beforeAction, afterAction) {
        var elementId;
        if ($(element).is("input[type='checkbox']")) {
            elementId = element.id + "_" + element.value;
            var checked = element.checked ? true : false;

            if (__defaultState.get(elementId) !== checked) {
                addElementIfNotPresent(elementId, checked, afterAction);
            }
            else {
                removeElementsIfPresent(elementId, beforeAction);
            }
        }
        else if ($(element).is("input[type='radio']")) {
            if (__defaultState.get(element.id) != element.checked) {
                addElementIfNotPresent(element.id, element.value, afterAction);
            }
            else {
                removeElementsIfPresent(element.id, beforeAction);
            }
        }        
        else if ($(element).is("input[type='text']") || $(element).is("textarea") || $(element).is("select")) {
            if (element.value != undefined && __defaultState.get(element.id) != element.value) {
                addElementIfNotPresent(element.id, element.value, afterAction);
            }
            else {
                removeElementsIfPresent(element.id, beforeAction);
            }
        }
    }
};