document.addEventListener('DOMContentLoaded', function () {

    var wsServer = function () {

        console.log('wsServer function called');
        var conn = new WebSocket('ws://localhost:8080');

        conn.onopen = function (e) {
            vm.connected = true;
        };
        conn.onmessage = function (ev) {
            vm.addArticle(JSON.parse(ev.data));
            console.log((ev.data));
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
            addArticle: function(article) {
                vm.articles.push(article)  ;
            },
            newArticle: function (event) {
                event.preventDefault();
                this.server.send(this.articleInput);
                this.articleInput = '';
            },
            removeArticle: function (el) {
                this.server.send(parseInt(el.target.id));
                el.target.remove();
            }
        },
        mounted: function () {
            this.server = wsServer();
            this.articles = JSON.parse(document.querySelector('#section1').getAttribute('data-initialArticles'));
        }
    });
});
