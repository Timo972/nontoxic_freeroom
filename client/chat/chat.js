import * as alt from 'alt';
import * as native from 'natives';
import * as menu from '../menu/main';

let chat = null;
let ready = false;
let commands = null;
let disabled = false;

export let open = false;

alt.on('resourceStart', ()=>{
    alt.log('loading: chat.js');
    chat = new alt.WebView('http://resource/client/views/chat-view/index.html');
    chat.on('ready', ()=>{
        ready = true;
	alt.setTimeout(()=>{
        if(commands){
            alt.log('registering commands');
	    chat.emit('command:all', commands);
        }},5000);
        chat.emit('setup:username', alt.Player.local.name);
    });
    chat.on('chat:command', (cmd, data)=>{
        alt.emitServer('chat:command:'+cmd, data);
    });
    chat.on('chat:msg', (msg)=>{
        alt.emitServer('chat:msg:send', msg);
    });
    chat.on('cursor', stat=>{
        alt.showCursor(stat);
        alt.toggleGameControls(!stat);
        disabled = stat;
        stat?chat.focus():chat.unfocus();
        open = stat;
    });
});

alt.onServer('chat:commands', (cmds)=>{
    commands = cmds;
    alt.log('got commands: ' + cmds);
});

alt.onServer('chat:msg:get', (owner, msg)=>{
    if(!ready || chat == null)return;
    chat.emit('chat:msg', owner, msg);
});

alt.on('keydown', (key)=>{
    if(chat == null)return;
    if(key == 84 && !menu.isVisible()){
        chat.emit('chat:toggle');
    }else if(key == 27 && chat.show && chat){
        chat.emit('chat:toggle', false);
    }
}); 

alt.everyTick(()=>{
    if(disabled){
        native.disableControlAction(3, 200, true);
    }
});
