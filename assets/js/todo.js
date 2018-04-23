import Vue from 'vue';
import axios from 'axios';


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
        <div class="component">
                <div class="main_title">
                    <h1 class="listName">{{ listName }}</h1>
                    <p v-on:click="crossClicked"><span  class="fa fa-2x fa-trash-alt"></span></p>
                </div>
                <div class="arrows">
                    <p v-on:click="leftClicked" id="left"><<</p>
                    <p v-on:click="rightClicked" id="right">>></p>
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
        </div>
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
        listDelete() {
            window.location.href = window.location.origin + '/itemList/delete/' + this.currentView;
        },
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
        itemDelete(id) {
            axios.get(window.location.origin
                + '/item/delete/item/'
                + id)
                .then((response) => {
                });
            this.socketServer.send(JSON.stringify([id, this.currentView]));
        },
        itemCreate: function () {
            axios.get(window.location.origin
                + '/item/add/'
                + this.currentView
                + '/'
                + this.itemInput)
                .then((response) => {
                    this.socketServer.send(JSON.stringify(response.data));
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
        this.noList =  this.items.length === 0;
    }
});

