
jsPsych.plugins['ready'] = (function() {

    var plugin = {};

    plugin.trial = function(display_element, trial) {
        // set default values for parameters
        trial.text = trial.text || '';
        trial.time_min = trial.time_min || 1000;
        trial.time_max = trial.time_max || 2000;
        trial.progressbar_text = trial.progressbar_text || '';

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        // add elements
        display_element.append($('<p>', {
            class: "fixed-position-mid",
            text: 'Click below when you are ready to begin.'
        }));

        display_element.append($('<button>', {
            id: 'ready',
            class: "autocompare btn btn-primary fixed-position-mid-below",
            text: 'I\'m Ready!'
        }));

        var startTime = Date.now();
        var trial_data = {};

        $('#ready').click(function() {
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
