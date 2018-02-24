document.addEventListener('DOMContentLoaded', function () {

    var wsServer = function () {

        console.log('wsServer function called');
        var conn = new WebSocket('ws://localhost:8080');

        conn.onopen = function (e) {
            vm.connected = true;
            console.log('connected')
        };
        conn.onmessage = function (ev) {

            if (isNaN(ev.data)) {
                vm.incomingArticleAdd(JSON.parse(ev.data));

            } else {

                vm.articles.forEach(function (article) {

                   if (article.id == ev.data) {
                       vm.incomingArticleRemove(vm.articles.indexOf(article));
                       return true;
                   }

                })
            }
        };
        conn.onclose = function() {
            vm.connected = false;
            console.log('disconnected');
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
            incomingArticleAdd: function(article) {
                vm.articles.push(article)  ;
            },
            articleCreate: function (event) {
                event.preventDefault();
                this.server.send(this.articleInput);
                this.articleInput = '';
            },
            articleDelete: function (el) {
                this.server.send(parseInt(el.target.id));
            },
            incomingArticleRemove: function (indx) {
                console.log(indx);
                vm.articles.splice(indx, 1);
            }

        },
        mounted: function () {
            this.server = wsServer();
            this.articles = JSON.parse(document.querySelector('#section1').getAttribute('data-initialArticles'));
        }
    });
});
