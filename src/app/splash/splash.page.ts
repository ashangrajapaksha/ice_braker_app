import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage  {

  local_new_cases:"";
  local_total_cases:"";
  local_active_cases:"";

  constructor(private router: Router,private http:HttpClient) { 

  
  }

  ionViewDidEnter(){
    this.getData();
  }

  start(){
    this.router.navigate(['/home']);
  }


  getData(){
    this.http.get("https://hpb.health.gov.lk/api/get-current-statistical/").subscribe((data:any)=>{
    this.local_new_cases= data.data.local_new_cases;
    this.local_total_cases= data.data.local_total_cases;
    this.local_active_cases = data.data.local_active_cases;
  })

 
  
  }

}
