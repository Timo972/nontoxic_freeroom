import fs from 'fs';
import * as alt from 'alt';
import crypto from './crypto.mjs';

const __dirname = alt.rootDir+'/resources/'+alt.resourceName+'/db', ALGORITHM = 'aes-256-cbc';

export const saveUser = (player)=>{
    fs.writeFileSync(`${__dirname}/players/${player.hwidHash}.json`, JSON.stringify([player.pos, player.rot, player.health, player.armour, player.model, player.data]), {encoding:'utf8'});
}

export const loadUser = (player)=>{
    return fs.existsSync(`${__dirname}/players/${player.hwidHash}.json`)? JSON.parse(fs.readFileSync(`${__dirname}/players/${player.hwidHash}.json`, {encoding: 'utf8'})):undefined;
}

const saveUSRCreds = (player)=>{
    crypto.encrypt(player);
}