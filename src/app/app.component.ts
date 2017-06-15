import { Component, OnInit } from '@angular/core';
import { DataService } from './shared/data.service';
import { DateUtilsService } from './shared/date-utils.service';
import { Response } from '@angular/http';
import { Departure } from './model/departure.class';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService,DateUtilsService]
})
export class AppComponent implements OnInit{
  title = 'app';

  departsBus684CerceMadrid:Array<Departure>;
  departsBus684MadridCerce:Array<Departure>;
  departsTrainC2CerceMadrid:Array<Departure>;
  departsTrainC2MadridCerce:Array<Departure>;


  constructor(private dataService: DataService, private dateUtilsService:DateUtilsService) {}

  ngOnInit() {
    this.dataService.getCCPOIS_BusTimetable('684').subscribe(
      (response: Response) => {
        const data = response.json();
        console.log('JES getCCPOIS_BusTimetable response-->', data);
        // this.departsTrainC2CerceMadrid = this.dateUtilsService.parseCCPOI_TrainTimetableResponseToArray(data,'C2M');
        // this.departsTrainC2MadridCerce = this.dateUtilsService.parseCCPOI_TrainTimetableResponseToArray(data,'M2C');
        console.log('JES departsTrainC2CerceMadrid-->', this.departsTrainC2CerceMadrid);
      },
      (error) => console.log(error)
    );

    this.dataService.getCCPOIS_BankHolidays(406).subscribe(
      (response: Response) => {
        const data = response.json();
        console.log('JES getCCPOIS_BankHolidays response-->', data);
        this.dateUtilsService.setBankHolydays(data.day_list);
      },
      (error) => console.log(error)
    );
  }
}
