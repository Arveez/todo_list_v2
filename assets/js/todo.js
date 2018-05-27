import Vue from 'vue';
import axios from 'axios';
import Vue2TouchEvents from 'vue2-touch-events';

Vue.use(Vue2TouchEvents);


var wsServer = require('./wsServer');

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
console.log(lists);

names.forEach((name) => {

    Vue.component(name, {
        template: `
        <section  class="component"
            v-touch:swipe.left="leftClicked"
            v-touch:swipe.right="rightClicked">
                <div class="list_title">
                    <h1 class="listName">{{ listName.substring(5) }}</h1>
                    <p v-on:click="crossClicked"><span  class="fa fa-2x fa-trash-alt hoverable"></span></p>
                </div>
                <div class="arrows">
                    <p v-on:click="leftClicked"  class="arrow hoverable" id="left"><span class="fa fa-2x fa-arrow-left"></span></p>
                    <p v-on:click="rightClicked" class="arrow hoverable" id="right"><span class="fa fa-2x fa-arrow-right"></span></p>
                </div>
                <div class="item_list">
                    <ul>
                        <li v-for="(item, key) of items" 
                            v-bind:id="item.id"
                            v-on:click="itemClicked">
                                {{ item.name }} 
                        </li>
                    </ul>
                </div>
        </section>
        `,
        props: [
            'connected',
            'items',
        ],
        data() {
            return {
                'listName': name
            }
        },
        methods: {
            leftClicked() {
                this.$emit('to-parent-left-clicked')
            },
            rightClicked() {
                this.$emit('to-parent-right-clicked')
            },
            crossClicked() {
                this.$emit('to-parent-cross-clicked')
            },
            itemClicked(ev) {
                this.$emit('to-parent-item-clicked', ev.target.id);
            },
            formSubmit() {
                this.$emit('to-parent-form-submit', this.itemInput);
            }
        }
    });

});

Vue.config.devtools = true;
var vm = new Vue({
    el: '#page_bloc',
    delimiters: ['${', '}'],
    data: {
        openMenu: false,
        connected: false,
        itemInput: '',
        placeHolder: 'Ajoutez...',
        items: lists,
        noList: '',
        socketServer: 'NULL',
        componentsNames: names,
        nameIndex: 0,
        currentView: names[this.nameIndex],
    },
    watch: {
        connected: function () {
            console.log('connnect change');
        }
    },
    methods: {
        menuToggle() {
            if (this.openMenu === false) {
                this.openMenu = true;
            } else {
                this.openMenu = false;
            }
        },
        previousList() {
            this.nameIndex--;
            if (this.nameIndex === -1) {
                this.nameIndex = names.length - 1;
            }

            this.currentView = names[this.nameIndex];
        },
        nextList() {
            this.nameIndex++;
            if (this.nameIndex === names.length) {
                this.nameIndex = 0;
            }

            this.currentView = names[this.nameIndex];
        },
        listDelete() {
            axios.put(window.location.origin
                + '/itemList/delete/'
                + this.currentView
            ).then(() => {
                this.socketServer.send(JSON.stringify({action: 'reload'}));
            });
        },
        listAdd(e) {
            axios.put(window.location.origin
                + '/itemList/add/list_'
                + e.target[0].value
            ).then((response) => {
                console.log("list to add : " + response.data);
                this.socketServer.send(JSON.stringify({
                    action: 'redirect',
                    data: {
                        newListName: response.data
                    }
                }))
            });
        },
        itemDelete(id) {
            axios.put(window.location.origin
                + '/item/delete/'
                + id)
                .then((response) => {
                    console.log('todel : ' + response.data);
                    this.socketServer.send(JSON.stringify({
                        action: 'itemDelete',
                        data: {
                            listName: this.currentView,
                            itemId: id
                        }
                    }))
                })
        },
        itemAdd: function () {
            axios.put(window.location.origin
                + '/item/add/'
                + this.currentView
                + '/'
                + this.itemInput)
                .then((response) => {
                    this.socketServer.send(JSON.stringify({
                        action: 'itemAdd',
                        data: response.data
                    }));
                });
            this.itemInput = '';
        },
        incomingItemRemove(indx, listName) {
            vm.items[listName].splice(indx, 1);
        },
        incomingItemAdd(item) {
            if (this.items[item['listName']] === undefined) {

                this.items[item['listName']] = item['listName'];
                this.items[item['listName'][0]] = {'id': item['itemId'], 'name': item['itemName']}
            } else {
                this.items[item['listName']].push({
                    'id': item['itemId'],
                    'name': item['itemName']
                });
            }
        }

    },
    mounted() {
        this.socketServer = wsServer(this);
        let currentViewInUrl = window.location.pathname.split('/');
        this.currentView = currentViewInUrl[2] ? currentViewInUrl[2] : names[this.nameIndex];
        this.noList = this.items.length === 0;
    }
});

