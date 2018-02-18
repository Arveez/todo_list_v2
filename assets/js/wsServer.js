$(function () {

    wsServer = function () {
        console.log('wsServer');
        var conn = new WebSocket('ws://localhost:8080');
        console.log(conn);
        conn.onopen = function (e) {
            console.log("connection auuu serveur");
            vm.data.connected = true;
        };
        conn.onmessage = function (ev) {
            console.log("message reçu");
        };
        conn.onclose = function () {
            vm.connected = false;
        }
    };
    wsServer();
});
