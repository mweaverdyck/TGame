
function on_ethnicity_change() {
    var selected = $('#ethnicity-select').val();
    if ((selected == 4 || selected == 5)) {
        if ($('#ethnicity-text').length != 0) {
            return;
        }
        $('#ethnicity-div').append($('<div>', {
            id: 'ethnicity-text',
            class: 'col-xs-4'
        }).append($('<input>', {
            type: 'text',
            class: 'form-control input-md',
            required: true
        })));
    } else {
        $('#ethnicity-text').remove();
    }
}

var next_page;

jsPsych.plugins['demography'] = (function() {

    var plugin = {};

    plugin.trial = function(display_element, trial) {
        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        // add elements
        display_element.append($('<div>', {
            class: 'survey',
            align: 'center'
        })
        .append($('<form>', {
            id: 'demo-form',
            action: 'javascript:next_page();',
            class: 'form-horizontal'
        })));

        $('#demo-form').append($('<legend>', {
            text: 'Please answer a few demographic questions below:'
        }));
        $('#demo-form').append($('<div>', {
            class: 'form-group'
        })
        .append($('<span>', {
            class: 'col-xs-3 control-label',
            text: 'Age'
        }))
        .append($('<div>', {
            class: 'col-xs-2'
        })
        .append($('<input>', {
            id: 'age',
            type: 'text',
            class: 'form-control input-md',
            required: true
        }))));

        $('#demo-form').append($('<div>', {
            class: 'form-group'
        })
        .append($('<span>', {
            class: 'col-xs-3 control-label',
            text: 'Gender'
        }))
        .append($('<div>', {
            class: 'col-xs-3 radio'
        })
        .append('<input name="gender" type="radio" value="m" required>Male'))
        .append($('<div>', {
            class: 'col-xs-3 radio'
        })
        .append('<input name="gender" type="radio" value="f" required>Female'))
        .append($('<div>', {
            class: 'col-xs-3 radio'
        })
        .append('<input name="gender" type="radio" value="o">Other')));

        $('#demo-form').append($('<div>', {
            id: 'ethnicity-div',
            class: 'form-group'
        })
        .append($('<span>', {
            class: 'col-xs-3 control-label',
            text: 'Ethnicity'
        }))
        .append($('<div>', {
            class: 'col-xs-5'
        })
        .append($('<select>', {
            id: 'ethnicity-select',
            onchange: 'on_ethnicity_change()',
            class: 'form-control',
            required: true
        })
        .append($('<option>', {
            value: '',
            text: 'Please select'
        }))
        .append($('<option>', {
            value: 1,
            text: '1'
        }))
        .append($('<option>', {
            value: 2,
            text: '2'
        }))
        .append($('<option>', {
            value: 3,
            text: '3'
        }))
        .append($('<option>', {
            value: 4,
            text: '4'
        }))
        .append($('<option>', {
            value: 5,
            text: 'Other'
        })))));

        $('#demo-form').append($('<button>', {
            id: 'next',
            type: 'submit',
            class: "autocompare btn btn-primary margin-top",
            text: 'Next'
        }));

        var startTime = Date.now();
        var trial_data = {};

        next_page = function() {
            // record time
            var response_time = Date.now() - startTime;
            trial_data = {
                age: $('#age').val(),
                gender: $("input[name='gender']:checked").val(),
                ethnicity: $('#ethnicity-select option:selected').val(),
                rt: response_time
            };
            if ($('#ethnicity-text').length != 0) {
                trial_data.ethnicity_spec = $('#ethnicity-text input').val();
            }
            display_element.html('');
            jsPsych.finishTrial(trial_data);
        }
    };

    return plugin;

})();
