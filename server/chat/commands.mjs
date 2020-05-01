import * as chat from './chat.mjs';
import * as alt from 'alt';
import { getPositionInFront } from '../util/forwardVector.mjs';
import weaponList from '../../shared/weap.json';

chat.registerCmd('tpr',(player, params) => { 
    if(params[0] == player.name)return chat.send(player, 'You can`t send requests to yourself!');  
    if(player.tpr != undefined)return chat.send(player, 'You already sent a TPR! Wait a sec');
    let target = alt.Player.all.find(x=>x.name == params[0]);
    if(target == undefined)return chat.send(player, 'Player does not exist');
    //if(target.tpa != undefined)return chat.send(player, 'This user already got a TPR! Wait a sec');
    player.tpr = target.name;
    if(target.tpa == undefined)target.tpa = [];
    target.tpa.push(player.name);
    chat.send(target, `You've got a TPR from ${player.name}!`);
    chat.send(player, `TPR sent to ${target.name}!`);
    setTimeout(()=>{
        if(player.tpr == undefined)return;
        player.tpr = undefined;
        target.tpa.splice(target.tpa.indexOf(player.name), 1);
        chat.send(player, `TPR rejected!`);
        console.log('tpr: ' + player.name + ' ' + params[0] + ' cleared!');
    }, 10000);
    console.log('tpr: ' + player.name + ': ' + params[0]);
}, ['username'], 'Request teleport to username');

chat.registerCmd('tpa', (player, params)=>{
    if(player.tpa.length < 1)return chat.send(player, 'You do not have a TPA!');
    if(player.tpa.includes(params[0])){
        player.tpa.splice(player.tpa.indexOf(params[0]), 1);
        let target = alt.Player.all.find(x=>x.name == params[0] && x.tpr == player.name);
        if(target == undefined)return chat.send(player, 'Player does not exist or you`ve waited to long');
        target.pos = {
            x: player.pos.x,
            y: player.pos.y,
            z: player.pos.z+1
        }
        chat.send(target, `Teleporting to ${player.name}!`);
        chat.send(player, `${target.name}'s TPR accepted!`);
        target.tpr = undefined;
        console.log('tpa: ' + player.name + ': ' + target.name);
    }else{
        return chat.send(player, 'Player does not exist or you`ve waited to long');
    }
}, ['Username'], 'Accept user TPR');

chat.registerCmd('car', (player, params)=>{
    alt.log('vehicle model: ' + params[0]);
    if(player.data.car != null){
        alt.emitClient(player, 'player:vehicle:destroy');
        player.data.car.destroy();
        player.data.car = null;
    }
    const pos = getPositionInFront(player.pos, player.rot, 5);
    player.data.car = new alt.Vehicle(params[0], pos.x, pos.y, pos.z + 1, 0, 0, player.rot.z);
    player.data.car.dimension = player.dimension;
    alt.emitClient(player, 'player:vehicle:create', player.data.car);
}, ['model'], 'Spawn vehicle');
chat.registerCmd('carmax', (player)=>{
    if(player.data.car == null)return chat.send(player, 'You dont own a vehicle');
    if(player.data.car.modKitsCount == 0)return chat.send(player, 'You cant tune this vehcile');
    player.data.car.modKit = 1;
    if(tunVeh.getModsCount(0)){
        player.data.car.setMod(0, 1);//should be spoiler
        alt.emit('debug',' | VEHICLE TUNING | SPOILER');
    }
    if(tunVeh.getModsCount(11)){
        player.data.car.setMod(11, 3);//Engine
        alt.emit('debug',' | VEHICLE TUNING | Engine');
    }
    if(tunVeh.getModsCount(12)){
        player.data.car.setMod(12, 2);//Brakes
        alt.emit('debug',' | VEHICLE TUNING | Brakes');
    }
    if(tunVeh.getModsCount(13)){
        player.data.car.setMod(13, 2);//transmission
        alt.emit('debug',' | VEHICLE TUNING | Transmission');
    }
    if(tunVeh.getModsCount(14)){
        player.data.car.setMod(14, 5);//Horns
        alt.emit('debug',' | VEHICLE TUNING | Horn');
    }
    if(tunVeh.getModsCount(15)){
        player.data.car.setMod(15, 3);//Suspension
        alt.emit('debug',' | VEHICLE TUNING | Suspension');
    }
    if(tunVeh.getModsCount(16)){
        player.data.car.setMod(16, 4);//Armour
        alt.emit('debug',' | VEHICLE TUNING | Armour');
    }
    if(tunVeh.getModsCount(18)){
        player.data.car.setMod(18, 0);//Turbo
        alt.emit('debug',' | VEHICLE TUNING | Turbo');
    }
    if(tunVeh.getModsCount(22)){
        player.data.car.setMod(22, 0);//Xenon Lights
        alt.emit('debug',' | VEHICLE TUNING | Lights');
    }
    if(tunVeh.getModsCount(46)){
        player.data.car.setMod(46, 2);//Window Tint
        alt.emit('debug',' | VEHICLE TUNING | Window Tint');
    }
    chat.send(player, 'Vehicle maxed');
}, [], 'Max your vehicle');

