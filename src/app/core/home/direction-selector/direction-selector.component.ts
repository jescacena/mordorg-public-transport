import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";
import * as moment from 'moment';
import {IMyDpOptions,IMyDate,IMyDateModel} from 'mydatepicker';
import {ActivatedRoute, Router,Data} from '@angular/router';


import { DataService } from '../../../shared/services/data.service';
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
    // {
    //   label:'Instituto-Hospital Fuenfría',
    //   code: DirectionsEnum.InstitutoHospitalFuenfria
    // },
    // {
    //   label:'Hospital Fuenfría-Instituto',
    //   code: DirectionsEnum.HospitalFuenfriaInstituto
    // },
    // {
    //   label:'Cercedilla-Hospital Collado Vilalba',
    //   code: DirectionsEnum.CercedillaHospitalVilalba
    // },
    // {
    //   label:'Hospital Collado Vilalba-Cercedilla',
    //   code: DirectionsEnum.HospitalVillalbaCercedila
    // }
  ];

  constructor(private dataService: DataService,private route:ActivatedRoute) { }

  ngOnInit() {
    // this.labelSelected = this.choiceList[0].label;

    let directionCode = (this.route.snapshot.params['direction'])? parseInt(this.route.snapshot.params['direction']) : DirectionsEnum.CercedillaMadrid;

    this.choiceSelected = _.find(this.choiceList , (item)=> {
      return item.code === directionCode;
    });
    this.labelSelected = this.choiceSelected.label;

  }

  onChoiceSelect(choiceCode) {
    console.log('JES onChoiceSelect choiceCode',choiceCode);
    this.choiceSelected = _.find(this.choiceList , (item)=> {
      return item.code === choiceCode;
    });
    this.labelSelected = this.choiceSelected.label;
    this.showChoiceList = false;

    //Notify listeners
    this.dataService.newDirectionSelected.next(this.choiceSelected);

  }

  toggleChoiceList() {
    this.showChoiceList = !this.showChoiceList;
  }


}
