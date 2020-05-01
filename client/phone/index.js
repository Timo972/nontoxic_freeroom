import * as alt from 'alt';
import * as native from 'natives';

let isMobilePhoneVisible = false;

const getDownRightCorner = ()=>{
    native.canPhoneBeSeenOnScreen();
}

alt.on('keydown', (key)=>{
    if(key == 38 && !isMobilePhoneVisible){//up
        native.createMobilePhone(0);
        native.setMobilePhoneScale(500.0);
        isMobilePhoneVisible = true;
    }else if(key == 40 && isMobilePhoneVisible){//down
        native.destroyMobilePhone();
        isMobilePhoneVisible = false;
    }
});