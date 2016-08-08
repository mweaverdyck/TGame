// Instruction texts
var CONTINUE_INSTR = '<p class="fixed-position-below small">' + 'Press right arrow to continue' + '</p>';
var CONTINUE_OR_BACK_INSTR = '<p class="fixed-position-below small">' + 'Press right arrow to continue, or left arrow to go back' + '</p>';

var WELCOME_INSTR = '<p class="center-content">' + 'Welcome to the study!' + '<br/><br/></p>'
var FIND_PARTNER_INSTR = 'Please wait while we look for your partners...';
var PARTNER_FOUND_INSTR = '<p class="center-content">' + 'You are now connected to your study partners\' computers.<br/><br/>' +
                'Please press the space bar to find out your role.' + '</p>';

var ASSIGN_ROLE_INSTR = 'Assigning your role. Please wait...';

var ROLE_ASSIGNED_INSTR = '<p>' +
                'You have been assigned the role of: <b>Player 1</b><br/>' +
                '</p>';

var DUTY_INSTR = [
                    '<p>' + 'As Player 1, you will do stuff and make $$$...' + '</p>',
                    '<p>' + 'And here are some more incomplete instructions.' + '</p>'
                ];

var WAIT_INSTR = 'Waiting for other players...'


var beginningInstructions = [
    {
        type: 'instructions',
        pages: [WELCOME_INSTR + CONTINUE_INSTR]
    },
    {
        type: 'timed-instr',
        text: FIND_PARTNER_INSTR,
        time_min: 1000,
        time_max: 2000
    },
    {
        type: 'instructions',
        pages: [PARTNER_FOUND_INSTR],
        key_forward: 'space'
    },
    {
        type: 'timed-instr',
        text: ASSIGN_ROLE_INSTR,
        time_min: 1000,
        time_max: 2000
    },
    {
        type: 'instructions',
        pages:
            [
                ROLE_ASSIGNED_INSTR + CONTINUE_INSTR,
                DUTY_INSTR[0] + CONTINUE_OR_BACK_INSTR,
                DUTY_INSTR[1] + CONTINUE_OR_BACK_INSTR
            ]
    }
];


var waitScreen = {
    type: 'timed-instr',
    text: WAIT_INSTR,
    time_min: 1000,
    time_max: 2000
};

var middleInstructions = [
    {
        type: 'instructions',
        pages: ['<p>End of training</p>' + CONTINUE_INSTR]
    },
    {
        type: 'ready'
    }
]