document.addEventListener('DOMContentLoaded', function () {

    var wsServer = function () {

        console.log('wsServer function called');
        var conn = new WebSocket('ws://localhost:8080');
        conn.onopen = function (e) {
            conn.send("connection auuu serveur");
            vm.connected = true;

        };
        conn.onmessage = function (ev) {
            console.log(ev);
        };
        conn.onclose = function() {
            vm.connected = false;
        };
        return conn;
    };

    var vm = new Vue({
        delimiters: ['${', '}'],
        el: '#section1',
        data: {
            articleInput: '',
            placeHolder: 'entrez un article',
            articles: [],
            connected: false,
            server: '',
            myStyle: {
                autofocus: 'autofocus'
            }
        },
        methods: {
            newArticle: function (event) {
                this.server.send(this.articleInput);
                event.preventDefault();
            },
            removeArticle: function (el) {
                this.server.send(el.target.id);
                el.target.remove();
            }
        },
        mounted: function () {
            this.server = wsServer();
            this.articles = JSON.parse(document.querySelector('#section1').getAttribute('data-initialArticles'));
            console.log(JSON.parse(document.querySelector('#section1').getAttribute('data-initialArticles')));
        }
    });
});
