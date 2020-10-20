import { Component } from '@angular/core';
import {ViewChild , ElementRef} from "@angular/core";
import {HttpClient} from "@angular/common/http";

declare var google : any;

// interface covidData {
//   _id:String;
//   hName : String;
//   cumulative_foreign:String;
//   cumulative_local:String;

// }

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  newData =[];

  map:any;
 
  @ViewChild('map' , {read:ElementRef , static:false}) mapRef:ElementRef;
  

  markers : any = [
    {
      latitude : "79.8612",
      longitude:"6.9271"
    },
    {
      latitude:"7.2876",
      longitude:"80.6323"
    },
    {
      latitude:"-17.822647",
      longitude:"31.052044"
    }
  ]

  constructor(private http:HttpClient) {}

  ionViewDidEnter(){
    this.showMap();
    this.getdata();
  }

  getdata(){
    this.http.get(" https://hpb.health.gov.lk/api/get-current-statistical/").subscribe((data:any)=>{ 
      this.newData.push(data.data.hospital_data)
      //console.log(data.data.hospital_data[0].hospital.name);
    })

    console.log("Ashan",this.newData)


  }

  showMap(){
    const location = new google.maps.LatLng(6.053519,80.196793);
    const options = {
      center:location,
      zoom:7.8,
      disableDefaultUI :true
    } 


    this.map = new google.maps.Map(this.mapRef.nativeElement , options);

    for(let maker of this.markers){

      console.log(maker.latitude)
      let position = new google.maps.LatLng(maker.longitude,maker.longitude);
      let mapMaker = new google.maps.Marker({
      position:position,
      title:"ghj",
      latitude: maker.latitude,
      longitude: maker.longitude
    })

    mapMaker.setMap(this.map);

    } // let inoWindow = new google.maps.infoWindow({})
  }

}
