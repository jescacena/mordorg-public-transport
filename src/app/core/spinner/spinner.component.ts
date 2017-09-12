import { Component, OnInit } from '@angular/core';
import { DataService } from '../../shared/services/data.service';


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  constructor(private dataService: DataService) { }

  showLoading:boolean = true;
  ngOnInit() {

    this.dataService.showPageTransitionSpinner.subscribe(
      ()=> {
        this.showLoading = true;
      }
    );

    this.dataService.hidePageTransitionSpinner.subscribe(
      ()=> {
        this.showLoading = false;
      }
    );

  }

}
