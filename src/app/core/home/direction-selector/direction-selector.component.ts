import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";
import * as moment from 'moment';
import {IMyDpOptions,IMyDate,IMyDateModel} from 'mydatepicker';
import {ActivatedRoute, Router,Data} from '@angular/router';
import { Response } from '@angular/http';



import { DataService } from '../../../shared/services/data.service';
import {CacheService} from '../../../shared/services/cache.service';

import { DirectionsEnum } from '../../../shared/model/directions.enum';


@Component({
  selector: 'app-direction-selector',
  templateUrl: './direction-selector.component.html',
  styleUrls: ['./direction-selector.component.scss']
})
export class DirectionSelectorComponent implements OnInit {

  showChoiceList:boolean = false;
  labelSelected:string;
  choiceSelected;
  private daySelected = moment();
  nowDateLabel = this.daySelected.locale('es').format('dddd, D [de] MMMM [de] YYYY');

  choiceList = [
    {
      label:'Cercedilla-Madrid',
      code: DirectionsEnum.CercedillaMadrid
    },
    {
      label:'Madrid-Cercedilla',
      code: DirectionsEnum.MadridCercedilla
    },
    {
      label:'Cercedilla-Cotos',
      code: DirectionsEnum.CercedillaCotos
    },
    {
      label:'Cotos-Cercedilla',
      code: DirectionsEnum.CotosCercedilla
    },
    {
      label:'Cercedilla-Piscinas Berceas',
      code: DirectionsEnum.CercedillaPiscinasBerceas
    },
    {
      label:'Piscinas Berceas-Cercedilla',
      code: DirectionsEnum.PiscinasBerceasCercedilla
    },
    // {
    //   label:'Cercedilla-Segovia',
    //   code: DirectionsEnum.CercedillaSegovia
    // },
    // {
    //   label:'Segovia-Cercedilla',
    //   code: DirectionsEnum.SegoviaCercedilla
    // },
    {
      label:'Instituto-Hospital Fuenfría',
      code: DirectionsEnum.InstitutoHospitalFuenfria
    },
    {
      label:'Hospital Fuenfría-Instituto',
      code: DirectionsEnum.HospitalFuenfriaInstituto
    },
    {
      label:'Cercedilla-Hospital Villalba',
      code: DirectionsEnum.CercedillaHospitalVillalba
    },
    {
      label:'Hospital Villalba-Cercedilla',
      code: DirectionsEnum.HospitalVillalbaCercedila
    }
  ];

  constructor(private dataService: DataService,
    private route:ActivatedRoute,
    private cacheService: CacheService) { }

  ngOnInit() {
    // this.labelSelected = this.choiceList[0].label;

    let directionCode = (this.route.snapshot.params['direction'])? parseInt(this.route.snapshot.params['direction']) : DirectionsEnum.CercedillaMadrid;

    this.choiceSelected = _.find(this.choiceList , (item)=> {
      return item.code === directionCode;
    });
    this.labelSelected = this.choiceSelected.label;

  }

  onChoiceSelect(choiceCode) {
    console.log('onChoiceSelect choiceCode',choiceCode);
    this.choiceSelected = _.find(this.choiceList , (item)=> {
      return item.code === choiceCode;
    });
    this.labelSelected = this.choiceSelected.label;
    this.showChoiceList = false;

    //Get uncached lines (L1)
    if(choiceCode === DirectionsEnum.HospitalFuenfriaInstituto ||
        choiceCode === DirectionsEnum.InstitutoHospitalFuenfria) {
          this.dataService.mixDepartures.next([]);

          if(!this.cacheService.lineCacheList['line-pubtra-l1']) {
            this.dataService.getBusLineData('l1').subscribe(
              (data: Response) => {
                //Save to cache line data
                const jsonData = data.json()[0];
                console.log('JES onChoiceSelect jsonData',jsonData);
                this.cacheService.addLineDataToCache(jsonData,jsonData.type);
                console.log('JES onChoiceSelect cached data for lines-->');
                console.table(this.cacheService.lineCacheList);
                //
                this.dataService.directionSelected = this.choiceSelected;
                //Notify listeners
                this.dataService.newDirectionSelected.next(this.choiceSelected);
              },
              (error) => console.log(error)
            );
          } else {
            this.dataService.directionSelected = this.choiceSelected;
            //Notify listeners
            this.dataService.newDirectionSelected.next(this.choiceSelected);
          }
    } else if(choiceCode === DirectionsEnum.CercedillaHospitalVillalba ||
            choiceCode === DirectionsEnum.HospitalVillalbaCercedila) {
              this.dataService.mixDepartures.next([]);

              if(!this.cacheService.lineCacheList['line-pubtra-680']) {
                this.dataService.getBusLineData('680').subscribe(
                  (data: Response) => {
                    //Save to cache line data
                    const jsonData = data.json()[0];
                    console.log('JES onChoiceSelect jsonData',jsonData);
                    this.cacheService.addLineDataToCache(jsonData,jsonData.type);
                    console.log('JES onChoiceSelect cached data for lines-->');
                    console.table(this.cacheService.lineCacheList);
                    //
                    this.dataService.directionSelected = this.choiceSelected;
                    //Notify listeners
                    this.dataService.newDirectionSelected.next(this.choiceSelected);
                  },
                  (error) => console.log(error)
                );
              } else {
                this.dataService.directionSelected = this.choiceSelected;
                //Notify listeners
                this.dataService.newDirectionSelected.next(this.choiceSelected);
              }

    } else if(choiceCode === DirectionsEnum.CotosCercedilla ||
            choiceCode === DirectionsEnum.CercedillaCotos) {
        this.dataService.mixDepartures.next([]);

        if(!this.cacheService.lineCacheList['line-pubtra-c9']) {
          this.dataService.getTrainLineData('c9').subscribe(
            (data: Response) => {
              //Save to cache line data
              const jsonData = data.json()[0];
              console.log('onChoiceSelect jsonData',jsonData);
              this.cacheService.addLineDataToCache(jsonData,jsonData.type);
              console.log('onChoiceSelect cached data for lines-->');
              console.table(this.cacheService.lineCacheList);
              //
              this.dataService.directionSelected = this.choiceSelected;
              //Notify listeners
              this.dataService.newDirectionSelected.next(this.choiceSelected);
            },
            (error) => console.log(error)
          );
        } else {
          this.dataService.directionSelected = this.choiceSelected;
          //Notify listeners
          this.dataService.newDirectionSelected.next(this.choiceSelected);
        }
    } else {
      //Notify listeners
      this.dataService.newDirectionSelected.next(this.choiceSelected);
    }
  }

  toggleChoiceList() {
    this.showChoiceList = !this.showChoiceList;
  }


}
