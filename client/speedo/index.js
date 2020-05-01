import * as alt from 'alt';
import * as native from 'natives';

const speedo = new alt.WebView('http://resource/client/views/speedo-view/index.html');
const visible = false;

alt.setInterval(() => {
    if(alt.Player.local.vehicle){
        const carSpeed = Math.ceil(native.getEntitySpeed(alt.Player.local.vehicle.scriptID) * 3.6);
        if(!visible){
            visible = !visible;
            speedo.emit('show', visible);
        }
        speedo.emit('speed', carSpeed);
    }else{

    }
}, 1);