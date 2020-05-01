import * as alt from 'alt';
import * as UI from '../includes/menu';
import * as chat from '../chat/chat';

const menu = new UI.Menu(alt.Player.local.name, 'Aktionen', {x:50, y:50});

const player_item = new UI.UIMenuItem('Spieler', 'Alle Spieler, die gerade an deiner Session teilnehmen', {});

const player_menu = new UI.Menu('Spieler', 'Auswählen', {x:50,y:50});

const player_interaction = new UI.Menu('player', 'Aktionen', {x: 50, y:50});

menu.BindMenuToItem(player_menu, player_item);

player_menu.MenuOpen.on(()=>{
    player_menu.Clear();
    alt.Player.all.filter(x=>x.dimension === alt.Player.local.dimension && x.id != alt.Player.local.id).forEach((player)=>{
        let item = new UI.UIMenuItem(player.name, 'Rang: ' + player.getSyncedMeta('rank'), {username: player.username, id: player.id});
        player_menu.AddItem(item);
    });
});

/*player_menu.ItemSelect.on(item=>{
    player_menu.Visible = false;
    player_interaction.Data.username = item.Data.username;
    player_interaction.Data.id = item.Data.id;
    player_interaction.Clear();
    if(alt.Player.local.dimension == alt.Player.local.id){
        player_interaction.AddItem(new UI.UIMenuItem('Bring', 'Teleportier diesen Spieler zu dir', {action:'bring'}));
        player_interaction.AddItem(new UI.UIMenuItem('Goto', 'Teleportier dich zu diesem Spieler', {action:'goto'}));
    }
    player_interaction.AddItem(new UI.UIMenuItem('TPR', 'Stelle diesem Spieler eine Teleportations-Anfrage', {action:'tpr'}));
    player_interaction.AddItem(new UI.UIMenuItem('TPA', 'Nimm die Teleportations-Anfrage des Spielers an', {action:'tpa'}));
    player_interaction.Visible = true;
});*/

player_interaction.ItemSelect.on(item=>{
    alt.emitServer('player:menu'+item.Data.action, player_interaction.Data.id);
    player_interaction.Visible = false;
    menu.Visible = true;
});

player_interaction.MenuClose.on(()=>{
    player_menu.Visible = true;
});

export const isVisible = ()=>{
    return menu.Visible || player_menu.Visible || player_interaction.Visible;
}

alt.on('keydown', (key)=>{
    if(key == 77 && !chat.open){
        if(player_menu.Visible)return;
        menu.Visible = ! menu.Visible;
    }
})