
jsPsych.plugins['survey-slider'] = (function() {

    var plugin = {};

    plugin.trial = function(display_element, trial) {
        // set default values for parameters
        trial.question = trial.question || '';
        trial.min_text = trial.min_text || '';
        trial.max_text = trial.max_text || '';
        trial.continue_text = trial.continue_text || false;
        trial.continue_back_text = trial.continue_back_text || false;

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        // add elements
        display_element.append($('<p>', {
            text: trial.question
        }));
        if (trial.continue_text) {
            display_element.append(INSTR_CONTINUE);
        } else if (trial.continue_back_text) {
            display_element.append(INSTR_CONTINUE_OR_BACK);
        }

        //   slider
        var sliderDiv = $('<div>', {
            id: 'sliderdiv',
            class: "slider-div middle"
        });
        sliderDiv.append('<span class="left-num"><b>' + trial.min_text + '</b></span>');
        sliderDiv.append($('<div>', {
                class: "slider-inner-div"
            })
            .append($('<input>', {
                id: "slide",
                'data-slider-id': "slider",
                type: "text",
                'data-slider-min': 0,
                'data-slider-max': 100,
                'data-slider-step': 1,
                'data-slider-value': 0
        })));
        sliderDiv.append('<span class="right-num"><b>' + trial.max_text + '</b></span>');
        display_element.append(sliderDiv);

        var script   = document.createElement('script');
        script.type  = 'text/javascript';
        script.text  = '$("#slide").slider({ formatter: function(value) { return value + "%"; } });';
        display_element.append(script);

        display_element.append($('<button>', {
            id: 'submit',
            class: "autocompare btn btn-primary disabled submit-btn",
            text: 'Submit'
        }));

        var startTime = Date.now();
        var trial_data = {};

        $('#submit').click(function() {
            if (!$('#slider-tooltip').hasClass("in")) {
                // return if haven't responded
                return;
            }

            var response_time = Date.now() - startTime;
            var response = $("#slide").slider('getValue');
            trial_data = {
                rt: response_time,
                response: response
            };
            display_element.html('');
            jsPsych.finishTrial(trial_data);
        });
    };

    return plugin;

})();
