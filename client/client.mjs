import * as alt from 'alt';
import * as native from 'natives';
import './chat/chat';
import './map/map';
import './train/train';
import './menu/main';
import './hotkeys';
import './phone'

alt.on('connectionComplete', ()=>{
    native.switchOutPlayer(alt.Player.local.scriptID, 0, 1);
    native.setEnableScuba(alt.Player.local.scriptID, true);
    alt.emitServer('player:spawn');
});

alt.onServer('player:spawned', ()=>{
    native.switchInPlayer(alt.Player.local.scriptID);
});

alt.on('resourceStop', ()=>{
    native.switchOutPlayer(alt.Player.local.scriptID, 0, 1);
});