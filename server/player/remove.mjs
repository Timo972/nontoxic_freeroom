import * as db from '../../db/main.mjs';

export const playerRemove = (player)=>{
    db.saveUser(player);
    if(player.data.car){
        player.data.car.destroy();
        player.data.car = null;
    }
    if(player.data.weapons){
        player.removeAllWeapons();
    }
}   