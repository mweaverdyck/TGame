// Instruction texts
var CONTINUE_INSTR = '<p class="fixed-position-below small">' + 'Press right arrow to continue' + '</p>';
var CONTINUE_OR_BACK_INSTR = '<p class="fixed-position-below small">' + 'Press right arrow to continue, or left arrow to go back' + '</p>';

var WELCOME_INSTR = '<p class="center-content">' + 'Welcome to the study!' + '<br/><br/></p>'
var FIND_PARTNER_INSTR = '<p>' + 'Please wait while we look for your partners';
var PARTNER_FOUND_INSTR = '<p class="center-content">' + 'You are now connected to your study partners\' computers.<br/><br/>' +
                'Please press the space bar to find out your role.' + '</p>';

var ASSIGN_ROLE_INSTR = '<p>' + 'Assigning your role. Please wait';

var ROLE_ASSIGNED_INSTR = '<p>' +
                'You have been assigned the role of: <b>Player 1</b><br/>' +
                '</p>';

var DUTY_INSTR = [
                    '<p>' + 'As Player 1, you will do stuff and make $$$...' + '</p>',
                    '<p>' + 'Here are some more instructions.' + '</p>',
                    '<p>' + 'and more.' + '</p>'
                ]

var beginningInstructions = [
    {
        type: 'instructions',
        pages: [WELCOME_INSTR + CONTINUE_INSTR]
    },
    {
        type: 'multi-stim-multi-response',
        is_html: true,
        stimuli: [
            FIND_PARTNER_INSTR + '&nbsp;&nbsp;&nbsp;</p>',
            FIND_PARTNER_INSTR + '.&nbsp;&nbsp;</p>',
            FIND_PARTNER_INSTR + '..&nbsp;</p>',
            FIND_PARTNER_INSTR + '...</p>',
        ],
        choices: [],
        timing_stim: [FIND_PARTNER_TIME/4, FIND_PARTNER_TIME/4, FIND_PARTNER_TIME/4, FIND_PARTNER_TIME/4],
        timing_response: FIND_PARTNER_TIME,
        response_ends_trial: false
    },
    {
        type: 'instructions',
        pages: [PARTNER_FOUND_INSTR],
        key_forward: 'space'
    },
    {
        type: 'multi-stim-multi-response',
        is_html: true,
        stimuli: [
            '<p>' + ASSIGN_ROLE_INSTR + '&nbsp;&nbsp;&nbsp;</p>',
            '<p>' + ASSIGN_ROLE_INSTR + '.&nbsp;&nbsp;</p>',
            '<p>' + ASSIGN_ROLE_INSTR + '..&nbsp;</p>',
            '<p>' + ASSIGN_ROLE_INSTR + '...</p>',
        ],
        choices: [],
        timing_stim: [ASSIGNING_ROLE_TIME/4, ASSIGNING_ROLE_TIME/4, ASSIGNING_ROLE_TIME/4, ASSIGNING_ROLE_TIME/4],
        timing_response: ASSIGNING_ROLE_TIME,
        response_ends_trial: false
    },
    {
        type: 'instructions',
        pages:
            [
                ROLE_ASSIGNED_INSTR + CONTINUE_INSTR,
                DUTY_INSTR[0] + CONTINUE_OR_BACK_INSTR,
                DUTY_INSTR[1] + CONTINUE_OR_BACK_INSTR,
                DUTY_INSTR[2] + CONTINUE_OR_BACK_INSTR
            ]
    }
]
