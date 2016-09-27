var next_img_match;

jsPsych.plugins['match-img'] = (function() {

    var plugin = {};

    plugin.trial = function(display_element, trial) {
        // set default values for parameters
        trial.left_caption = trial.left_caption || '';
        trial.right_caption = trial.right_caption || '';

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        // add elements
        //   left image
        var leftImgDiv = $('<div>', {
            class: 'left-img img-div'
        }).append($('<div>', {
            class: "image-cropper"
        }));
        var leftImgCropper = leftImgDiv.children();
        leftImgCropper.append($('<p>', {
            class:"img-text",
            text: trial.left_caption
        }));
        leftImgCropper.append($('<img>', {
            src: trial.left_img
        }));
        display_element.append(leftImgDiv);

        //   right image
        var rightImgDiv = $('<div>', {
            class: 'right-img img-div'
        }).append($('<div>', {
            class: "image-cropper"
        }));
        var rightImgCropper = rightImgDiv.children();
        rightImgCropper.append($('<p>', {
            class:"img-text",
            text: trial.right_caption
        }));
        rightImgCropper.append($('<img>', {
            src: trial.right_img
        }));
        display_element.append(rightImgDiv);

        //   question
        display_element.append($('<p>', {
            class: 'margin-top',
            text: 'Are they friends or not?'
        }));
        form = display_element.append($('<form>', {
            id: 'q-form',
            action: 'javascript:next_img_match();'
        }))
        $('#q-form').append('<div class="radio"></div>');  // things only work with this nonsense
        $('#q-form').append($('<div>', {
            class: 'col-xs-4 radio'
        })
        .append('<input name="choice" type="radio" value="y" required>Yes'));
        $('#q-form').append($('<div>', {
            class: 'col-xs-4 radio'
        })
        .append('<input name="choice" type="radio" value="n">No'));
        $('#q-form').append($('<div>', {
            class: 'col-xs-4 radio'
        })
        .append('<input name="choice" type="radio" value="i">I don\'t know'));

        //   next button
        $('#q-form').append($('<button>', {
            id: 'submit',
            class: "autocompare btn btn-primary margin-top",
            text: 'Next'
        }));

        // data
        var startTime = Date.now();
        var trial_data = {};

        // next button function
        next_img_match = function() {
            // TODO
            console.log('done');
        }

    };

    return plugin;

})();
