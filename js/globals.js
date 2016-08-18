
var hookWindow = false;

var trustworthyImgIndexes = [0, 1, 4, 5, 6];


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
    var path = '/' + userId + '/' + experimentId + '/end_time';
    var endTimeUpdate = {};
    endTimeUpdate[path] = (new Date()).toUTCString();

    firebase.database().ref().update(endTimeUpdate).then(function() {
        hookWindow = false;
        firebase.auth().currentUser.delete();
    });
}
