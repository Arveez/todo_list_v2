module.exports = (vm) =>{

    var conn = new WebSocket('ws://localhost:8080');

    conn.onopen = (e) => {
        vm.connected = true;
        console.log('connected')
    };

    conn.onmessage = (ev) => {

        var data = JSON.parse(ev.data);

        if (data['action'] === "reload") {
            window.location.href = window.location.origin + '/home';
        } else

        if (typeof data === "string") {
            window.location.href = window.location.origin + '/home/' + data;
        }

        if ( data['action'] === 'itemAdd') {

            vm.incomingItemAdd(data['data']);

        } else if  ( data['action'] === 'itemDelete' ) {

            let listName = data['data']['listName'];

            vm.items[listName].forEach( (item) => {
                if (item.id == data['data']['itemId']) {
                    vm.incomingItemRemove(vm.items[listName].indexOf(item), listName);
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
