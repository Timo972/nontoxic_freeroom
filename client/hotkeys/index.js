import * as alt from 'alt';
import * as native from 'natives';

let holdingKeys = new Map();
let vehicleCam = false;

const keyHold = (key, sec, func)=>{
    holdingKeys.set(key, func);
    alt.setTimeout(()=>{
        if(!holdingKeys.has(key))return;
        holdingKeys.delete(key);
        func();
    }, sec*1000);
}

const releasedKey = (key)=>{
    if(holdingKeys.has(key)){
        holdingKeys.delete(key);
    }
}

const toggleVehicleWindows = ()=>{
    let vehicle = alt.Player.local.vehicle;
    if(!vehicle)return;
    if(vehicle.windows == undefined){vehicle.windows = true};
    vehicle.windows = !vehicle.windows;
    if(vehicle.windows){
        native.rollUpWindow(vehicle.scriptID, 0);
        native.rollUpWindow(vehicle.scriptID, 1);
        native.rollUpWindow(vehicle.scriptID, 2);
        native.rollUpWindow(vehicle.scriptID, 3);
    }else{
        native.rollDownWindows(vehicle.scriptID);
    }
}

const toggleVehicleCam = ()=>{
    vehicleCam = !vehicleCam;
    if(vehicleCam){

    }else{

    }
}

alt.on('keydown', (key)=>{
    switch(key){
        case 72:
            if(!alt.Player.local.vehicle)return;
            keyHold(key, 3, toggleVehicleWindows);
            //windows up/down
            break;
        case 82: 
            toggleVehicleCam();
            break;
    }
});

alt.on('keyup', (key)=>{
    releasedKey(key);
});