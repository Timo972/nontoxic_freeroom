import * as alt from 'alt';

let blips = new Map();

let id = 0;
                            //string   //vector 3   //number  //number  //number  //boolean
export function createBlip (name,       pos,         color,    sprite,   scale,   shortRange){
    let blip = new alt.PointBlip(pos.x,pos.y,pos.z);
    
    id++;

    blip.color = color;
    blip.sprite = sprite;
    blip.name = name;
    blip.scale = scale;
    blip.shortRange = shortRange;
    blips.set(id, blip);
    return id;
}

export function changeBlipColor (blipId, newColor){
    blips.get(blipId).color = newColor;
}

/*let testBlipId = createBlip('test', {x:0,y:1,z:2}, 1, 1, 1, false);

changeBlipColor(testBlipId, 2);

export class Blip {
    constructor(name, pos, color, sprite, scale, shortRange){
        this.blip = new alt.PointBlip(pos.x,pos.y,pos.z);

        this.blip.color = color;
        this.blip.sprite = sprite;
        this.blip.name = name;
        this.blip.scale = scale;
        this.blip.shortRange = shortRange;
    }
    changeBlipColor(newColor){
        this.blip.color = newColor;
    }
    changeBlipSprite(newSprite){
        this.blip.sprite = newSprite;
    }
    changeBlipName(newName){
        this.blip.name = newName;
    }
    changeBlipScale(newScale){
        this.blip.scale = newScale;
    }
    changeBlipShortRange(newShortRange){
        this.blip.shortRange = newShortRange;
    }
}

let testBlip = new Blip('test2', {x:0,y:1,z:2}, 1, 1, 1, false);
testBlip.changeBlipColor(2);*/

alt.on('blip:create', createBlip);