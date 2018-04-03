module.exports = (vm) =>{

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
