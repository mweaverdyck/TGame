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
    var trainingTrials = [{
        type: 'trust-game',
        center_img: "img/practice_img/usericon4.png",
        center_caption: "Player 1",
        money: MAX_MONEY,
        recip_dist_mean: 0.4,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: "img/practice_img/usericon3.png",
        center_caption: "Player 2",
        money: MAX_MONEY,
        friends_imgs: ['img/practice_img/usericon4.png', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: "img/practice_img/usericon5.png",
        center_caption: "Player 3",
        money: MAX_MONEY,
        recip_dist_mean: 0.00001,
        friends_imgs: ['img/practice_img/usericon3.png', 'img/practice_img/usericon4.png', 'unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: "img/practice_img/usericon2.png",
        center_caption: "Player 3",
        money: MAX_MONEY,
        recip_dist_mean: 0.3,
        friends_imgs: ['img/practice_img/usericon5.png', 'img/practice_img/usericon3.png',
                       'img/practice_img/usericon4.png', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: "img/practice_img/usericon6.png",
        center_caption: "Player 3",
        money: MAX_MONEY,
        friends_imgs: ['img/practice_img/usericon4.png', 'img/practice_img/usericon2.png',
                       'img/practice_img/usericon3.png', 'img/practice_img/usericon5.png', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: "img/practice_img/usericon1.png",
        center_caption: "Player 3",
        money: MAX_MONEY,
        recip_dist_mean: 0.63,
        friends_imgs: ['img/practice_img/usericon3.png', 'img/practice_img/usericon2.png',
                       'img/practice_img/usericon4.png', 'img/practice_img/usericon5.png', 'img/practice_img/usericon6.png']
    }];

    // BLOCK 1 TRIALS
    var block1Trials = [{    // trustworthy
        type: 'trust-game',
        center_img: "img/p1.jpg",
        center_caption: "TrustMe#1",
        money: MAX_MONEY,
        wait_time_min: 1500,
        wait_time_max: 2500,
        recip_dist_mean: 0.5,
        recip_dist_var: 0.05,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // trustworthy
        type: 'trust-game',
        center_img: "img/p1.jpg",
        center_caption: "TrustMe#2",
        money: MAX_MONEY,
        wait_time_min: 1500,
        wait_time_max: 2500,
        recip_dist_mean: 0.5,
        recip_dist_var: 0.05,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // untrustworthy
        type: 'trust-game',
        center_img: "img/p1.jpg",
        center_caption: "Dont'tTrustMe#1",
        money: MAX_MONEY,
        wait_time_min: 1500,
        wait_time_max: 2500,
        recip_dist_mean: 0.05,
        recip_dist_var: 0.05,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // untrustworthy
        type: 'trust-game',
        center_img: "img/p1.jpg",
        center_caption: "Dont'tTrustMe#2",
        money: MAX_MONEY,
        wait_time_min: 1500,
        wait_time_max: 2500,
        recip_dist_mean: 0.05,
        recip_dist_var: 0.05,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    }];

    // BLOCK 2 TRIALS
    var block2Trials = [];

    // HELPER FUNC
    function add_trials_randomly(trials, num_per_trial) {
        var trialsArray = [];
        for (var i = 0; i < trials.length; ++i) {
            for (var j = 0; j < num_per_trial; ++j) {
                trialsArray.push(trials[i]);
            }
        }
        trialsArray = shuffle_array(trialsArray);
        for (var i = 0; i < trialsArray.length; ++i) {
            timeline.push({
                type: 'timed-instr',
                text: 'Syncing',
                time_min: 0,
                time_max: 1000
            });
            timeline.push(trialsArray[i]);
        }
    }

    // EXPERIMENT TIMELINE
    //   Instructions
    // timeline = timeline.concat(beginningInstructions);
    //   Training Trials
    // timeline = timeline.concat(trainingTrials);
    //   More Instructions for block 1
    // timeline = timeline.concat(block1Instructions);
    //   Block 1 Trials
    // timeline.push(waitScreen);
    // add_trials_randomly(block1Trials, BLOCK_1_NUM_TRIALS_PER_PLAYER);
    //   More Instructions for block 2
    timeline = timeline.concat(block2Instructions);
    //   Block 2 Trials
    timeline.push(waitScreen);
    //   More Instructions for block 3
    timeline = timeline.concat(block3Instructions);

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
