import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  navOpened:boolean = false;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.toggleNavMenu.subscribe(
      (data:string)=> {
        this.toggleNav();
      }
    );
  }

  /* Set the width of the side navigation to 250px */
  toggleNav() {
    if(!this.navOpened) {
      document.getElementById("mySidenav").style.width = "125px";
    } else {
      document.getElementById("mySidenav").style.width = "0";
    }
    this.navOpened = !this.navOpened;
  }

}
