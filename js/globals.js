
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
    return trustworthyImgIndexes.indexOf(playerImgs.indexOf(imgPath)) !== -1;
}

// Data writers
function write_trial_data(userId, experimentId, data) {
    delete data.trial_type;
    delete data.internal_node_id;
    if (typeof data.trial_idx != 'undefined') {
        data.trial_index = data.trial_idx;
    }
    delete data.trial_idx;
    var path = '/' + userId + '/' + experimentId + '/' + data.block_index + '/' + data.trial_index;
    firebase.database().ref(path).set(data);
}

function after_last_trial(userId, experimentId) {
    firebase.database().ref('/' + userId + '/' + experimentId).set({
        end_time: (new Date()).toUTCString()
    }).then(function() {
        hookWindow = false;
        firebase.auth().currentUser.delete();
    });
}
