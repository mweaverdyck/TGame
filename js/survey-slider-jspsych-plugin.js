
jsPsych.plugins['survey-slider'] = (function() {

    var plugin = {};

    plugin.trial = function(display_element, trial) {
        // set default values for parameters
        trial.question = trial.question || '';
        trial.progressbar_text = trial.progressbar_text || '';

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        // add elements
        display_element.append($('<p>', {
            text: trial.question
        }));

        //   slider
        var sliderDiv = $('<div>', {
            id: 'sliderdiv',
            class: "slider-div"
        });
        sliderDiv.append('<span class="left-num"><b>$0</b></span>');
        sliderDiv.append($('<div>', {
                class: "slider-inner-div"
            })
            .append($('<input>', {
                id: "slide",
                'data-slider-id': "slider",
                type: "text",
                'data-slider-min': 0,
                'data-slider-max': trial.money,
                'data-slider-step': 0.01,
                'data-slider-value': 0
        })));
        sliderDiv.append('<span class="right-num"><b>$' + trial.money + '</b></span>');
        display_element.append(sliderDiv);

        var script   = document.createElement('script');
        script.type  = 'text/javascript';
        script.text  = '$("#slide").slider();';
        display_element.append(script);

        display_element.append($('<button>', {
            id: 'submit',
            class: "autocompare btn btn-primary",
            text: 'Submit'
        }));

        var startTime = Date.now();
        var trial_data = {};

        $('#submit').click(function() {
            // record time
            var response_time = Date.now() - startTime;
            trial_data = {
                rt: response_time
            };
            display_element.html('');
            jsPsych.finishTrial(trial_data);
        });
    };

    return plugin;

})();
