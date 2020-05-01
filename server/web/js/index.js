new Vue({
    el: '#app',
    data(){
        return {
            test: 'test',
            socket: io()
        }
    },
    mounted: {
        connect()
    },
    methods: {
        connect(){
            socket.on('connect', function(data) {
                socket.emit('join', 'Hello World from client');
            });
        }
    }
})