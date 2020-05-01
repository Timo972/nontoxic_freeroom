import * as game from 'natives';
game.setAudioFlag('LoadMPData', true);
export default class Common {
    static PlaySound(audioName, audioRef) {
        game.playSoundFrontend(-1, audioName, audioRef, false);
    }
}