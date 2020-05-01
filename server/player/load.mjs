import * as db from '../../db/main.mjs';
import * as alt from 'alt';

export const load = (player)=>{
    const data = db.loadUser(player);
    if(data == undefined || data == {}){
        player.data = {
            rank: 'unreg'
        };
        return false;
    }
    player.pos = data[0];
    player.rot = data[1];
    player.health = data[2];
    player.armour = data[3];
    player.model = data[4];
    player.data = data[5];
    if(player.data.savedCar){
    if(player.data.savedCar.pos){
        player.data.car = new alt.Vehicle(player.data.savedCar.model, player.data.savedCar.pos.x, player.data.savedCar.pos.y, player.data.savedCar.pos.z, 0, 0, player.data.savedCar.rot.z);
        player.data.car.dimension = player.dimension;
        alt.emitClient(player, 'player:vehicle:create', player.data.car);
    }}
    player.data.weapons = new Map(player.data.weapons);
    if(player.data.weapons){
        player.data.weapons.forEach((weap,key)=>{
            alt.log('giving weapon: ' + key);
            player.giveWeapon(key, weap.ammo, false);
        });
    }
    return true;
}
