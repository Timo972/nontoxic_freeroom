import * as alt from 'alt';

alt.log('loaded: events->player.mjs');

alt.on('playerConnect', (player) => {
    player.settedup = false;
    alt.log('Spieler ' + player.name + ' verbindet sich mit dem Server.');
});

alt.on('playerDisconnect', (player, reason)=>{
    let disconnectedPlayer = player;
    if(disconnectedPlayer.settedup)disconnectedPlayer.save();
    alt.log('Spieler ' + disconnectedPlayer.name + ' hat das Spiel Verlassen. Grund: ' + reason);
});

alt.on('playerDeath', (player)=>{
    player.data.weapons.clear();
});