chat.registerCmd('join', (player, params)=>{
    if(params[0] == player.name)return chat.send(player, 'You can`t send requests to yourself!'); 
    if(player.ser != undefined)return chat.send(player, 'You already requested joining a player session! Wait a sec');
    let target = alt.Player.all.find(x=>x.name == params[0]);
    if(target == undefined)return chat.send(player, 'Player does not exist');
    //if(target.tpa != undefined)return chat.send(player, 'This user already got a join request! Wait a sec');
    player.ser = target.name;
    if(target.sea == undefined)target.sea = [];
    target.sea.push(player.name);
    chat.send(target, `${player.name} wants to join your session!`);
    chat.send(player, `Join request sent to ${target.name}!`);
    setTimeout(()=>{
        if(player.ser == undefined)return;
        player.ser = undefined;
        target.sea.splice(target.sea.indexOf(player.name), 1);
        chat.send(player, `Join request rejected!`);
    }, 10000);

}, ['Username'], 'Request joining user session');

chat.registerCmd('acceptjoin', (player, params)=>{
    if(player.sea.length < 1)return chat.send(player, 'You do not have a join request!');
    if(player.sea.includes(params[0])){
        player.sea.splice(player.sea.indexOf(params[0]), 1);
        let target = alt.Player.all.find(x=>x.name == params[0] && x.ser == player.name);
        if(target == undefined)return chat.send(player, 'Player does not exist or you`ve waited to long');
        target.switchDimension(player.id);
        chat.send(target, `Joining ${player.name}!`);
        chat.send(player, `${target.name}'s join request accepted!`);
        target.ser = undefined;
        console.log('tpa: ' + player.name + ': ' + target.name);
    }else{
        return chat.send(player, 'Player does not exist or you`ve waited to long');
    }
}, ['Username'], 'Accept user`s join request');

chat.registerCmd('model', (player, params)=>{
    player.model = params[0];
}, ['Model'], 'Change ped model');

chat.registerCmd('giveweapon', (player, params)=>{
    if(player.data.weapons == undefined)player.data.weapons = new Map();
    if(weaponList[alt.hash(params[0])] == undefined)return chat.send(player, 'This weapon does not exist');
    player.giveWeapon(alt.hash(params[0]), 999, true);
    player.data.weapons.set(alt.hash(params[0]), {
        ammo: 999,
        components: []
    });
}, ['Weapon model'], 'Give weapon');

chat.registerCmd('removeweapon', (player, params)=>{
    if(!player.data.weapons.has(alt.hash(params[0])))return chat.send(player, 'You don`t own this weapon');
    player.data.weapons.delete(alt.hash(params[0]));
    player.removeWeapon(alt.hash(params[0]));
}, ['Weapon model'], 'Remove weapon');

chat.registerCmd('fix', (player)=>{
    if(!player.vehicle)return;
    alt.emitClient(player, 'command:fix');
}, [], 'Fix current vehicle');

chat.registerCmd('revive', (player)=>{
    player.spawn(player.pos.x, player.pos.y, player.pos.z, 100);
    player.health = 100;
}, [], 'Revive yourself');

chat.registerCmd('revivecar', (player)=>{
    if(!player.data.car)return;
    const model = player.data.car.model;
    const pos = player.data.car.pos;
    const rot = player.data.car.rot;
    player.data.car.destroy();
    alt.emitClient(player, 'player:vehicle:destroy');
    player.data.car = new alt.Vehicle(model, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
    alt.emitClient(player, 'player:vehicle:create', player.data.car);
}, [], 'Revive your personal vehicle');

chat.registerCmd('pos', (player)=>{
    chat.send(player, JSON.stringify(player.pos));
}, [], 'Get your current position');
chat.registerCmd('rot', (player)=>{
    chat.send(player, JSON.stringify(player.rot));
}, [], 'Get your current rotation');