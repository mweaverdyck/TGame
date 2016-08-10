var trial_index = 0;

jsPsych.plugins['trust-game'] = (function() {

    var plugin = {};

    plugin.trial = function(display_element, trial) {
        // set default values for parameters
        trial.left_caption = trial.left_caption || '';
        trial.right_caption = trial.right_caption || '';
        trial.money = trial.money || 10;
        trial.wait_time_min = trial.wait_time_min || 0;
        trial.wait_time_max = trial.wait_time_max || 0;
        trial.recip_dist_mean = trial.recip_dist_mean || 0.33334;    // default: 33% of the received $$$
        trial.recip_dist_var = trial.recip_dist_var || 0;

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        // add elements
        var rightImgDiv = $('<div>', {
            class: "center-img-div"
        });
        rightImgDiv.append($('<p>', {
            class:"center-img-text",
            text: trial.right_caption
        }));
        rightImgDiv.append($('<div>', {
                class: "image-cropper"
            })
            .append($('<img>', {
                class: "center-img",
                src: trial.right_img
        })));
        display_element.append(rightImgDiv);

        display_element.append('<p id="question" class="fixed-position-mid-below">You have $' +
            trial.money + '.<br/>How much will you give to ' + trial.right_caption + '?</p>');

        var sliderDiv = $('<div>', {
            id: 'sliderdiv',
            class: "slider-div"
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

        // data
        var startTime = Date.now();
        var trial_data = {};

        // submit button
        $('#submit').click(function() {
            if (!$('#slider-tooltip').hasClass("in")) {
                // return if haven't responded
                return;
            }

            // record data
            var endTime = Date.now();
            var response_time = endTime - startTime;

            var response = $("#slide").slider('getValue');
            trial_index += 1;
            trial_data = {
                trial_index: trial_index,
                response: response,
                received: Math.round(response * 300)/100,
                rt: response_time,
                image: trial.right_img,
                caption: trial.right_caption
            };

            // remove some elements
            $('#question').remove();
            $('#submit').remove();
            $("#sliderdiv").remove();

            // add new elements
            display_element.append('<p id="result-text" class="fixed-position-mid-below">' +
                'You gave ' + trial.right_caption + ' <b>$' + response + '</b>, which were tripled before being passed on.<br/>' +
                trial.right_caption + ' received <b>$' + trial_data.received + '</b>.<br/></p>'
            );
            display_element.append($('<div>', {
                id: 'progress-bar',
                class: "progress-bar progress-bar-info progress-bar-striped active bar-div lower",
                role: 'progressbar',
                "aria-valuenow": 100,
                style: 'font-size: 16px;',
                text: 'Waiting for the other player...'
            }));

            // the other "player" responds
            setTimeout(function() {
                $('#progress-bar').remove();

                // reciprocate
                if (trial.recip_dist_var === 0) {
                    trial_data.reciprocation = Math.round(100 * trial_data.received * trial.recip_dist_mean)/100;
                } else {
                    // get a random number from the distribution
                    var distribution = gaussian(trial.recip_dist_mean, trial.recip_dist_var);
                    trial_data.reciprocation = Math.round(100 * trial_data.received * distribution.ppf(Math.random()))/100;
                    if (trial_data.reciprocation < 0) {
                        trial_data.reciprocation = 0;
                    }
                    if (trial_data.reciprocation > trial_data.received) {
                        trial_data.reciprocation = trial_data.received;
                    }
                }

                // add new html elements
                var resultText = "You ";

                $('#result-text').append('<br/>' + trial.right_caption + ' has returned <b>$' + trial_data.reciprocation + '</b> to you.');

                display_element.append($('<button>', {
                    id: 'next',
                    class: "autocompare btn btn-primary submit-btn",
                    text: 'Next'
                }));


                $('#next').click(function() {
                    console.log(trial_data);
                    // goto next trial
                    display_element.html('');
                    jsPsych.finishTrial(trial_data);
                })
            }, random_int(trial.wait_time_min, trial.wait_time_max));  // TODO magic number

        });

    };

    return plugin;

})();
