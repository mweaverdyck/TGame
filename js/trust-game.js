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
    }
    if (parameters.length == 0 || userId.length == 0) {
        $('body').html('');
        return;
    }
    if (userId == 'shortversion') {
        BLOCK_1_NUM_TRIALS_PER_PLAYER = 1;
        BLOCK_2_NUM_TRIALS_PER_PLAYER = 1;
        DEFAULT_RETURN_WAIT_TIME_MIN = 300;
        DEFAULT_RETURN_WAIT_TIME_MAX = 800;
        ASSIGNMENT_WAIT_TIME_MIN = 300;
        ASSIGNMENT_WAIT_TIME_MAX = 800;
        FIND_PARTNER_TIME_MIN = 300;
        FIND_PARTNER_TIME_MAX = 800;
    }


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDjvdK9WtSGel_W9E3MbFXKCcBg7c_F4WQ",
        authDomain: "trust-game.firebaseapp.com",
        databaseURL: "https://trust-game.firebaseio.com",
        storageBucket: "trust-game.appspot.com",
    };
    firebase.initializeApp(config);

    // Sign in
    firebase.auth().signInAnonymously().then(function(user) {
        var firebaseUid = user.uid;
        console.log('Signed in as ' + firebaseUid);

        firebase.database().ref('/' + userId + '/' + experimentId).set({
            start_time: (new Date()).toUTCString(),
            players: players,
            firebase_uid: firebaseUid
        });
    });

    // TRAINING TRIALS
    var trainingTrials = [{
        type: 'trust-game',
        center_img: 'img/practice_img/usericon4.png',
        center_caption: 'Player 1',
        friends_imgs: ['unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: 'img/practice_img/usericon3.png',
        center_caption: 'Player 2',
        recip_dist_mean: 0.4,
        friends_imgs: ['unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: 'img/practice_img/usericon5.png',
        center_caption: 'Player 3',
        recip_dist_mean: 0.00001,
        friends_imgs: ['unknown', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: 'img/practice_img/usericon2.png',
        center_caption: 'Player 4',
        friends_imgs: ['img/practice_img/usericon5.png', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: 'img/practice_img/usericon6.png',
        center_caption: 'Player 5',
        recip_dist_mean: 0.3,
        friends_imgs: ['img/practice_img/usericon4.png', 'unknown', 'unknown']
    },
    {
        type: 'trust-game',
        center_img: 'img/practice_img/usericon1.png',
        center_caption: 'Player 6',
        recip_dist_mean: 0.63,
        friends_imgs: ['img/practice_img/usericon3.png', 'unknown', 'unknown']
    }];
    for (var i in trainingTrials) {
        trainingTrials[i].on_finish = function(data) { write_trial_data(userId, experimentId, data); };
    }

    // BLOCK 1 TRIALS (1 trial per type)
    var block1Trials = [];
    for (var i = 0; i < BLOCK_1_NUM_PLAYERS; ++i) {
        block1Trials.push({
            type: 'trust-game',
            center_img: players[i][0],
            center_caption: players[i][1],
            recip_dist_mean: is_trustworthy(i) ? TRUSTWORTHY_RECI_MEAN : UNTRUSTWORTHY_RECI_MEAN,
            recip_dist_var: get_reciprocation_variance(i),
            friends_imgs: ['unknown', 'unknown', 'unknown']
        });
    }

    // BLOCK 2 TRIALS (1 trial per type)
    var block2Trials = [];
    for (var i = 0; i < BLOCK_2_NUM_PLAYERS; ++i) {
        var playerIndex = i + BLOCK_1_NUM_PLAYERS;
        block2Trials.push({
            type: 'trust-game',
            center_img: players[playerIndex][0],
            center_caption: players[playerIndex][1],
            recip_dist_mean: is_trustworthy(playerIndex) ? TRUSTWORTHY_RECI_MEAN : UNTRUSTWORTHY_RECI_MEAN,
            recip_dist_var: get_reciprocation_variance(playerIndex),
            friends_imgs: [get_friend_img(playerIndex), 'unknown', 'unknown']
        });
    }


    // HELPER FUNCTION
    // Repeat each type of trial (given in trials) for num_per_trial times and add them to the time line randomly
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

    // BLOCK 3 HELPERS
    function block_3_on_trial_finish(data) {
        data.block_index = 3;
        write_trial_data(userId, experimentId, data);
    }

    // BLOCK 3 SURVEY QUESTIONS
    var block3 = [{
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
    }];

    for (var i = 0; i < players.length; ++i) {
        block3.push({
            type: 'survey-likert',
            preamble: 'You may have the chance to be invited back to complete a cooperative puzzle-solving game with a partner. ' +
                    'If this happens, we\'ll do our best to follow your preferences in assigning you a partner. Please rate how ' +
                    'much you would like to be paired with each partner you played with today.',
            questions: [''],
            image: players[i][0],
            caption: players[i][1],
            labels: [['Not at all', 'Definitely yes']],
            num_points: 7,
            on_finish: function(data) {
                var playerIndex = get_player_index(data.img);
                data.response = parseInt(data.response) + 1;
                data.block_index = 3;
                data.trustworthy = is_trustworthy(playerIndex);
                data.player_variance = get_reciprocation_variance(playerIndex),
                write_trial_data(userId, experimentId, data);
            }
        });
    }

    block3.push({
        type: 'instructions',
        pages: ['<p>' + 'Next, we\'ll test your knowledge of the relationships between your partners. You \'ll see 4 matrices ' +
        'on the next pages. For each pair of players, please indicate whether they appeared as friends in your previous ' +
        'games. Press right arrow to start.' + '</p>']
    });
    // reorder player indexes for friends matching
    var newIndexes = [];
    for (var i = 0; i < players.length; ++i) {
        newIndexes.push(i);
    }
    newIndexes = shuffle_array(newIndexes);
    playerMatchingTrials = [{
        type: 'match-friends',
        converted_indexes: newIndexes,
        col_player_index_begin: 15,
        col_player_index_end: 8,
        row_player_index_begin: 0,
        row_player_index_end: 7,
        on_finish: block_3_on_trial_finish
    }, {
        type: 'match-friends',
        converted_indexes: newIndexes,
        col_player_index_begin: 8,
        col_player_index_end: 15,
        row_player_index_begin: 6,
        row_player_index_end: -1,
        on_finish: block_3_on_trial_finish
    }, {
        type: 'match-friends',
        converted_indexes: newIndexes,
        col_player_index_begin: 7,
        col_player_index_end: 0,
        row_player_index_begin: 0,
        row_player_index_end: 7,
        on_finish: block_3_on_trial_finish
    }, {
        type: 'match-friends',
        converted_indexes: newIndexes,
        col_player_index_begin: 15,
        col_player_index_end: 7,
        row_player_index_begin: 7,
        row_player_index_end: 15,
        on_finish: block_3_on_trial_finish
    }];
    block3 = block3.concat(playerMatchingTrials);

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
        pages: ['Thank you! You have now completed the session. Please leave this browser window open and notify the experimenter.']
    });

    // EXPERIMENT TIMELINE
    //   Instructions
    timeline = timeline.concat(beginningInstructions);
    //   Training Trials
    timeline = timeline.concat(trainingTrials);
    //   More Instructions for block 1
    timeline = timeline.concat(block1Instructions);
    //   Block 1 Trials
    timeline.push(waitScreen);
    add_trials_randomly(block1Trials, BLOCK_1_NUM_TRIALS_PER_PLAYER, 1);
    //   More Instructions for block 2
    timeline = timeline.concat(block2Instructions);
    //   Block 2 Trials
    timeline.push(waitScreen);
    add_trials_randomly(block2Trials, BLOCK_2_NUM_TRIALS_PER_PLAYER, 2);
    //  More Instructions for block 3
    timeline = timeline.concat(block3Instructions);
    timeline = timeline.concat(block3);

    function startExperiment() {
        hookWindow = true;
        // Start the experiment
        jsPsych.init({
            display_element: $('#jspsych-target'),
            timeline: timeline
        });
        experimentStartTime = Date.now();
    }

    // Load images and then start experiment
    jsPsych.pluginAPI.preloadImages(allImgs, startExperiment);
});
