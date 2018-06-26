module.exports = (vm) => {

    const conn = new WebSocket('ws://localhost:8080');

    conn.onopen = () => {
        vm.connected = true;
    };

    conn.onmessage = (e) => {

        let data = JSON.parse(e.data);

        switch (data['action']) {
            case "reload":
                window.location.href = window.location.origin + '/home';
                break;
            case "redirect":
                window.location.href = window.location.origin + '/home/' + data['data']['newListName'];
                break;
            case "itemAdd":
                vm.incomingItemAdd(data['data']);
                break;
            case "itemDelete":
                let listName = data['data']['listName'];

                vm.lists[listName].forEach((item) => {

                    if (item.id == data['data']['itemId']) {

                        vm.incomingItemRemove(vm.lists[listName].indexOf(item), listName);
                        return true;
                    }

                });
                break;
        }
    };
    conn.onclose = () => {
        vm.connected = false;
        console.log('disconnected');
    };
    return conn;
};
