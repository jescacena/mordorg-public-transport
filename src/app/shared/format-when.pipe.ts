import {Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
  name: 'formatWhen'
})
export class FormatWhenPipe implements PipeTransform{
  transform(momentDate: any) {

    let result:string;

    const dateDiff = momentDate.diff(moment(),'minutes');
    // console.log('JES janderrrr dateDiff',dateDiff);

    if(dateDiff < 30) {
      result = (dateDiff === 0)? "Saliendo..." : "En " + dateDiff + " minutos";
    } else {
      const dayType = (momentDate.get('date') === moment().get('date'))? 'A las ': 'Mañana a las ';
      const hour = momentDate.hour();
      const minute = momentDate.minute();
      result = dayType + hour + ':' + minute + 'h';
    }

    return result;

  }
}
