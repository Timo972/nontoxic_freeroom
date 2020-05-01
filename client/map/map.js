import * as alt from 'alt';

let playersInSession = [];
let playerBlips = new Map();

let ownedVehicle = null;
let vehicleBlip = null;

const createVehicle = (vehicle)=>{
    ownedVehicle = vehicle;
    vehicleBlip = new alt.PointBlip(ownedVehicle.pos.x,ownedVehicle.pos.y,ownedVehicle.pos.z);
    vehicleBlip.name = "Persönliches Fahrzeug";
    vehicleBlip.sprite = 523;
    vehicleBlip.scale = 1;
    vehicleBlip.shortRange = false;
}

const destroyVehicle = ()=>{
    ownedVehicle = null;
    vehicleBlip.destroy();
    vehicleBlip = null;
}

const enterOwnVeh = ()=>{
    destroyVehicle();
}

const leaveOwnVeh = (updated)=>{
    createVehicle(updated);
}

alt.onServer('player:vehicle:enter', enterOwnVeh);
alt.onServer('player:vehicle:leave', leaveOwnVeh);

alt.onServer('player:vehicle:create', createVehicle);
alt.onServer('player:vehicle:destroy', destroyVehicle);

const addPlayer = (player)=>{
    let imin = playersInSession.find(x=>x.id === player.id);
    if(imin != undefined)return;
    let blip = new alt.PointBlip(player.pos.x, player.pos.y, player.pos.z);
    blip.name = player.name;
    blip.sprite = 1;
    blip.scale = 1;
    blip.shortRange = true;
    playerBlips.set(player.id, blip);
    playersInSession.push(player);
}

const removePlayer = ({id})=>{
    blip.delete(id);
    playersInSession.forEach((player, index)=>{
        if(player.id == id){
            playersInSession.splice(index, 1);
        }
    });
}

const loadPlayersFromSession = ()=>{
    alt.Player.all.filter(x=>x.dimension === alt.Player.local.dimension).forEach(addPlayer);
}

alt.onServer('dim:iamnew', loadPlayersFromSession);
alt.onServer('dim:entered', addPlayer);
alt.onServer('dim:left', removePlayer);

alt.everyTick(()=>{
    playersInSession.forEach((player)=>{
        playerBlips.get(player).pos = player.pos;
    });
    if(ownedVehicle == null || vehicleBlip == null)return;
    vehicleBlip.pos = ownedVehicle.pos;
});