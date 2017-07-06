
import {TransportTypeEnum} from './transport-type.enum';
/**
*/
export class Departure {
  // static fromOtherPoint(point: Point): Point {
  //   // ...
  // }

  momentDate;
  placeLink: string;
  placeLabel: string;
  departureType: string;     //'LV' / 'SDF' / 'NVSG'
  isDirect: Boolean;
  isNightly: Boolean;
  transportType: number;  //
  transportTypeLabel: string;  //
  label: string;  //

  constructor(momentDate,
              placeLink: string ,
              placeLabel: string,
              departureType: string,
              isDirect: Boolean,
              isNightly: Boolean,
              transportType: number) {
    this.momentDate = momentDate;
    this.placeLink = placeLink;
    this.placeLabel = placeLabel;
    this.departureType = departureType;
    this.isDirect = isDirect;
    this.isNightly = isNightly;
    this.transportType = transportType;

  }

  toString(): string {
    // ...
    return null;
  }
}
