module.exports = (vm) => {

    const conn = new WebSocket('ws://dev.arveez-news.com:8080');

    conn.onopen = (e) => {
        vm.connected = true;
        console.log('connected')
    };

    conn.onmessage = (ev) => {

        let data = JSON.parse(ev.data);

        if (data['action'] === "reload") {
            window.location.href = window.location.origin + '/home';
        }
        if (data['action'] === "redirect") {
            window.location.href = window.location.origin + '/home/' + data['data']['newListName'];
        }

        if (data['action'] === 'itemAdd') {

            vm.incomingItemAdd(data['data']);

        } else if (data['action'] === 'itemDelete') {

            let listName = data['data']['listName'];

            vm.items[listName].forEach((item) => {

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
