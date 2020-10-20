import { Component } from '@angular/core';
import {ViewChild , ElementRef} from "@angular/core";
import {HttpClient} from "@angular/common/http";

declare var google : any;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  newData =[];

  map:any;
 
  @ViewChild('map' , {read:ElementRef , static:false}) mapRef:ElementRef;

  infoWindows : any =[];

  

  markers : any = [
    {
      tittle:"colombo",
      latitude : "7.028621599999999",
      longitude:"79.9242517"
    },
    {
      tittle:"Rathnapura",
      latitude:"7.2876",
      longitude:"80.6323"
    },
    {
      tittle:"Gall",
      latitude:"7.822647",
      longitude:"78.052044"
    }
  ]

  constructor(private http:HttpClient) {}

  // reqOpts = {
  //   headers: {
  //     "Access-Control-Allow-Origin":"http://localhost:8100",
  //     "Accept":"*/*"
  //   },
  //   params: {
  //     key:"AIzaSyB20YKftXz0PXO2MnES5dLYDyn4by4mI9I",
  //     input:"TH - Ragama",
  //     inputtype:"textquery",
  //     fields:"photos,formatted_address,name,rating,opening_hours,geometry"
  //   }
  // };

  ionViewDidEnter(){
    this.showMap();
    this.getdata();
  // this.getPlaces();
  }


  // getPlaces(){
  //   this.http.get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=TH - Ragama&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyB20YKftXz0PXO2MnES5dLYDyn4by4mI9I").subscribe((data:any)=>{
  //     console.log("Ashan",data)
  //   })
  // }

  getdata(){
    this.http.get(" https://hpb.health.gov.lk/api/get-current-statistical/").subscribe((data:any)=>{ 
      this.newData.push(data.data.hospital_data)
     //console.log(data.data.hospital_data);
    })
   console.log("Ashan",this.newData)

  }



  addMarkerToMap(markers){
    for(let marker of markers){
      let position = new google.maps.LatLng(marker.latitude,marker.longitude);
      let mapMarker = new google.maps.Marker({
        position : position,
        tittle :marker.tittle,
        latitude:marker.latitude,
        longitude:marker.longitude
      });
      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);
    }
  }

  addInfoWindowToMarker(marker){
    let infoWindowContent = '<div id ="content">'+'<h2 id="firstHeading" class="firstHeading">'+marker.tittle + '</h2>'
                              '<p> Latitude:'+marker.latitude + '</p>'+
                              '<p>Longitude:'+marker.longitude + '</p>'+
                              '</div>';
    
    let infoWindow = new google.maps.infoWindow({
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




  showMap(){
    const location = new google.maps.LatLng(7.8731,80.7718);
    const options = {
      center:location,
      zoom:7.8,
      disableDefaultUI :true
    } 


    this.map = new google.maps.Map(this.mapRef.nativeElement , options);

    this.addMarkerToMap(this.markers);
  }

}
