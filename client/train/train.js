import * as native from 'natives';
import * as alt from 'alt';

const loadModel = (model)=>{
    native.requestModel(alt.hash(model));
    return new Promise(resolve=>{
        let check = alt.setInterval(()=>{
            if(native.hasModelLoaded(alt.hash(model))){
                alt.clearInterval(check);
                resolve();
            }
        },0);
    });
}

const spawnTrain = async(model)=>{
    loadModel(model).then(()=>{
        native.createMissionTrain(model, 0, 0, 75, 30);
    });
}

alt.everyTick(()=>{
    native.setRandomTrains(true);
});