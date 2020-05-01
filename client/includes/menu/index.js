import * as alt from 'alt'; 
import LiteEvent from './utils/LiteEvents';
import Common from "./utils/Common";
import UUIDV4 from './utils/UUIDV4';

export class UIMenuItem {
    constructor(label, desc, data){
        this.Id = UUIDV4();
        this.Label = label;
        this.Description = desc;
        this.Data = data;
        this.RightLabel = '';
        this.Type = 'item';
        this.Child = {};
        this.isActive = false;
    }
    setRightLabel(label){
        this.RightLabel = label;
    }
    setChild(classMenu){
        this.Child = classMenu;
    }
}

export class UIMenuCheckboxItem{
    constructor(label, checked, desc){
        this.Id = UUIDV4();
        this.Label = label;
        this.Checked = checked;
        this.Description = desc;
        this.Type = 'checkbox';
        this.isActive = false;
    }
}

export class Menu {
    constructor(title, subtitle, position, banner){
        this.Id = UUIDV4();
        this.Title = title;
        this.SubTitle = subtitle;
        this.Banner = banner || './banners/beach-weather-banner.png';
        this.Menu = new alt.WebView('http://resource/client/views/menu-view/index.html');
        this.isVisible = false;
        this.Items = [];
        this.Position = position;
        this.ParentMenu = {};
        this.ParentItem = {};
        this.canClose = true;
        this.Valid = true;
        this.Data = {};
        this.ItemSelect = new LiteEvent();
        this.ItemChange = new LiteEvent();
        this.MenuOpen = new LiteEvent();
        this.MenuClose = new LiteEvent();
        this.ItemChecked = new LiteEvent();
        this.AUDIO_LIBRARY = "HUD_FRONTEND_DEFAULT_SOUNDSET";
        this.AUDIO_UPDOWN = "NAV_UP_DOWN";
        this.AUDIO_LEFTRIGHT = "NAV_LEFT_RIGHT";
        this.AUDIO_SELECT = "SELECT";
        this.AUDIO_BACK = "BACK";
        this.AUDIO_ERROR = "ERROR";
        this.AUDIO_CONTINUE = "CONTINUE";
        this.Children = new Map();
        this.Menu.on('menu:loaded', ()=>{
            alt.setTimeout(()=>{
                this.Menu.emit('menu:update:position', this.Position);
                alt.log('Title: ' + this.Title);
                this.Menu.emit('menu:update:title', this.Title);
                this.Menu.emit('menu:update:subtitle', this.SubTitle);
                this.Menu.emit('menu:update:banner', this.Banner);
                this.Items.forEach((item)=>{
                    this.Menu.emit('menu:items:add', item);
                });
                this.Menu.emit('visible', this.isVisible);
                alt.log('menu ready!');
            }, 100)
        });
        this.Menu.on('key:pressed', (key)=>{
            if(key == 'back'){
                Common.PlaySound(this.AUDIO_BACK, this.AUDIO_LIBRARY);
                if(this.ParentMenu.Valid){
                    this.ParentMenu.Visible = true;
                    this.Visible = false;
                }else{
                    if(this.canClose){
                        this.Visible = false;
                    }
                    return;
                }
            }
        });
        this.Menu.on('item:change', (index)=>{
            Common.PlaySound(this.AUDIO_UPDOWN, this.AUDIO_LIBRARY);
            this.ItemChange.emit(this.Items[index]);
        })
        this.Menu.on('item:selected', (index)=>{
            Common.PlaySound(this.AUDIO_SELECT, this.AUDIO_LIBRARY);
            if (this.Children.has(this.Items[index].Id)) {
                const subMenu = this.Children.get(this.Items[index].Id);
                this.Visible = false;
                subMenu.Visible = true;
                //this.MenuChange.emit(subMenu, true);
            }else{
                this.ItemSelect.emit(this.Items[index]);
            }
        });
        this.Menu.on('item:checkbox:change', (index, val)=>{
            Common.PlaySound(this.AUDIO_SELECT, this.AUDIO_LIBRARY);
            this.Items[index].Checked = val;
            this.ItemChecked.emit(this.Items[index]);
        });
    }
    set setTitle(newTitle){
        this.Title = newTitle;
        this.Menu.emit('menu:update:title', this.Title);
    }
    set setSubTitle(newSubTitle){
        this.SubTitle = newSubTitle;
        this.Menu.emit('menu:update:subtitle', this.SubTitle);
    }
    set setBanner(newBanner){
        this.Banner = newBanner;
        this.Menu.emit('menu:update:banner', this.Banner);
    }
    destroy(){
        this.Menu.destroy();
        this.Valid = false;
    }
    set Visible(stat){
        //if(stat == this.isVisible)return alt.log('already that visibility');
        stat?this.MenuOpen.emit():this.MenuClose.emit();
        this.isVisible = stat;
        if(this.isVisible)Common.PlaySound(this.AUDIO_CONTINUE, this.AUDIO_LIBRARY);
        this.Menu.emit('visible', this.isVisible);
        alt.log('setted visibility to: ' +stat);
    }
    get Visible(){
        return this.isVisible;
    }
    AddItem(classItem){
        this.Items.push(classItem);
        this.Menu.emit('menu:items:add', classItem);
    }
    Clear(){//! Dont use if you bound menu to item!!!!!
        this.Items = [];
        this.Menu.emit('menu:items:clear');
    }
    BindMenuToItem(menuToBind, itemToBindTo){
        if (!this.Items.includes(itemToBindTo)) {
            this.AddItem(itemToBindTo);
        }
        menuToBind.ParentMenu = this;
        menuToBind.ParentItem = itemToBindTo;
        this.Children.set(itemToBindTo.Id, menuToBind);
    }
}