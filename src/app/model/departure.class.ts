/**
*/
export class Departure {
  // static fromOtherPoint(point: Point): Point {
  //   // ...
  // }

  momentDate;
  placeLink: string;
  placeLabel: string;
  departureType: string;     //'LV' / 'SDF' /NVSG
  isDirect: Boolean;

  constructor(momentDate,
              placeLink: string ,
              placeLabel: string,
              departureType: string,
              isDirect: Boolean) {
    this.momentDate = momentDate;
    this.placeLink = placeLink;
    this.placeLabel = placeLabel;
    this.departureType = departureType;
    this.isDirect = isDirect;

  }

  toString(): string {
    // ...
    return null;
  }
}
