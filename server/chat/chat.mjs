import * as alt from 'alt';

let registeredCommands = [];
export const setup = (player)=>{
    alt.log('sending commands to player: ' + JSON.stringify(registeredCommands));
    alt.emitClient(player, 'chat:commands', JSON.stringify(registeredCommands))
}

export const registerCmd = (cmd, callback, requiredParams, desc)=>{
    registeredCommands.push({cmd: cmd, params: requiredParams, desc: desc});
    alt.onClient('chat:command:'+cmd, callback);
    alt.log('registered cmd: ' + cmd);
}

export const send = (player, msg)=>{
    alt.emitClient(player, 'chat:msg:get', {
        username: 'SERVER',
        rank: 'admin'
    }, msg);
}

export const broadcast = (msg)=>{
    alt.emitClient(null, 'chat:msg:get', {
        username: 'SERVER',
        rank: 'broadcast'
    }, msg);
}

alt.onClient('chat:msg:send', (player, message)=>{
    alt.emitClient(null, 'chat:msg:get', {
        username: player.name,
        rank: player.data.rank||'broadcast'
    }, message);
});
