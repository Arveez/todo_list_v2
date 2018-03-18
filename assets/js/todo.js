import Vue from 'vue';
import axios from 'axios';


    var wsServer = function () {

        var conn = new WebSocket('ws://localhost:8080');

        conn.onopen = (e) => {
            vm.connected = true;
            console.log('connected')
        };
        conn.onmessage = (ev) => {
            var data = JSON.parse(ev.data);

            if (isNaN(data[0])) {
                vm.incomingItemAdd(data);
            } else {
                vm.items[data[1]].forEach( (item) => {

                    if (item.id == data[0]) {
                        vm.incomingItemRemove(vm.items[data[1]].indexOf(item), data[1]);
                        return true;
                    }

                })
            }
        };
        conn.onclose = () => {
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

    names.forEach( (name) => {

        Vue.component(name, {
            template: `
        <div class="component">
                <div class="main_title">
                    <h1 class="listName">{{ listName }}</h1>
                </div>
            <div class="list_section">
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
            connected: false,
            itemInput: '',
            focusStyle: {
                autofocus: 'autofocus'
            },
            placeHolder: 'Ajoutez...',
            items: lists,
            socketServer: 'NULL',
            componentsNames: names,
            nameIndex: 0,
            currentView: names[this.nameIndex],
        },
        methods: {
            previousList() {

                this.nameIndex--;
                if (this.nameIndex == -1) {
                    this.nameIndex = names.length - 1;
                }

                this.currentView = names[this.nameIndex];
            },
            nextList() {

                this.nameIndex++;
                if (this.nameIndex == names.length) {
                    this.nameIndex = 0;
                }

                this.currentView = names[this.nameIndex];
            },
            itemDelete (id) {
                axios.get(window.location.origin
                    + '/delete/item/'
                    + id)
                    .then( (response) => {
                    });
                this.socketServer.send(JSON.stringify([id, this.currentView]));
            },
            incomingItemRemove (indx, listName) {
                vm.items[listName].splice(indx, 1);
            },
            itemCreate: function () {
                axios.get(window.location.origin
                    + '/add/itemlist/'
                    + this.currentView
                    + '/'
                    + this.itemInput)
                    .then( (response) => {
                        this.socketServer.send(JSON.stringify(response.data));
                    });
                this.itemInput = '';
            },
            incomingItemAdd (item) {

                // TODO : fix issued on new list

                if (this.items[item['listName']] == undefined) {

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
            this.socketServer = wsServer();
            this.currentView = names[this.nameIndex]
        }
    });

