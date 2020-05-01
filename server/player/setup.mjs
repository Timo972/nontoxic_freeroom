import * as alt from 'alt';
import * as db from '../../db/main.mjs';
import {load} from './load.mjs';
import * as chat from '../chat/chat.mjs';

export const playerSetup = (player)=>{
    load(player);
    setTimeout(()=>{
        alt.emitClient(player, 'player:spawned');
        alt.log('Player: ' + player.name + ' succesfully spawned!');
    }, 2000);
    chat.setup(player);
    player.save = ()=>{
        if(player.data.car != null){
            player.data.savedCar = {
                model: player.data.car.model,
                pos: player.data.car.pos,
                rot: player.data.car.rot
            }
        }
        if(player.data.weapons != null){
            player.data.weapons = Array.from(player.data.weapons.entries());
        }
        player.data.car = null;
        db.saveUser(player);
    }
    player.switchDimension = (newDim)=>{
        if(player.data.car != null){
            player.data.car.dimension = newDim;
        }
        alt.Player.all.filter(x=>x.dimension == player.dimension).forEach((oldmates)=>{
            if(oldmates.id == player.id)return;
            alt.emitClient(oldmates, 'dim:left', player);
        });
        player.dimension = newDim;
        alt.Player.all.filter(x=>x.dimension == player.dimension).forEach((mates)=>{
            if(mates.id == player.id)return;
            alt.emitClient(mates, 'dim:entered', player);
        });
        alt.emitClient(player, 'dim:iamnew');
    }
    player.setSyncedMeta('rank', 'UNREG');
    player.settedup = true;
}   