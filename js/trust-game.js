$(function() {

    var timeline = [];
    var firebaseUid, userId;

    playerImgs = shuffle_array(playerImgs);
    
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
        recip_dist_mean: 0.4,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: "img/practice_img/usericon3.png",
        center_caption: "Player 2",
        friends_imgs: ['img/practice_img/usericon4.png', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: "img/practice_img/usericon5.png",
        center_caption: "Player 3",
        recip_dist_mean: 0.00001,
        friends_imgs: ['img/practice_img/usericon3.png', 'img/practice_img/usericon4.png', 'unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: "img/practice_img/usericon2.png",
        center_caption: "Player 3",
        recip_dist_mean: 0.3,
        friends_imgs: ['img/practice_img/usericon5.png', 'img/practice_img/usericon3.png',
                       'img/practice_img/usericon4.png', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: "img/practice_img/usericon6.png",
        center_caption: "Player 3",
        friends_imgs: ['img/practice_img/usericon4.png', 'img/practice_img/usericon2.png',
                       'img/practice_img/usericon3.png', 'img/practice_img/usericon5.png', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: "img/practice_img/usericon1.png",
        center_caption: "Player 3",
        recip_dist_mean: 0.63,
        friends_imgs: ['img/practice_img/usericon3.png', 'img/practice_img/usericon2.png',
                       'img/practice_img/usericon4.png', 'img/practice_img/usericon5.png', 'img/practice_img/usericon6.png']
    }];

    // BLOCK 1 TRIALS
    var block1Trials = [{    // trustworthy
        type: 'trust-game',
        center_img: playerImgs[0],
        center_caption: "TrustMe#1",
        recip_dist_mean: TRUSTWORTHY_RECI_MEAN,
        recip_dist_var: TRUSTWORTHY_RECI_VAR,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // trustworthy
        type: 'trust-game',
        center_img: playerImgs[1],
        center_caption: "TrustMe#2",
        recip_dist_mean: TRUSTWORTHY_RECI_MEAN,
        recip_dist_var: TRUSTWORTHY_RECI_VAR,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // untrustworthy
        type: 'trust-game',
        center_img: playerImgs[2],
        center_caption: "Dont'tTrustMe#1",
        recip_dist_mean: UNTRUSTWORTHY_RECI_MEAN,
        recip_dist_var: UNTRUSTWORTHY_RECI_VAR,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // untrustworthy
        type: 'trust-game',
        center_img: playerImgs[3],
        center_caption: "Dont'tTrustMe#2",
        recip_dist_mean: UNTRUSTWORTHY_RECI_MEAN,
        recip_dist_var: UNTRUSTWORTHY_RECI_VAR,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    }];

    // BLOCK 2 TRIALS
    var block2Trials = [{    // trustworthy
        type: 'trust-game',
        center_img: playerImgs[4],
        center_caption: "TrustMe#3",
        recip_dist_mean: TRUSTWORTHY_RECI_MEAN,
        recip_dist_var: TRUSTWORTHY_RECI_VAR,
        friends_imgs: [playerImgs[0], 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // trustworthy
        type: 'trust-game',
        center_img: playerImgs[5],
        center_caption: "TrustMe#4",
        recip_dist_mean: TRUSTWORTHY_RECI_MEAN,
        recip_dist_var: TRUSTWORTHY_RECI_VAR,
        friends_imgs: [playerImgs[2], 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // trustworthy
        type: 'trust-game',
        center_img: playerImgs[6],
        center_caption: "TrustMe#5",
        recip_dist_mean: TRUSTWORTHY_RECI_MEAN,
        recip_dist_var: TRUSTWORTHY_RECI_VAR,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // untrustworthy
        type: 'trust-game',
        center_img: playerImgs[7],
        center_caption: "Dont'tTrustMe#3",
        recip_dist_mean: UNTRUSTWORTHY_RECI_MEAN,
        recip_dist_var: UNTRUSTWORTHY_RECI_VAR,
        friends_imgs: [playerImgs[1], 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // untrustworthy
        type: 'trust-game',
        center_img: playerImgs[8],
        center_caption: "Dont'tTrustMe#4",
        recip_dist_mean: UNTRUSTWORTHY_RECI_MEAN,
        recip_dist_var: UNTRUSTWORTHY_RECI_VAR,
        friends_imgs: [playerImgs[3], 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // untrustworthy
        type: 'trust-game',
        center_img: playerImgs[9],
        center_caption: "Dont'tTrustMe#5",
        recip_dist_mean: UNTRUSTWORTHY_RECI_MEAN,
        recip_dist_var: UNTRUSTWORTHY_RECI_VAR,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    }];

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

    // BLOCK 3 SURVEY QUESTIONS
    var block3 = [{
        type: 'survey-slider',
        question: 'How much did you enjoy playing the Investment Game?',
        min_text: '0%',
        max_text: '100%'
    },
    {
        type: 'survey-text',
        questions: ['Please indicate anything that you particularly liked about the game, ' +
                   'and any changes that you think might make the game more enjoyable.'],
        rows: [5],
        columns: [80]
    },
    {
        type: 'survey-slider',
        question: 'How likely would you play this game for a chance to win prizes (e.g. money, gift certificates) in your free time?',
        min_text: '0%',
        max_text: '100%'
    }];
    for (var i = 0; i < playerImgs.length; ++i) {
        block3.push({
            type: 'survey-likert',
            prompt: 'You may have the chance to be invited back to complete a cooperative puzzle-solving game with a partner. ' +
                    'If this happens, we\'ll do our best to follow your preferences in assigning you a partner. Please rate how ' +
                    'much you would like to be paired with each partner you played with today.',
            questions: []
        });
    }
    block3.push({
        type: 'survey-text',
        questions: ['If there’s any other feedback you’d like to provide us about your experience today, please take a moment to share it now.'],
        rows: [5],
        columns: [80]
    });
    block3.push({
        type: 'instructions',
        pages: ['Thank you! You’ve now completed the session. Please notify the experimenter.']
    });

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
    // timeline = timeline.concat(block2Instructions);
    //   Block 2 Trials
    // timeline.push(waitScreen);
    // add_trials_randomly(block2Trials, BLOCK_2_NUM_TRIALS_PER_PLAYER);
    //   More Instructions for block 3
    timeline = timeline.concat(block3Instructions);
    timeline = timeline.concat(block3);

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
