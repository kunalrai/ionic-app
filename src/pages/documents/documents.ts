import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-documents',
  host: { 'class': 'is-header2' },
  templateUrl: 'documents.html',
})
export class documentsPage {
  header_data:any;
  searchTerm: string = 'Lease';

  list_type:string = 'col';
  list:Array<any> = [
    {title: 'Lease 45/301', icon: true},
    {title: 'Lease 45/303', icon: true},
    {title: 'Lease 45/305', icon: true},
  ];
  
  searchList:Array<any>;

  actions:Array<any> = [
    {icon: 'squares-gallery-grid-layout-interface-symbol@2x.png', class: 'icb active', type: 'col',isIcon: true},
    {icon: 'lists.png', class: 'icb', type: 'items',isIcon: true},
    {icon: 'bars.png', class: 'icb', type: 'items',isIcon: false},
  ];

  constructor(public navCtrl: NavController) {
     this.header_data = {
       title: 'Documents', 
       class: ''
     };
  }

  ionViewDidLoad() {
     this.setFilteredItems();
  }

  changeList(a){
    for(let i in this.actions) this.actions[i].class = 'icb'; 
    for(let i in this.list) this.list[i].icon = a.isIcon; 

    a.class += ' active';
    this.list_type = a.type;
  }

  filterItems(searchTerm){
      return this.list.filter((item) => {
          return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });     
  }

  setFilteredItems() {
      this.searchList = this.filterItems(this.searchTerm);
  }
  
  goBack(){
    if(this.navCtrl.canGoBack()) this.navCtrl.pop(); 
  }
}

