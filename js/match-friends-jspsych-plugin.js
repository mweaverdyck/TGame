var next_img_match;

jsPsych.plugins['match-friends'] = (function() {

    var plugin = {};

    plugin.trial = function(display_element, trial) {
        trial.col_player_index_begin = trial.col_player_index_begin || 7;
        trial.col_player_index_end = trial.col_player_index_end || 0;
        trial.row_player_index_begin = trial.row_player_index_begin || 0;
        trial.row_player_index_end = trial.row_player_index_end || 7;

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

        // add elements
        display_element.append($('<p>', {
            class: 'fixed-position-upper-left',
            text: 'Indicate if two people were friends or not by clicking on the intersections:'
        }));
        // html table
        var table = $('<table>', {
            id: 'matrix',
            class: 'table table-bordered'
        });
        table.append($('<thead>', {
            id: 'matrix-head'
        }));
        table.append($('<tbody>', {
            id: 'matrix-body'
        }));
        display_element.append($('<div>', {
            id: 'matrix-div'
        }).append(table));

        // appending table contents
        var numCellsNeedResponse = 0;
        // helper functions
        function append_row(contents, isHead) {
            // contents is an array containing jquery contents for each cell
            // assuming length of contents % 4 === 0
            var oneRow = $('<tr>');
            for (var i = 0; i < players.length && i < contents.length; ++i) {
                oneRow.append($( (isHead || i === 0) ? '<th>' : '<td>').append(contents[i]));
                if (!isHead && i !== 0) {
                    ++numCellsNeedResponse;
                }
            }
            if (isHead) {
                $('#matrix-head').append(oneRow);
            } else {
                $('#matrix-body').append(oneRow);
            }
        }

        function get_player_img_div(index) {
            var playerImgDivCropper = $('<div>', {
                class: 'image-cropper'
            });
            playerImgDivCropper.append($('<p>', {
                class: 'img-text',
                style: 'font-size: 16px; line-height: 23px; font-weight: 400;',
                text: players[index][1]
            }));
            playerImgDivCropper.append($('<img>', {
                src: players[index][0]
            }));
            var playerImgDiv = $('<div>', {
                class: 'small-img-div'
            }).append(playerImgDivCropper);
            return playerImgDiv;
        }

        // first row
        var firstRow = [''];
        var colIdxBegin = trial.col_player_index_begin;
        var colIdxEnd = trial.col_player_index_end;
        for (var i = colIdxBegin; i != colIdxEnd; colIdxBegin > colIdxEnd ? --i : ++i) {
            firstRow.push(get_player_img_div(i));
        }
        append_row(firstRow, true);

        // second to last rows
        var rowIdxBegin = trial.row_player_index_begin;
        var rowIdxEnd = trial.row_player_index_end;
        var colCounter = 0;
        for (var i = rowIdxBegin; i != rowIdxEnd; rowIdxBegin > rowIdxEnd ? --i : ++i, ++colCounter) {  // for each row
            var row = [get_player_img_div(i)];
            if (colIdxBegin > colIdxEnd) {
                for (var j = colIdxBegin; j != colIdxEnd + colCounter; --j) {
                    row.push('')
                }
            } else {
                for (var j = colIdxBegin; j != colIdxEnd - colCounter; ++j) {
                    row.push('')
                }
            }
            append_row(row, false);
        }

        // interaction effects
        $('#matrix').stickyTableHeaders();
        // helper functions
        function add_hover_class(tdElement, className) {
            var cellRow = tdElement.closest('tr').index();
            var cellCol = tdElement.index();

            // change this cell
            tdElement.addClass(className);
            // change table header
            $($('#matrix thead th')[cellCol]).addClass(className);
            $($('#matrix tbody tr th')[cellRow]).addClass(className);
        }
        function remove_hover_class(tdElement, className) {
            var cellRow = tdElement.closest('tr').index();
            var cellCol = tdElement.index();

            // change this cell
            tdElement.removeClass(className);
            // change table header
            $($('#matrix thead th')[cellCol]).removeClass(className);
            $($('#matrix tbody tr th')[cellRow]).removeClass(className);
        }

        $('#matrix td').click(function() {
            if ($(this).hasClass('friends-selected')) {  // was "friends"
                $(this).removeClass('friends-selected');
                $(this).addClass('not-friends-selected');
                remove_hover_class($(this), 'friends-hover')
                add_hover_class($(this), 'not-friends-hover');
                $(this).text('Not Friends');
            } else if ($(this).hasClass('not-friends-selected')) {  // was "not friends"
                $(this).removeClass('not-friends-selected');
                $(this).text('');
                ++numCellsNeedResponse;
            } else {    // was empty
                --numCellsNeedResponse;
                remove_hover_class($(this), 'not-friends-hover')
                add_hover_class($(this), 'friends-hover');
                $(this).addClass('friends-selected');
                $(this).text('Friends');
            }
            if (numCellsNeedResponse === 0) {
                $('#submit').removeClass('disabled');
            } else if (!$('#submit').hasClass('disabled')) {
                $('#submit').addClass('disabled');
            }
        });

        $('#matrix td').mouseover(function() {
            var cellRow = $(this).closest('tr').index();
            var cellCol = $(this).index();

            if ($(this).hasClass('not-friends-selected')) {
                add_hover_class($(this), 'not-friends-hover');
            } else {
                add_hover_class($(this), 'friends-hover');
            }
        });

        $('#matrix td').mouseout(function() {
            var cellRow = $(this).closest('tr').index();
            var cellCol = $(this).index();

            if ($(this).hasClass('friends-hover')) {
                remove_hover_class($(this), 'friends-hover')
            } else {
                remove_hover_class($(this), 'not-friends-hover')
            }
        });

        // next button
        $('#matrix-div').append($('<button>', {
            id: 'submit',
            class: "autocompare btn btn-primary disabled",
            style: 'margin-bottom: 20px;',
            text: 'Next'
        }));

        // data
        var startTime = Date.now();
        var trial_data = {};

        // next button function
        $('#submit').click(function() {
            if ($(this).hasClass('disabled')) {
                return;
            }
            // TODO


            var response_time = Date.now() - startTime;
            trial_data = {
                rt: response_time
            };
            display_element.html('');
            jsPsych.finishTrial(trial_data);
            window.scrollTo(0, 0);
        });

    };

    return plugin;

})();
