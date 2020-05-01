let menu = new Vue({
    el: '#app',
    data(){
        return {
            title: 'Fuck this shit im out',
            subtitle: '',
            items: [
                /*{
                    Type: 'item',
                    Label: 'Players',
                    Description: 'All Players Desc',
                    isActive: false
                },
                {
                    Type: 'item',
                    Label: 'Vehicles',
                    Description: 'All Vehicles Desc',
                    isActive: false
                },
                {
                    Type: 'checkbox',
                    Label: 'Good',
                    Description: 'Are you good?',
                    Checked: true,
                    isActive: false
                }*/
            ],
            selectedIndex: 0,
            selected: {
                
            },
            show: false,
            styles: {
                x: 50,
                y: 50,
                url: './banners/beach-weather-banner.png'
            }
        }
    },
    methods: {
        setTitle(title){
            menu.title = title;
        },
        setSubTitle(subtitle){
            menu.subtitle = subtitle;
        },
        setPosition({x,y}){
            menu.styles.x = x;
            menu.styles.y = y;
            //document.getElementById('menu').style.top = x+'px';
            //document.getElementById('menu').style.left = y+'px';
        },
        setBanner(url){
            menu.styles.url = url;
            //document.getElementById('banner').style.backgroundImage = `url(${url})`;
        },
        addItem(item){
            item.isActive = false;
            menu.items.push(item);
            if(menu.items.length == 1){
                menu.items[menu.selectedIndex].isActive = true;
                menu.selected = menu.items[menu.selectedIndex];
            }
        },
        clearItems(){
            menu.items = [];
        },
        ready(){
            console.log('bro ready');
            alt.on('menu:update:title', menu.setTitle);
            alt.on('menu:update:subtitle', menu.setSubTitle);
            alt.on('menu:update:position', menu.setPosition);
            alt.on('menu:update:banner', menu.setBanner);
            alt.on('menu:items:add', menu.addItem);
            alt.emit('menu:loaded');
            alt.on('visible', val=>{
                console.log('showing menu: ' + val);
                menu.show = val;
            });
            alt.on('menu:items:clear', menu.clearItems);
        },
        switch(up){
            if(menu.items.length > 1)return;
            menu.items[menu.selectedIndex].isActive = false;
            up?menu.selectedIndex--:menu.selectedIndex++;
            if(menu.selectedIndex < 0){
                menu.selectedIndex = menu.items.length - 1;
            }else if(menu.selectedIndex == menu.items.length){
                menu.selectedIndex = 0;
            }
            menu.items[menu.selectedIndex].isActive = true;
            menu.selected = menu.items[menu.selectedIndex];
            alt.emit('item:change', menu.selectedIndex);
        }
    }
});
document.addEventListener('keydown', (e)=>{
    if(!menu.show)return;
    switch(e.keyCode){
        case 38:
            //up
            menu.switch(true);
            break;
        case 40:
            //down
            menu.switch(false);
            break;
        case 37:
            //left
            break;
        case 39:
            //right
            break;
        case 8:
            alt.emit('key:pressed', 'back');
            //back
            break;
        case 13:
            if(menu.items[menu.selectedIndex].Type == 'checkbox'){
                menu.items[menu.selectedIndex].Checked = !menu.items[menu.selectedIndex].Checked;
                alt.emit('item:checkbox:change', menu.selectedIndex, menu.items[menu.selectedIndex].Checked);
            }else{
                alt.emit('item:selected', menu.selectedIndex);
            }
            //enter
            break;
    }
});
window.onload = menu.ready();