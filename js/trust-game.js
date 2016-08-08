$(function() {

    var timeline = [];
    var firebaseUid, userId;

    $("#slider-input").slider({ formatter: function(value) { return "Give $" + value; } });
    
    // Prevent closing window
    window.onbeforeunload = function() {
        if (hookWindow) {
            return CLOSE_WINDOW_ALERT;
        }
    }

    // TRIALS
    var trial = {
        type: 'trust-game',
        left_img: "img/p0.png",
        right_img: "img/p1.jpg",
        right_caption: "Player 2",
        money: 10
    };

    // EXPERIMENT TIMELINE
    //   Instructions
    for (var i in beginningInstructions) {
        timeline.push(beginningInstructions[i]);
    }
    //   Trials
    timeline.push(waitScreen);
    timeline.push(trial);

    function startExperiment() {
        // hookWindow = true;
        // Start the experiment
        jsPsych.init({
            display_element: $('#jspsych-target'),
            timeline: timeline
        });
    }

    // Load images and then start experiment
    jsPsych.pluginAPI.preloadImages(playerImgs, startExperiment);
});
