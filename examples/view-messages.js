ns.View.define('messages', {
    models: ['messages'],
    methods: {
        refresh: function() {
            this.getModel('messages').refresh();
        }
    }
}, ns.ViewRivets);
