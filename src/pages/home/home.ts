import { Component } from '@angular/core';

import { NavController, AlertController,
ActionSheetController,LoadingController } from 'ionic-angular';
import { ProductService } from '../../providers/product-service';
import {Observable} from "rxjs/Rx";
import {Response} from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ProductService]
})
export class HomePage {

  public product: any;

  constructor(public navCtrl: NavController,
  public productService: ProductService,
  public alertCtrl: AlertController,
  public actionSheetCtrl: ActionSheetController,
  public loadingCtrl: LoadingController) {
    this.loadProduct();
  }

  loadProduct(){
    let loading = this.loadingCtrl.create({content: 'Please wait...'});
    loading.present();
    this.productService.load().then(data => {
    loading.dismiss();
    this.product = data;
    });
  }

  openCreateModal(){
    let prompt = this.alertCtrl.create({
    title: 'New Product',
    message: "Enter a name and price for this new product",
    inputs: [ { name: 'name',  placeholder: 'Name'  }, {  name: 'price',  placeholder: 'Price'  }],
    buttons: [{
      text: 'Cancel', handler: data => {
      console.log('Cancel clicked'); }
      },{
      text: 'Save', handler: data => {
      console.log("saving "+data.name);
      this.productService.save(data).subscribe(data => {
        console.log(data);
        this.loadProduct();
      },error => {
        console.error("Error saving product!");
        return Observable.throw(error);
      });
    }
    }]
    });
  
    prompt.present(); 
  }

  openEditModal(key: String){
    this.productService.findByKey(key).then(data => {
      let prod:any;
      prod = data;
      let prompt = this.alertCtrl.create({
      title: 'Edit Product',
      message: "Enter a name and price for this new product",
      inputs: [{ name: 'name', placeholder: 'Name', value: prod.name }, { name: 'price', placeholder: 'Price', value: prod.price }],
      buttons: [{
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
        },
        {
        text: 'Save',
        handler: data => { data.keyString = prod.keyString;
          console.log("saving "+data.name);
          this.productService.save(data).subscribe(
          data => {
            console.log(data);
            this.loadProduct();
          },
          error => {
            console.error("Error saving product!");
            return Observable.throw(error);
          }
          );
        }
        }
      ]});
      prompt.present();
    });
  }

  showOptions(keyString) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [{
      text: 'Delete',
      role: 'destructive',
      handler: () => { console.log('delete clicked'+keyString);
        this.productService.delete(keyString).then(data => {
        console.log("delete result "+data);
        this.loadProduct();
      });
      }
      },{
      text: 'Update',
      handler: () => {
        console.log('update clicked '+keyString);
        this.openEditModal(keyString);
      }
      },{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        console.log('Cancel clicked');
      }
      }
    ]});
    actionSheet.present();
}


}