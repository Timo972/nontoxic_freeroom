let chat = new Vue({
    el: '#app',
    data(){
        return {
            inputline: '',
            messages: [],
            commands: [
                {
                    cmd: 'tpr',
                    params: ['Username'],
                    desc: 'Request teleport'
                },
                {
                    cmd: 'join',
                    params: ['Username'],
                    desc: 'Request dimension join'
                }
            ],
            suggestions: [],
            show: false,
            typing: false,
            username: '',
            ranks: {
                admin: '#b03a2e!important',
                mod: '#ec7063',
                sup: '#2874a6',
                reg: '#f7dc6f',
                unreg: '#85929e',
                error: '#d35400',
                boradcast: '#48c9b0'
            },
            prefix: {
                admin: '[ADMIN]',
                mod: '[MOD]',
                sup: '[SUP]',
                reg: '[R]',
                unreg: '[U]',
                error: '[ERROR]',
                broadcast: '[G]'
            }
        }
    },
    methods: {
        setUsername: (uname)=>{
            chat.username = uname;
        },
        inputChange: ()=>{
            if(chat.inputline.charAt(0) == '/'){
                chat.suggestions = [];
                const cmd = chat.inputline.substring(1, chat.inputline.length).split(' ')[0];
                for(let i = 0; i < chat.commands.length; i++){
                    if(chat.commands[i].cmd.includes(cmd)){
                        chat.suggestions.push(i);
                    }
                }
            }else{
                chat.suggestions = [];
            }
        },
        autoComplete: ()=>{
            if(chat.suggestions.length < 1)return;
            const cmd = chat.commands[chat.suggestions[0]];
            if(cmd == undefined)return;
            chat.inputline = '/'+cmd.cmd+' ';
            chat.focus();
        },
        pushMsg: (owner, msg)=>{
            let c = 'msg stranger';
            if(owner == 'error'){
                owner = {
                    username:'',
                    rank: 'error'
                }
                c = 'msg error';
            }else if(owner == chat.username){
                c = 'msg own';
            }
            chat.messages.push({
                msg: msg,
                owner: owner,
                class: c
            });
        },
        getCmd: (string)=>{
            string = string.substring(1,string.length);
            const command = string.split(' ');
            let cmd = command.splice(0, 1)[0].toLowerCase();
            return [chat.commands.find(x=>x.cmd==cmd), command];
        },
        sendMsg: ()=>{
            if(chat.inputline.charAt(0) == '/'){
                const [cmd, params] = chat.getCmd(chat.inputline);
                if(cmd == undefined)return chat.pushMsg('error', 'Unknown command!');
                if(cmd.params.length != params.length)return chat.pushMsg('error', 'Invalid parameters!');
                alt.emit('chat:command', cmd.cmd, params);
                chat.inputline = '';
                chat.suggestions = [];
            }else{
                if(chat.inputline.length < 2)return;
                /*chat.pushMsg({
                    username: 'xTimo',
                    rank: 'admin'
                }, chat.inputline);*/
                alt.emit('chat:msg', chat.inputline);
                chat.inputline = '';
            }
        },
        registerCommands: (cmds)=>{
            chat.commands = JSON.parse(cmds);
        },
        addCommand: (cmd)=>{
            chat.commands.push(JSON.parse(cmd));
        },
        focus(){
            let myInput = document.getElementById('input');
            setTimeout(function() { 
                myInput.focus(); 
            }, 100);
            //this.$refs.inputline.focus();
        },
        toggle(val){
            if(chat.show && document.activeElement._prevClass=="inputline")return;
            if(val != null){
                chat.show = val;
            }else{
                chat.show = !chat.show;
            }
            if(chat.show === true)chat.focus();
            alt.emit('cursor', chat.show);
        },
        ready(){
            if(!'alt' in window)return;
            alt.on('command:register', chat.addCommand);
            alt.on('command:all', chat.registerCommands);
            alt.on('chat:msg', chat.pushMsg);
            alt.on('setup:username', chat.setUsername);
            alt.on('chat:toggle', chat.toggle);
            alt.emit('ready');
        }
    }
});
/*document.addEventListener('keydown', (e)=>{
    if(e.keyCode == 84){
        if(chat.show && document.activeElement._prevClass=="inputline")return;
        chat.toggle();
    }else if(e.keyCode == 27 && chat.show){
        chat.toggle(false);
    }
});*/
window.onload = chat.ready();