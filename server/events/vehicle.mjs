import * as alt from 'alt';

alt.log('loaded: events->vehicle.mjs');

alt.on('playerEnteredVehicle', (player, vehicle)=>{
    if(player.data.car){
        if(player.data.car.id != vehicle.id)return;
        alt.emitClient(player, 'player:vehicle:enter', vehicle);
    }
});

alt.on('playerLeftVehicle', (player, vehicle)=>{
    if(player.data.car.id == vehicle.id){
        alt.emitClient(player, 'player:vehicle:leave', vehicle);
    }
});