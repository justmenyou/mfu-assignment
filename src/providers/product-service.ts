import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http , Response, Headers } from '@angular/http';
/*
  Generated class for the ProductService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductService {

  URL_PREFIX : String;

  data : any;

  constructor(public http: Http) {
    console.log('Hello ProductService Provider');
    this.URL_PREFIX = "http://1-dot-labassignment-1247.appspot.com/";
  }

  load() {
    return new Promise(resolve => {
    this.http.get(this.URL_PREFIX+'listAllProduct')
    .map(res => res.json())
    .subscribe(data => {
    console.log(data);
    this.data = data;
    resolve(this.data);
    }); });
  }

  save(item: Object) {
    console.log("calling save() in service");
    let headers = new Headers({ 'Content-Type': 'application/json' });
    //let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(item);
    console.log(" "+body);
    return this.http.post(this.URL_PREFIX+'saveProduct', body, headers)
    .map((res:Response) => res.json())
    .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  delete(key){
    return new Promise(resolve => {
    this.http.get(this.URL_PREFIX+'deleteProduct?key='+key)
    .map(res => res.json())
    .subscribe(data => {
    console.log(data);
    this.data = data;
    resolve(this.data);
    });
    });
  }

  findByKey(key : String){
    return new Promise(resolve => {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    //let options = new RequestOptions({ headers: headers });
    this.http.get(this.URL_PREFIX+'findProductByKey?key='+key,headers)
    .map(res => res.json())
    .subscribe(data => {
    console.log('find by key return: '+data);
    this.data = data;
    resolve(this.data);
    });
    });
  }

}
