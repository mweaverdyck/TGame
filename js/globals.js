
var hookWindow = false;

var trustworthyImgIndexes = [0, 1, 4, 5, 6];

var friendPairIndexes = {
    0: [4, 8],
    1: [5, 9],
    2: [6, 10],
    3: [7, 11],
    4: [0],
    5: [1],
    6: [2],
    7: [3],
    8: 'unknown',
    9: 'unknown',
    10: [0],
    11: [1],
    12: [2],
    13: [3],
    14: 'unknown',
    15: 'unknown'
}

var totalEarning = 0;
var experimentStartTime = 0;


function random_int(min, max) {  // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffle_array(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function isTrustworthy(imgPath) {
    for (var i in players) {
        if (players[i][0] === imgPath) {
            if (trustworthyImgIndexes.indexOf(i) !== -1) {
                return true;
            }
            return false;
        }
    }
    return false;
}

function areFriends(img1Path, img2Path) {
    var img1Index = -1;
    var img2Index = -1;
    for (var i in players) {
        if (players[i][0] === img1Path) {
            img1Index = parseInt(i);
        } else if (players[i][0] === img2Path) {
            img2Index = parseInt(i);
        }
    }
    return friendPairIndexes[img1Index].indexOf(img2Index) !== -1;
}

function getFriendImg(playerIndex) {
    var friendIndex = friendPairIndexes[playerIndex];
    return friendIndex === 'unknown' ? 'unknown' : players[friendIndex][0];
}

// Data writers
function write_trial_data(userId, experimentId, data) {
    var block_index = data.block_index;
    var trial_index = data.trial_idx || data.trial_index;
    delete data.block_index;
    delete data.trial_index;
    delete data.trial_type;
    delete data.internal_node_id;
    if (typeof data.trial_idx != 'undefined') {
        data.trial_index = data.trial_idx;
    }
    delete data.trial_idx;
    var path = '/' + userId + '/' + experimentId + '/' + block_index + '/' + trial_index;
    firebase.database().ref(path).set(data);
}

function after_last_trial(userId, experimentId) {
    var path = '/' + userId + '/' + experimentId;
    var update = {};
    update[path + '/duration'] = (Date.now() - experimentStartTime) / 1000; // in sec
    update[path + '/end_time'] = (new Date()).toUTCString();
    update[path + '/total_earning'] = totalEarning;

    firebase.database().ref().update(update).then(function() {
        hookWindow = false;
        firebase.auth().currentUser.delete();
    });
}
