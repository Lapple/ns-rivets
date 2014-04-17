ns.View.define('messages', {
    models: {
        messages: false
    },
    methods: {
        refresh: function() {
            this.getModel('messages').refresh();
        }
    }
}, ns.ViewRivets);
