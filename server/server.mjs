import * as alt from 'alt';
import './events';
import './web/index.mjs';
import './chat/commands.mjs';
import {playerSetup} from './player/setup.mjs';
import {playerRemove} from './player/remove.mjs';

alt.onClient('player:spawn', (player)=>{
    player.spawn(0,0,76,0);
    player.model = 'u_m_y_abner';
    player.dimension = player.id;
    playerSetup(player);
});

alt.on('resourceStart', ()=>{
    alt.Player.all.forEach(player=>{
        player.spawn(0,0,76,0);
        player.model = 'u_m_y_abner';
        player.dimension = player.id;
        playerSetup(player);
    });
});

alt.on('resourceStop', ()=>{
    alt.Player.all.forEach(player=>{
        playerRemove(player);
    });
});

process.on('beforeExit', (code)=>{
    alt.Player.all.forEach(player => {
        if(!player.settedup)return;
        player.save();
        alt.log('saved ' + player.name);
    });
    alt.log('exeting with code: ' + code);
});