var defaults = {
    expanded: true,
    messages: [
        {
            id: 1,
            title: '[Dribbble] Work Inquiry from Google Inc.',
            participants: ['Dribbble'],
            date: 'Today, 11:01 PM',
            starred: true,
            fresh: true
        },
        {
            id: 2,
            title: 'Encide needs more inviters',
            participants: ['Tim Silva', 'me'],
            date: 'Today, 05:31 PM',
            count: 6
        },
        {
            id: 3,
            title: 'Job Proposal in Norway',
            participants: ['Daniel Sandvik', 'me'],
            date: 'Yesterday, 09:06 PM',
            count: 81
        },
        {
            id: 4,
            title: 'Someone Followed You',
            participants: ['Twitter'],
            date: 'Nov 21',
            tags: ['tag']
        }
    ]
};

var next = [
    [
        ns.Model.get('message', { id: 5 }).setData({
            id: 5,
            title: 'Need some feedback please!',
            participants: ['Maria Sharapova'],
            date: 'Today, 15:30 PM',
            fresh: true
        }),
        ns.Model.get('message', { id: 6 }).setData({
            id: 6,
            title: 'Congratulations! You have received a Daily Deviation',
            participants: ['deviantART'],
            date: 'Today, 15:24 PM',
            fresh: true
        })
    ],
    [
        ns.Model.get('message', { id: 7 }).setData({
            id: 7,
            title: 'You have 1 unread message',
            participants: ['ZWAME'],
            date: 'Today, 18:30 PM',
            fresh: true
        }),
        ns.Model.get('message', { id: 8 }).setData({
            id: 8,
            title: 'You hear that Mr.Anderson?',
            participants: ['Agent Smith'],
            date: 'Today, 16:56 PM',
            fresh: true
        }),
        ns.Model.get('message', { id: 9 }).setData({
            id: 9,
            title: 'New Case Studies',
            participants: ['Travis Bickle', 'me'],
            date: 'Today, 16:45 PM',
            tags: ['clients', 'p'],
            count: 6,
            fresh: true
        })
    ]
];

ns.Model.define('messages', {
    split: {
        model_id: 'message',
        items: '.messages',
        params: {
            id: '.id'
        }
    },
    methods: {
        _init: function() {
            this.super_._init.apply(this, arguments);
            this.setData(defaults);
        },
        refresh: function() {
            var messages = next.shift();

            if (messages) {
                this.set('.loading', true);

                setTimeout(function() {
                    this.insert(messages, 0);
                    this.set('.loading', false);
                }.bind(this), 500);
            }
        }
    }
});
