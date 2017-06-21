import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";

import { DataService } from '../../shared/data.service';
import { DirectionsEnum } from '../../model/directions.enum';


@Component({
  selector: 'app-direction-selector',
  templateUrl: './direction-selector.component.html',
  styleUrls: ['./direction-selector.component.scss']
})
export class DirectionSelectorComponent implements OnInit {

  showChoiceList:boolean = false;
  labelSelected:string;
  choiceSelected;

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
      label:'Cercedilla-Segovia',
      code: DirectionsEnum.CercedillaSegovia
    },
    {
      label:'Segovia-Cercedilla',
      code: DirectionsEnum.SegoviaCercedilla
    },
    {
      label:'Instituto-Hospital Fuenfría',
      code: DirectionsEnum.InstitutoHospitalFuenfria
    },
    {
      label:'Hospital Fuenfría-Instituto',
      code: DirectionsEnum.HospitalFuenfriaInstituto
    },
    {
      label:'Cercedilla-Hospital Collado Vilalba',
      code: DirectionsEnum.CercedillaHospitalVilalba
    },
    {
      label:'Hospital Collado Vilalba-Cercedilla',
      code: DirectionsEnum.HospitalVillalbaCercedila
    }
  ];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.labelSelected = this.choiceList[0].label;
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
