
jsPsych.plugins['ready'] = (function() {

    var plugin = {};

    plugin.trial = function(display_element, trial) {
        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        // add elements
        display_element.append('<p>Please answer a few demographic questions below:</p>');

        display_element.append($('<button>', {
            id: 'next',
            class: "autocompare btn btn-primary",
            text: 'Next'
        }));

        var startTime = Date.now();
        var trial_data = {};

        $('#next').click(function() {
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
