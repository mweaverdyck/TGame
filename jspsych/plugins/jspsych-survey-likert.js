/**
 * jspsych-survey-likert
 * a jspsych plugin for measuring items on a likert scale
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

jsPsych.plugins['survey-likert'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'survey-likert',
    description: '',
    parameters: {
      questions: {
        type: [jsPsych.plugins.parameterType.STRING],
        array: true,
        default: undefined,
        no_function: false,
        description: ''
      },
      labels: {
        type: [jsPsych.plugins.parameterType.STRING],
        array: true,
        default: undefined,
        no_function: false,
        description: ''
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // default parameters for the trial
    trial.preamble = typeof trial.preamble === 'undefined' ? "" : trial.preamble;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // show preamble text
    display_element.append($('<div>', {
      "id": 'jspsych-survey-likert-preamble',
    })
    .append($('<p>', {
      class: "small",
      text: trial.preamble
    })));

    // player image
    var centerImgDiv = $('<div>', {
        class: "center-img-div",
        style: 'margin: auto;'
    }).append($('<div>', {
        class: "image-cropper"
    }));
    var centerImgCropper = centerImgDiv.children();
    centerImgCropper.append($('<p>', {
        class:"center-img-text",
        text: trial.caption
    }));
    centerImgCropper.append($('<img>', {
        src: trial.image
    }));
    display_element.append(centerImgDiv);

    display_element.append('<form id="jspsych-survey-likert-form" style="width: 90%;">');
    // add likert scale questions
    for (var i = 0; i < trial.questions.length; i++) {
      form_element = $('#jspsych-survey-likert-form');
      // add question
      form_element.append('<label class="jspsych-survey-likert-statement">' + trial.questions[i] + '</label>');
      // add options
      var width = 70 / trial.num_points;
      options_string = '<ul class="jspsych-survey-likert-opts" data-radio-group="Q' + i + '">';
      options_string += '<li style="width: 15%"><label class="jspsych-survey-likert-opt-label">' + trial.labels[i][0] + '</label></li>'
      for (var j = 0; j < trial.num_points; j++) {
        options_string += '<li style="width:' + width + '%""><input type="radio" name="Q' + i + '" value="' + j + '"></li>';
      }
      options_string += '<li style="width: 15%"><label class="jspsych-survey-likert-opt-label">' + trial.labels[i][1] + '</label></li>'
      options_string += '</ul>';
      form_element.append(options_string);
    }

    // add submit button
    display_element.append($('<button>', {
      'id': 'jspsych-survey-likert-next',
      'class': 'jspsych-survey-likert jspsych-btn'
    }));
    $("#jspsych-survey-likert-next").html('Submit');
    $("#jspsych-survey-likert-next").click(function() {
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      var response = -1;
      $("#jspsych-survey-likert-form .jspsych-survey-likert-opts").each(function(index) {
        var id = $(this).data('radio-group');
        response = $('input[name="' + id + '"]:checked').val();
        if (typeof response == 'undefined') {
          response = -1;
        }
      });

      if (response === -1) {
        $(".jspsych-survey-likert-opt-label").css('color', '#cc0000');
        setTimeout(function(){
          $(".jspsych-survey-likert-opt-label").css('color', 'black');
        }, 2000);
        return;
      }

      // save data
      var trial_data = {
        rt: response_time,
        img: trial.image,
        response: response
      };

      display_element.html('');

      // next trial
      jsPsych.finishTrial(trial_data);
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
