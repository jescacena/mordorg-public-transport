/**
*/
export class Departure {
  // static fromOtherPoint(point: Point): Point {
  //   // ...
  // }

  momentDate;
  placeLink: string;
  placeLabel: string;

  constructor(momentDate, placeLink: string , placeLabel: string) {
    this.momentDate = momentDate;
    this.placeLink = placeLink;
    this.placeLabel = placeLabel;
  }

  toString(): string {
    // ...
    return null;
  }
}
