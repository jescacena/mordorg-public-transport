import { Component, OnInit, Input } from '@angular/core';
import { Station } from '../model/station.class';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-stop-detail',
  templateUrl: './stop-detail.component.html',
  styleUrls: ['./stop-detail.component.scss']
})
export class StopDetailComponent implements OnInit {

  @Input() stationSelected: Station;

  options: any;
  map: L.Map;

  constructor(private dataService: DataService) { }

  ngOnInit() {

    //Parse latlon
    let tokens = this.stationSelected.latlon.split(',');
    const lat = parseFloat(tokens[0]);
    const lon = parseFloat(tokens[1]);
    console.log('JES StopDetailComponent lat,lng',lat,lon);

    //Marker
    let marker= L.marker([ lat, lon ], {
     icon: L.icon( {
       iconUrl: 'assets/marker-icon.png',
       shadowUrl: 'assets/marker-shadow.png'
     } )
    });

    this.options = {
    	layers: [
    		L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
        marker
    	],
    	zoom: 16,
    	center: L.latLng({ lat: lat, lng: lon })
    };

    this.dataService.selectedStation.subscribe(
      (station:Station)=> {
        setTimeout(()=>{
          this.stationSelected = station;
          let tokens = this.stationSelected.latlon.split(',');
          const lat = parseFloat(tokens[0]);
          const lon = parseFloat(tokens[1]);
          console.log('JES StopDetailComponent selectedStation lat,lng',lat,lon);

          this.options.center = L.latLng({ lat: lat, lng: lon });

          //redraw map
          this.map.panTo([lat,lon]);
          L.marker([ lat, lon ], {
           icon: L.icon( {
             iconUrl: 'assets/marker-icon.png',
             shadowUrl: 'assets/marker-shadow.png'
           } )
          }).addTo(this.map);
        },0);
      }

    );
  }

  onMapReady(map: L.Map) {
	   // Do stuff with map
     this.map = map;
     console.log('JES StopDetailComponent map',map);
    //  debugger;

  }

}
