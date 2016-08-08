
jsPsych.plugins['timed-instr'] = (function() {

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
            text: trial.text
        }));

        display_element.append($('<div>', {
            id: 'progress-bar',
            class: "progress-bar progress-bar-info progress-bar-striped active bar-div middle",
            role: 'progressbar',
            "aria-valuenow": 100,
            style: 'font-size: 16px;',
            text: trial.progressbar_text
        }));

        var startTime = Date.now();
        var trial_data = {};

        setTimeout(function() {
            display_element.html('');
            jsPsych.finishTrial(trial_data);
        },
        random_int(trial.time_min, trial.time_max));

    };

    return plugin;

})();
