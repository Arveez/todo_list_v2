document.addEventListener('DOMContentLoaded', function () {

    var wsServer = function () {

        console.log('wsServer function called');

        var conn = new WebSocket('ws://localhost:8080');

        conn.onopen = function (e) {
            vm.connected = true;
            console.log('connected')
        };
        conn.onmessage = function (ev) {

            data = JSON.parse(ev.data);


            if (isNaN(data[0])) {
                vm.incomingArticleAdd(data);
            } else {
                vm.articles[data[1]].forEach(function (article) {

                    if (article.id == data[0]) {
                        vm.incomingArticleRemove(vm.articles[data[1]].indexOf(article), data[1]);
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

    names.forEach(function (name) {

        Vue.component(name, {
            template: `
        <div class="component">
                <div class="main_title">
                    <h1 class="listName">{{ listName }}</h1>
                </div>
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
                    this.$emit('to-parent-article-clicked', ev.target.id);
                },
                formSubmit() {
                    this.$emit('to-parent-form-submit', this.articleInput);
                }
            }
        });

    });

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
            nameIndex: 0,
            currentView: names[this.nameIndex],
        },
        methods: {
            previousList() {
                console.log("previous");
                this.nameIndex--;
                if (this.nameIndex == -1) {
                    this.nameIndex = names.length - 1;
                }
                console.log(this.nameIndex);
                this.currentView = names[this.nameIndex];
            },
            nextList() {
                console.log("next");
                this.nameIndex++;
                if (this.nameIndex == names.length) {
                    this.nameIndex = 0;
                }
                console.log(this.nameIndex);
                this.currentView = names[this.nameIndex];
            },
            articleDelete: function (id) {
                axios.get(window.location.origin
                    + '/delete/item/'
                    + id)
                    .then(response => {
                    });
                this.socketServer.send(JSON.stringify([id, this.currentView]));
            },
            incomingArticleRemove: function (indx, listName) {
                vm.articles[listName].splice(indx, 1);
            },
            articleCreate: function () {
                axios.get(window.location.origin
                    + '/add/itemlist/'
                    + this.currentView
                    + '/'
                    + this.articleInput)
                    .then(response => {
                        this.socketServer.send(JSON.stringify(response.data));
                    });
                this.articleInput = '';
            },
            incomingArticleAdd: function (article) {

                // TODO : fix issued on new list

                if (this.articles[article['listName']] == undefined) {

                    this.articles[article['listName']] = article['listName'];
                    this.articles[article['listName'][0]] = {'id': article['articleId'], 'name': article['articleName']}
                } else {
                    this.articles[article['listName']].push({
                        'id': article['articleId'],
                        'name': article['articleName']
                    });
                }
            }

        },
        mounted() {
            this.socketServer = wsServer();
            this.currentView = names[this.nameIndex]
        }
    });
});

