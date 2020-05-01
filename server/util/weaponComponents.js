const weaponData = require('../../shared/weap.json');

const addWeaponComponent = (player, type)=>{
    if(player.weapon == undefined)return;
    if(type === 'silence'){
        let weapon = player.data.weapons.find(x=>x.hash == player.weapon);
        if(weapon == undefined){
            return console.log('weapon is not in player data')
        }
        console.log(JSON.stringify(weapon));
        if(weapon.components == undefined)return console.log('weapon comp data not defined');
        let comp = weaponData[player.weapon].Components.Suppressor.HashKey;
        if(comp == undefined)return;
        let equipped = weapon.components.find(x=>x == comp);
        if(equipped == undefined){
            player.giveWeaponComponent(player.weapon, mp.joaat(comp));
            weapon.components.push(comp);
            player.call('sound:play', ['WEAPON_ATTACHMENT_EQUIP', 'HUD_AMMO_SHOP_SOUNDSET', true]);
            console.log(`${player.name} equipped silencer`);
        }else{
            player.removeWeaponComponent(player.weapon, mp.joaat(comp));
            for(let i = 0; i < weapon.components.length; i++){
                if(weapon.components[i] == comp){
                    weapon.components.splice(i,1);
                    console.log(`${player.name} removed silencer`);
                    player.call('sound:play', ['WEAPON_ATTACHMENT_UNEQUIP', 'HUD_AMMO_SHOP_SOUNDSET', true]);
                    break;
                }
            }
        }
    }
}

module.exports = addWeaponComponent;