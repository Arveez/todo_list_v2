import Vue from 'vue';
import axios from 'axios';
import Vue2TouchEvents from 'vue2-touch-events';

Vue.use(Vue2TouchEvents);


const wsServer = require('./wsServer');

const names = JSON.parse(
    document.querySelector(
        '#page_bloc'
    ).getAttribute(
        'data-list_names'
    )
);
const lists = JSON.parse(
    document.querySelector(
        '#page_bloc'
    ).getAttribute(
        'data-lists'
    )
);
const userId = document.querySelector(
    '#page_bloc'
).getAttribute(
    'data-user_id'
);
console.log('user id : ' + userId);

names.forEach((name) => {

    Vue.component(name, {
        template: `
        <section  class="component"
            v-touch:swipe.left="leftClicked"
            v-touch:swipe.right="rightClicked">
                <div class="list_title">
                    <h1 class="listName">{{ listName.substring(5) }}</h1>
                    <p v-on:click="trashClicked"><span  class="fa fa-2x fa-trash-alt hoverable"></span></p>
                </div>
                <div class="arrows">
                    <p v-on:click="leftClicked"  class="arrow hoverable" id="left"><span class="fa fa-2x fa-arrow-left"></span></p>
                    <p v-on:click="rightClicked" class="arrow hoverable" id="right"><span class="fa fa-2x fa-arrow-right"></span></p>
                </div>
                <div class="item_list">
                    <ul>
                        <li v-for="(item) of items" 
                            v-bind:id="item.id"
                            v-on:click="itemClicked">
                                {{ item.name }}
                        </li>
                    </ul>
                </div>
        </section>
        `,
        props: [
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
            }
            ,
            rightClicked() {
                this.$emit('to-parent-right-clicked')
            }
            ,
            trashClicked() {
                this.$emit('to-parent-trash-clicked')
            }
            ,
            itemClicked(ev) {
                this.$emit('to-parent-item-clicked', ev.target.id);
            }
            ,
            formSubmit() {
                this.$emit('to-parent-form-submit', this.itemInput);
            }
        }
    })
    ;

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
        noList: 'NULL',
        socketServer: 'NULL',
        lists,
        componentsNames: names,
        nameIndex: 0,
        currentView: 'NULL'
    },
    methods: {
        menuToggle() {
            this.openMenu = this.openMenu ? false : true;
        },
        previousList() {
            this.nameIndex--;
            if (this.nameIndex === -1) {
                this.nameIndex = this.componentsNames.length - 1;
            }
            this.currentView = this.componentsNames[this.nameIndex];
        },
        initialMessage() {
            this.socketServer.send(JSON.stringify({
                action: 'initial',
                userId: userId
            }));
        },
        nextList() {
            this.nameIndex++;
            if (this.nameIndex === this.componentsNames.length) {
                this.nameIndex = 0;
            }
            this.currentView = this.componentsNames[this.nameIndex];
        },
        listDelete() {
            axios.post(window.location.origin
                + '/itemList/delete/'
                + this.currentView
            ).then(() => {
                this.socketServer.send(JSON.stringify({
                    action: 'reload',
                    userId
                }));
            });
        },
        listAdd(e) {
            axios.post(window.location.origin
                + '/itemList/add/list_'
                + e.target[0].value
            ).then((response) => {
                console.log("list to add : " + response.data);
                this.socketServer.send(JSON.stringify({
                    action: 'redirect',
                    data: {
                        newListName: response.data
                    },
                    userId
                }))
            });
        },
        itemDelete(id) {
            axios.post(window.location.origin
                + '/item/delete/'
                + id)
                .then((response) => {
                    console.log('todel : ' + response.data);
                    this.socketServer.send(JSON.stringify({
                        action: 'itemDelete',
                        data: {
                            listName: this.currentView,
                            itemId: id,
                        },
                        userId
                    }))
                })
        },
        itemAdd: function () {
            axios.post(window.location.origin
                + '/item/add/'
                + this.currentView
                + '/'
                + this.itemInput)
                .then((response) => {
                    this.socketServer.send(JSON.stringify({
                        action: 'itemAdd',
                        data: response.data,
                        userId
                    }));
                });
            this.itemInput = '';
        },
        incomingItemRemove(index, listName) {
            vm.lists[listName].splice(index, 1);
        },
        incomingItemAdd(item) {
            this.lists[item['listName']].push({
                'id': item['itemId'],
                'name': item['itemName']
            });
        }

    },
    mounted() {
        this.socketServer = wsServer(this);
        let currentViewInUrl = window.location.pathname.split('/')[2];
        this.currentView = currentViewInUrl ? currentViewInUrl : this.componentsNames[this.nameIndex];
        this.noList = this.lists.length === 0;
    }
});

