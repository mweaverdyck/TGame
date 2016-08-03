$(function() {

    var allTimeline = [];
    var firebaseUid, userId;

    
    // Prevent closing window
    window.onbeforeunload = function() {
        if (hookWindow) {
            return CLOSE_WINDOW_ALERT;
        }
    }

    // EXPERIMENT TIMELINE
    //   Instructions
    for (var i in beginningInstructions) {
        allTimeline.push(beginningInstructions[i]);
    }

    function startExperiment() {
        // hookWindow = true;
        // Start the experiment
        jsPsych.init({
            display_element: $('#jspsych-target'),
            timeline: allTimeline
        });
    }

    startExperiment();

    // Load images and then start experiment
    // jsPsych.pluginAPI.preloadImages(imgs, startExperiment);
});
