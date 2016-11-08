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
        function add_table_header_class(cellRow, cellCol, className) {
            $($('#matrix thead th')[cellCol]).addClass(className);
            $($('#matrix tbody tr th')[cellRow]).addClass(className);
        }
        function remove_table_header_class(cellRow, cellCol, className) {
            $($('#matrix thead th')[cellCol]).removeClass(className);
            $($('#matrix tbody tr th')[cellRow]).removeClass(className);
        }

        function cell_num_check(numCellsNeedResponse) {
            if (numCellsNeedResponse === 0) {
                $('#submit').removeClass('disabled');
            } else if (!$('#submit').hasClass('disabled')) {
                $('#submit').addClass('disabled');
            }
        }

        function add_hover_effect(tdElement) {
            var cellRow = tdElement.closest('tr').index();
            var cellCol = tdElement.index();

            // change this cell
            // tdElement.addClass(className);
            if (false) {
                return;
            }
            tdElement.text('');
            var friendsSubcell = $('<tr>').append($('<td>', {
                id: 'friends-subcell',
                class: tdElement.hasClass('friends-selected') ? 'friends-selected' : 'friends-hover',
                text: 'Friends',
                style: 'border-radius: 3px;'
            }));
            var notFriendsSubcell = $('<tr>').append($('<td>', {
                id: 'not-friends-subcell',
                class: tdElement.hasClass('not-friends-selected') ? 'not-friends-selected' : 'not-friends-hover',
                text: 'Not Friends',
                style: 'border-radius: 3px;'
            }));
            tdElement.append(friendsSubcell);
            tdElement.append(notFriendsSubcell);

            // change table header
            if (tdElement.hasClass('not-friends-selected')) {
                add_table_header_class(cellRow, cellCol, 'not-friends-hover')
            } else if (tdElement.hasClass('friends-selected')) {
                add_table_header_class(cellRow, cellCol, 'friends-hover');
            } else {
                add_table_header_class(cellRow, cellCol, 'neutral-hover');
            }

            // subcell click functions
            $('#friends-subcell').click(function() {
                if (tdElement.hasClass('not-friends-selected')) {
                    $('#friends-subcell').removeClass('friends-hover');
                    $('#friends-subcell').addClass('friends-selected');
                    $('#not-friends-subcell').removeClass('not-friends-selected');
                    $('#not-friends-subcell').addClass('not-friends-hover');
                } else if (!tdElement.hasClass('friends-selected')) {
                    $('#friends-subcell').removeClass('friends-hover');
                    $('#friends-subcell').addClass('friends-selected');
                    --numCellsNeedResponse;
                }
                remove_table_header_class(cellRow, cellCol, 'not-friends-hover');
                remove_table_header_class(cellRow, cellCol, 'neutral-hover');
                add_table_header_class(cellRow, cellCol, 'friends-hover');
                tdElement.removeClass('not-friends-selected');
                tdElement.addClass('friends-selected');

                cell_num_check(numCellsNeedResponse);
            });

            $('#not-friends-subcell').click(function() {
                if (tdElement.hasClass('friends-selected')) {
                    $('#not-friends-subcell').removeClass('not-friends-hover');
                    $('#not-friends-subcell').addClass('not-friends-selected');
                    $('#friends-subcell').removeClass('friends-selected');
                    $('#friends-subcell').addClass('friends-hover');
                } else if (!tdElement.hasClass('not-friends-selected')) {
                    $('#not-friends-subcell').removeClass('not-friends-hover');
                    $('#not-friends-subcell').addClass('not-friends-selected');
                    --numCellsNeedResponse;
                }
                remove_table_header_class(cellRow, cellCol, 'friends-hover');
                remove_table_header_class(cellRow, cellCol, 'neutral-hover');
                add_table_header_class(cellRow, cellCol, 'not-friends-hover');
                tdElement.removeClass('friends-selected');
                tdElement.addClass('not-friends-selected');

                cell_num_check(numCellsNeedResponse);
            });
        }

        function remove_hover_effect(tdElement) {
            var cellRow = tdElement.closest('tr').index();
            var cellCol = tdElement.index();

            // change this cell
            $('#friends-subcell').remove();
            $('#not-friends-subcell').remove();
            if (tdElement.text() == '') {
                if (tdElement.hasClass('friends-selected')) {
                    tdElement.append('Friends');
                } else if (tdElement.hasClass('not-friends-selected')) {
                    tdElement.append('Not Friends');
                }
            }
            // change table header
            remove_table_header_class(cellRow, cellCol, 'friends-hover');
            remove_table_header_class(cellRow, cellCol, 'not-friends-hover');
            remove_table_header_class(cellRow, cellCol, 'neutral-hover');
        }

        $('#matrix td').hover(
            function() { add_hover_effect($(this)); }, 
            function() { remove_hover_effect($(this)); }
        );

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
