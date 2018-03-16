document.addEventListener('DOMContentLoaded', function () {

    var wsServer = function () {

        console.log('wsServer function called');

        var conn = new WebSocket('ws://localhost:8080');

        conn.onopen = function (e) {
            vm.connected = true;
            console.log('connected')
        };
        conn.onmessage = function (ev) {

            // TODO : separate delete from add

            console.log('message revenu du serveur');
            console.log(ev.data);
            if (isNaN(ev.data)) {
                vm.incomingArticleAdd(JSON.parse(ev.data));
            }
/*            } else {

                vm.articles.forEach(function (article) {

                    if (article.id == ev.data) {
                        vm.incomingArticleRemove(vm.articles.indexOf(article));
                        return true;
                    }

                })
            }*/
        };
        conn.onclose = function () {
            vm.connected = false;
            console.log('disconnected');
        };
        return conn;
    };

    var components = [];

    var names = JSON.parse(
        document.querySelector(
            '#page_bloc'
        ).getAttribute(
            'data-list_names'
        )
    );
    var lists = JSON.parse(
        document.querySelector(
            '#page_bloc'
        ).getAttribute(
            'data-lists'
        )
    );
    console.log('names : ');
    console.log(names);
    console.log('lists : ' );
    console.log(lists["sillac"][1]);

    names.forEach(function (name) {

        articles = name.data;
        console.log(articles);

        Vue.component(name, {
            template: `
        <div class="component">
            <header class="bar">
                <div class="corner">
                    <span v-if="connected == true" class="plug fa fa-2x fa-plug"></span>
                    <span v-else>bop</span>
                </div>
                <div class="main_title">
                    <h1 class="">{{ listName }}</h1>
                </div>
                <div class="corner menu ">
                    <span class="fa fa-2x fa-bars"></span>
                </div>
            </header>
            <div class="list_section">
                <div class="article_list">
                    <ul>
                        <li v-for="(article, key) of articles" 
                            v-bind:id="article.id"
                            v-on:click="articleClicked">
                                {{ article.name }}
                        </li>
                    </ul>
                </div>
            </div>

        </div>
        `,
            props: [
                'connected',
                'articles',
            ],
            data() {
                return {
                    'listName': name
                }
            },
            methods: {
                articleClicked(ev) {
                    console.log('comp: article clicked ; id : ' + ev.target.id);
                    this.$emit('to-parent-article-clicked', ev.target.id);
                },
                formSubmit() {
                    this.$emit('to-parent-form-submit', this.articleInput);
                    console.log(this.articleInput);
                }
            }
        });

    });
    console.log(components);

    Vue.config.devtools = true;
    var vm = new Vue({
        el: '#page_bloc',
        delimiters: ['${', '}'],
        data: {
            connected: false,
            articleInput: '',
            focusStyle: {
                autofocus: 'autofocus'
            },
            placeHolder: 'Ajoutez...',
            articles: lists,
            socketServer: 'NULL',
            componentsNames: names,
            currentView: names[1],
        },
        methods: {
            articleDelete: function (id) {
                console.log(window.location);
                axios.get(window.location.origin
                    + '/delete/item/'
                    + id).then(response => {
                        console.log("retour ajac delete");
                        console.log(response);
                });
                console.log('parent : articleclicked ' + id);
                this.socketServer.send(JSON.stringify([this.currentView, id]));
            },
            incomingArticleRemove: function (indx) {
                console.log(indx);
                vm.articles.splice(indx, 1);
            },
            articleCreate: function () {
                console.log(window.location.href);
                axios.get(window.location.origin
                    + '/add/itemlist/'
                    + this.currentView
                    + '/'
                    + this.articleInput)
                    .then(response => {
                        console.log("ajax returns : ");
                        console.log(response.data);
                        this.socketServer.send(JSON.stringify(response.data));
                    });
                this.articleInput = '';
            },
            incomingArticleAdd: function (article) {
                console.log(article);
                console.log(this.articles);
                this.articles[article['listName']].push({'id' : article['articleId'], 'name' : article['articleName']});
                //vm.articles.push(article);
            }
        },
        mounted() {
            console.log('mounted');
            this.socketServer = wsServer();
            //this.articles = JSON.parse(document.querySelector('#page_bloc').getAttribute('data-initialArticles'));
            //console.log(JSON.parse(document.querySelector('#page_bloc').getAttribute('data-initialArticles')));
        }
    });
});
/*        el: '#section1',
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
        }*/
