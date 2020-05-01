import * as alt from 'alt';
import * as native from 'natives';

alt.onServer('command:fix', ()=>{
    if(!alt.Player.local.vehicle)return;
    native.setVehicleFixed(alt.Player.local.vehicle.scriptID);
});