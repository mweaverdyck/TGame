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
    var trainingTrial = {
        type: 'trust-game',
        center_img: "img/default.png",
        center_caption: "Player 2",
        money: 10
    };

    var trial = {
        type: 'trust-game',
        center_img: "img/p1.jpg",
        center_caption: "Player 2",
        money: 10,
        wait_time_min: 1500,
        wait_time_max: 2500,
        recip_dist_mean: 0.5,
        recip_dist_var: 0.05
    };


    // EXPERIMENT TIMELINE
    //   Instructions
    for (var i in beginningInstructions) {
        timeline.push(beginningInstructions[i]);
    }
    //   Training Trials
    timeline.push(trainingTrial);
    timeline.push(trainingTrial);
    timeline.push(trainingTrial);
    timeline.push(trainingTrial);
    timeline.push(trainingTrial);
    timeline.push(trainingTrial);
    //   More Instructions
    for (var i in middleInstructions) {
        timeline.push(middleInstructions[i]);
    }
    //   Actual Trials
    timeline.push(waitScreen);
    timeline.push(trial);
    timeline.push(trial);
    timeline.push(trial);
    timeline.push(trial);
    timeline.push(trial);
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
