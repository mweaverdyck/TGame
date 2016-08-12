// Instruction texts
var INSTR_CONTINUE = '<p class="fixed-position-below small">' + 'Press right arrow to continue' + '</p>';
var INSTR_CONTINUE_OR_BACK = '<p class="fixed-position-below small">' + 'Press right arrow to continue, or left arrow to go back' + '</p>';

var INSTR_WELCOME = '<p class="center-content">' +
                'Welcome! We\'re studying how various factors, like the amount of reward that’s at stake, ' +
                'impact players\' enjoyment of simple online games.' +
                 '</p>'
var INSTR_FIND_PARTNER_INSTR = 'Please wait while we look for your partners...';
var INSTR_PARTNER_FOUND = '<p class="center-content">' + 'You are now connected to your study partners\' computers.<br/><br/>' +
                'Please press the space bar to find out your role.' + '</p>';

var INSTR_ASSIGN_ROLE = 'Assigning your role. Please wait...';

var INSTR_ROLE_ASSIGNED = '<p>' +
                'You have been assigned the role of: <b>Player 1</b><br/>' +
                '</p>';

var INSTR_WEBGAME = ['<p>' + 'You\'ll be playing a series of simple games with other people on this website.' + '</p>',
                '<p>' + 'This website is recently built for social gaming<br/>and currently being tested at college campuses nationwide.' + '</p>',
                '<p>' + 'The players you\'ll be partnered with today are members of our website who regularly use the site and its ' +
                'associated social network.' + '</p>',
                '<p>' + 'Players can choose their "Top 5" friends on the site, whose pictures are displayed alongside their own profile ' +
                'picture, like this:' + '</p>LIKE WHAT?',
                ];

var INSTR_GAME = ['<p>' + 'You\'ll be playing a series of simple games with other people.' + '</p>',
                '<p>' + 'You\'ll be using this new social gaming website that\'s currently being tested at college campuses nationwide.' + '</p>',
                '<p>' + 'The players you\'ll be partnered with today are members of our website who regularly use the site and its ' +
                'associated social network.' + '</p>'
                ];

var INSTR_WAIT = 'Waiting for the other players...'


var beginningInstructions = [
    {
        type: 'instructions',
        pages: [WELCOME_INSTR + INSTR_CONTINUE]
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
                ROLE_ASSIGNED_INSTR + INSTR_CONTINUE,
                DUTY_INSTR[0] + INSTR_CONTINUE_OR_BACK,
                DUTY_INSTR[1] + INSTR_CONTINUE_OR_BACK
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
        pages: ['<p>End of training</p>' + INSTR_CONTINUE]
    },
    {
        type: 'ready'
    }
]