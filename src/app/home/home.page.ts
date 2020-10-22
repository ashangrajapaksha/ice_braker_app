import { Component } from '@angular/core';
import {ViewChild , ElementRef} from "@angular/core";
import {HttpClient} from "@angular/common/http";
//import { environment } from './../../environments/environment.prod';
import { LoadingController } from '@ionic/angular';



declare var google : any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  newData =[];
  latestData=[]

  map:any;
 
  @ViewChild('map' , {read:ElementRef , static:false}) mapRef:ElementRef;

  infoWindows : any =[];

  constructor(private http:HttpClient , public loadingController: LoadingController) {}


  //set loader to loard data
  async presentLoading() {
    const loading = await this.loadingController.create({

      message: 'Please wait...',
      translucent: true,
    });
    await loading.present();
  }


  ionViewDidEnter(){
    this.presentLoading();
    this.showMap();
    this.getdata();

  }
  

  //show map on home page
  showMap(){
    const location_srilanka = new google.maps.LatLng(7.8731,80.7718);
    const options = {
      center:location_srilanka,
      zoom:8,
      disableDefaultUI :true
    } 
    this.map = new google.maps.Map(this.mapRef.nativeElement , options);

  }


  //get data from HBP api and pass data to google api and find placess.
  getdata(){
    this.http.get(" https://hpb.health.gov.lk/api/get-current-statistical/").subscribe((data:any)=>{ 
      for (let place in data.data.hospital_data) {
       let title=data.data.hospital_data[place]['hospital']['name'];
       let cumulative_local = data.data.hospital_data[place]['cumulative_local'];
       let treatment_local = data.data.hospital_data[place]['treatment_local'];
      // console.log(cumulative_local);
        this.http.get('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + data.data.hospital_data[place]['hospital']['name'] + '&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyB20YKftXz0PXO2MnES5dLYDyn4by4mI9I').subscribe((data: any) => {
          if (data.status == 'OK') {
            const myLatLng = { lat: data.candidates[0].geometry.location.lat, lng: data.candidates[0].geometry.location.lng };
           // console.log(data.data.hospital_data)
            let mapMarker=new google.maps.Marker({
              position: myLatLng,
              map : this.map,
              title : title,
              cumalative_local : cumulative_local,
              treatment_local : treatment_local,
            });
            mapMarker.setMap(this.map);
            this.addInfoWindowToMarker(mapMarker);
          }
        })
      }
      this.loadingController.dismiss();
    })
  }


  //set site notice for eche marker

  addInfoWindowToMarker(marker){
    let infoWindowContent = '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h4 id="firstHeading" class="firstHeading">Covid-19 Treatment Hospital - Sri lanaka</h4>' +
    '<h5>'+marker.title+'</h5>'+
    '<h6>'+"<small>treated_local :</small>"+'<small>'+marker.cumalative_local+'</small>'+'</h>'+
    '<h6>'+"<small>currently on treatment :</small>"+'<small>'+marker.treatment_local+'</small>'+'</h6>'+
    '<div id="bodyContent">' +
    "</div>" +
    "</div>";
    
    const infoWindow = new google.maps.InfoWindow({
      content:infoWindowContent
    }) ;
    
    marker.addListener('click',()=>{
      this.closeAllInfoWindows();
      infoWindow.open(this.map,marker);
    });

    this.infoWindows.push(infoWindow)
  }

  closeAllInfoWindows(){
    for(let window of this.infoWindows){
      window.close();
    }
  }


}
