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
        conn.onclose = function () {
            vm.connected = false;
            console.log('disconnected');
        };
        return conn;
    };


    var listComponent = {
        template: `
        <div class="component">
            <header class="bar">
                <div class="corner">
                    <span v-if="connected" class=" plug fa fa-2x fa-plug"></span>
                </div>
                <div class="main_title">
                    <h1 class="">MY&nbsp;LIST</h1>
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
                            v-on:click="articleClicked"
                            >
                                {{ article.name }}
                        </li>
                    </ul>
                </div>
            </div>
            <footer class="bar">
                <form id="" class="el" v-on:submit.prevent="formSubmit">
                    <input id="articleInput"
                           v-model="articleInput"
                           v-bind:placeholder="placeHolder"
                           v-bind:style="focusStyle">
                </form>
                <span id="resetCross" class="el  fa fa-3x fa-times"></span>
            </footer>
        </div>
        `,
        props: [
            'connected',
            'articleInput',
            'focusStyle',
            'placeHolder',
            'articles'
        ],
        methods: {
            articleClicked(ev) {
                console.log('comp: article clicked ; id : ' + ev.target.id);
                this.$emit('to-parent-article-clicked', ev.target.id);
            },
            formSubmit(){
                this.$emit('to-parent-form-submit', this.articleInput);
                console.log(this.articleInput);
            }
        }
    };



    Vue.config.devtools = true;
    var vm = new Vue({
        el: '#page_bloc',
        delimiters: ['${', '}'],
        components: {
            'list-component': listComponent
        },
        data: {
            connected: false,
            articleInput: 'NULL',
            focusStyle: {
                autofocus: 'autofocus'
            },
            placeHolder: 'Ajoutez...',
            articles: [],
            socketServer: 'NULL'
        },
        methods: {
            articleDelete: function (id) {
                console.log('parent : articleclicked ' + id  );
                this.socketServer.send(id);
            },
            incomingArticleRemove: function (indx) {
                console.log(indx);
                vm.articles.splice(indx, 1);
            },
            articleCreate: function (name) {
                this.socketServer.send(name);
                this.articleInput = '';
            },
            incomingArticleAdd: function(article) {
                vm.articles.push(article)  ;
            }
        },
        mounted() {
            console.log('mounted');
            this.socketServer = wsServer();
            this.articles = JSON.parse(document.querySelector('#page_bloc').getAttribute('data-initialArticles'));
            console.log (JSON.parse(document.querySelector('#page_bloc').getAttribute('data-initialArticles')));
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
