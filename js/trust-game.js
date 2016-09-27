$(function() {

    var timeline = [];
    var userId = 'test';
    var experimentId = Date.now();

    players = shuffle_array(players);

    // Prevent closing window
    window.onbeforeunload = function() {
        if (hookWindow) {
            return CLOSE_WINDOW_ALERT;
        }
    }

    // Get user ID
    var parameters = window.location.search.substring(1);
    if (parameters.length > 0) {
        userId = parameters.split("=")[1];  // get id from url parameter
    } else {
        // $('body').html(''); // TODO
    }


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDjvdK9WtSGel_W9E3MbFXKCcBg7c_F4WQ",
        authDomain: "trust-game.firebaseapp.com",
        databaseURL: "https://trust-game.firebaseio.com",
        storageBucket: "trust-game.appspot.com",
    };
    firebase.initializeApp(config);

    // // Sign in
    // firebase.auth().signInAnonymously().then(function(user) {
    //     var firebaseUid = user.uid;
    //     console.log('Signed in as ' + firebaseUid);

    //     firebase.database().ref('/' + userId + '/' + experimentId).set({
    //         start_time: (new Date()).toUTCString(),
    //         firebase_uid: firebaseUid
    //     });
    // });


    // TRAINING TRIALS
    var trainingTrials = [{
        type: 'trust-game',
        center_img: 'img/practice_img/usericon4.png',
        center_caption: 'Player 1',
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: 'img/practice_img/usericon3.png',
        center_caption: 'Player 2',
        recip_dist_mean: 0.4,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: 'img/practice_img/usericon5.png',
        center_caption: 'Player 3',
        recip_dist_mean: 0.00001,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: 'img/practice_img/usericon2.png',
        center_caption: 'Player 4',
        friends_imgs: ['img/practice_img/usericon5.png', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: 'img/practice_img/usericon6.png',
        center_caption: 'Player 5',
        recip_dist_mean: 0.3,
        friends_imgs: ['img/practice_img/usericon4.png', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: 'img/practice_img/usericon1.png',
        center_caption: 'Player 6',
        recip_dist_mean: 0.63,
        friends_imgs: ['img/practice_img/usericon3.png', 'unknown', 'unknown', 'unknown', 'unknown']
    }];
    for (var i in trainingTrials) {
        trainingTrials[i].on_finish = function(data) { write_trial_data(userId, experimentId, data); };
    }

    // BLOCK 1 TRIALS
    var block1Trials = [{    // trustworthy
        type: 'trust-game',
        center_img: players[0][0],
        center_caption: players[0][1],
        recip_dist_mean: TRUSTWORTHY_RECI_MEAN,
        recip_dist_var: TRUSTWORTHY_RECI_VAR,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // trustworthy
        type: 'trust-game',
        center_img: players[1][0],
        center_caption: players[1][1],
        recip_dist_mean: TRUSTWORTHY_RECI_MEAN,
        recip_dist_var: TRUSTWORTHY_RECI_VAR,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // untrustworthy
        type: 'trust-game',
        center_img: players[2][0],
        center_caption: players[2][1],
        recip_dist_mean: UNTRUSTWORTHY_RECI_MEAN,
        recip_dist_var: UNTRUSTWORTHY_RECI_VAR,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // untrustworthy
        type: 'trust-game',
        center_img: players[3][0],
        center_caption: players[3][1],
        recip_dist_mean: UNTRUSTWORTHY_RECI_MEAN,
        recip_dist_var: UNTRUSTWORTHY_RECI_VAR,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    }];

    // BLOCK 2 TRIALS
    var block2Trials = [{    // trustworthy
        type: 'trust-game',
        center_img: players[4][0],
        center_caption: players[4][1],
        recip_dist_mean: TRUSTWORTHY_RECI_MEAN,
        recip_dist_var: TRUSTWORTHY_RECI_VAR,
        friends_imgs: [players[0][0], 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // trustworthy
        type: 'trust-game',
        center_img: players[5][0],
        center_caption: players[5][1],
        recip_dist_mean: TRUSTWORTHY_RECI_MEAN,
        recip_dist_var: TRUSTWORTHY_RECI_VAR,
        friends_imgs: [players[2][0], 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // trustworthy
        type: 'trust-game',
        center_img: players[6][0],
        center_caption: players[6][1],
        recip_dist_mean: TRUSTWORTHY_RECI_MEAN,
        recip_dist_var: TRUSTWORTHY_RECI_VAR,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // untrustworthy
        type: 'trust-game',
        center_img: players[7][0],
        center_caption: players[7][1],
        recip_dist_mean: UNTRUSTWORTHY_RECI_MEAN,
        recip_dist_var: UNTRUSTWORTHY_RECI_VAR,
        friends_imgs: [players[1][0], 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // untrustworthy
        type: 'trust-game',
        center_img: players[8][0],
        center_caption: players[8][1],
        recip_dist_mean: UNTRUSTWORTHY_RECI_MEAN,
        recip_dist_var: UNTRUSTWORTHY_RECI_VAR,
        friends_imgs: [players[3][0], 'unknown', 'unknown', 'unknown', 'unknown']
    },
    {    // untrustworthy
        type: 'trust-game',
        center_img: players[9][0],
        center_caption: players[9][1],
        recip_dist_mean: UNTRUSTWORTHY_RECI_MEAN,
        recip_dist_var: UNTRUSTWORTHY_RECI_VAR,
        friends_imgs: ['unknown', 'unknown', 'unknown', 'unknown', 'unknown']
    }];

    // HELPER FUNC
    function add_trials_randomly(trials, num_per_trial, block_index) {
        var trialsArray = [];
        for (var i = 0; i < trials.length; ++i) {
            for (var j = 0; j < num_per_trial; ++j) {
                trials[i].block_index = block_index;
                trials[i].wait_time_min = DEFAULT_RETURN_WAIT_TIME_MIN;
                trials[i].wait_time_max = DEFAULT_RETURN_WAIT_TIME_MAX;
                trials[i].on_finish = function(data) {
                    write_trial_data(userId, experimentId, data);
                };
                trialsArray.push($.extend(true, {}, trials[i]));
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
            trialsArray[i].trial_idx = i + 1;
            timeline.push(trialsArray[i]);
        }
    }

    // BLOCK 3 HELPER
    function block_3_on_trial_finish(data) {
        data.block_index = 3;
        write_trial_data(userId, experimentId, data);
    } 

    // BLOCK 3 SURVEY QUESTIONS
    var block3 = [/*{
        type: 'demography',
        on_finish: block_3_on_trial_finish
    },
    {
        type: 'survey-slider',
        question: 'How much did you enjoy playing the Investment Game?',
        min_text: '0%',
        max_text: '100%',
        on_finish: block_3_on_trial_finish
    },
    {
        type: 'survey-text',
        block_index: 3,
        questions: ['Please indicate anything that you particularly liked about the game, ' +
                   'and any changes that you think might make the game more enjoyable.'],
        rows: [5],
        columns: [80],
        on_finish: block_3_on_trial_finish
    },
    {
        type: 'survey-slider',
        block_index: 3,
        question: 'How likely would you play this game for a chance to win prizes (e.g. money, gift certificates) in your free time?',
        min_text: '0%',
        max_text: '100%',
        on_finish: block_3_on_trial_finish
    }*/];
    // for (var i = 0; i < players.length; ++i) {
    //     block3.push({
    //         type: 'survey-likert',
    //         preamble: 'You may have the chance to be invited back to complete a cooperative puzzle-solving game with a partner. ' +
    //                 'If this happens, we\'ll do our best to follow your preferences in assigning you a partner. Please rate how ' +
    //                 'much you would like to be paired with each partner you played with today.',
    //         questions: [''],
    //         image: players[i][0],
    //         caption: players[i][1],
    //         labels: [['Not at all', 'Definitely yes']],
    //         num_points: 7,
    //         on_finish: function(data) {
    //             data.response = parseInt(data.response) + 1;
    //             data.block_index = 3;
    //             data.trustworthy = isTrustworthy(data.img);
    //             write_trial_data(userId, experimentId, data);
    //         }
    //     });
    // }
    block3.push({
        type: 'match-img',
        left_img: players[8][0],
        left_caption: players[8][1],
        right_img: players[1][0],
        right_caption: players[1][1]
    });
    block3.push({
        type: 'survey-text',
        block_index: 3,
        questions: ['If there’s any other feedback you’d like to provide us about your experience today, please take a moment to share it now.'],
        rows: [5],
        columns: [80],
        on_finish: function(data) {
            block_3_on_trial_finish(data);
            after_last_trial(userId, experimentId);
        }
    });
    block3.push({
        type: 'instructions',
        pages: ['Thank you! You have now completed the session. Please notify the experimenter.']
    });

    // EXPERIMENT TIMELINE
    // timeline = timeline.concat(beginningInstructions);
    // //   Instructions
    // timeline = timeline.concat(beginningInstructions);
    // //   Training Trials
    // timeline = timeline.concat(trainingTrials);
    // //   More Instructions for block 1
    // timeline = timeline.concat(block1Instructions);
    // //   Block 1 Trials
    // timeline.push(waitScreen);
    // add_trials_randomly(block1Trials, BLOCK_1_NUM_TRIALS_PER_PLAYER, 1);
    // //   More Instructions for block 2
    // timeline = timeline.concat(block2Instructions);
    // //   Block 2 Trials
    // timeline.push(waitScreen);
    // add_trials_randomly(block2Trials, BLOCK_2_NUM_TRIALS_PER_PLAYER, 2);
    // //   More Instructions for block 3
    // timeline = timeline.concat(block3Instructions);
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
    jsPsych.pluginAPI.preloadImages(allImgs, startExperiment);
});
