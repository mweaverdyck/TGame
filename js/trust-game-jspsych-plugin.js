
jsPsych.plugins['trust-game'] = (function() {

    var plugin = {};

    plugin.trial = function(display_element, trial) {
        // set default values for parameters
        trial.left_caption = trial.left_caption || '';
        trial.right_caption = trial.right_caption || '';
        trial.money = trial.money || 10;

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        // add elements
        display_element.append($('<img>', {
            class: "left-img",
            src: trial.left_img
        }));

        var rightImgDiv = $('<div>', {
            class: "right-img-div"
        });
        rightImgDiv.append($('<img>', {
            class: "right-img",
            src: trial.right_img
        }));
        rightImgDiv.append($('<p>', {
            class:"right-img-text",
            text: trial.right_caption
        }));
        display_element.append(rightImgDiv);

        display_element.append('<p id="question" class="fixed-position-mid-below">You have $' + trial.money + '.<br/>How much will you give to ' + trial.right_caption + '?</p>');

        var sliderDiv = $('<div>', {
            id: 'sliderdiv',
            class: "lower-bar-div"
        });
        sliderDiv.append('<span class="left-num"><b>$0</b></span>');
        sliderDiv.append($('<div>', {
            class: "slider-inner-div"
        })
        .append($('<input>', {
            id: "slide",
            'data-slider-id': "slider",
            type: "text",
            'data-slider-min': 0,
            'data-slider-max': trial.money,
            'data-slider-step': 0.01,
            'data-slider-value': 0
        })));
        sliderDiv.append('<span class="right-num"><b>$' + trial.money + '</b></span>');
        display_element.append(sliderDiv);

        var script   = document.createElement('script');
        script.type  = 'text/javascript';
        script.text  = '$("#slide").slider({ formatter: function(value) { return "Give $" + value; } });';
        display_element.append(script);

        display_element.append($('<button>', {
            id: 'submit',
            class: "autocompare btn btn-primary disabled submit-btn",
            text: 'Submit'
        }));

        var startTime = Date.now();
        var trial_data = {};

        $('#submit').click(function() {
            if (!$('#slider-tooltip').hasClass("in")) {
                // return if haven't responded
                return;
            }

            // record data
            var endTime = Date.now();
            var response_time = endTime - startTime;

            var response = $("#slide").slider('getValue');
            trial_data = {
                response: response,
                rt: response_time,
                image: trial.right_img,
                caption: trial.right_caption
            };

            $('#question').remove();
            $('#submit').remove();
            $("#sliderdiv").remove();

            // add elements
            display_element.append($('<div>', {
                id: 'progress-bar',
                class: "progress-bar progress-bar-striped active lower-bar-div",
                role: 'progressbar',
                "aria-valuenow": 100,
                style: 'font-size: 16px;',
                text: 'Waiting for the other player...'
            }));

            
            setTimeout(function() {
                $('#progress-bar').remove();

                trial_data.reciprocation = random_int(0, 1000)/100;

                display_element.append($('<p>', {
                    class: "fixed-position-mid-below",
                    text: trial.right_caption + ' has returned $' + trial_data.reciprocation + ' to you.'
                }));

                display_element.append($('<button>', {
                    id: 'next',
                    class: "autocompare btn btn-primary submit-btn",
                    text: 'Next'
                }));
            }, random_int(1000, 2000));  // TODO magic number

        });

        $('#next').click(function() {
            console.log(trial_data);
            // goto next trial
            display_element.html('');
            jsPsych.finishTrial(trial_data);
        })
    };

    return plugin;

})();
