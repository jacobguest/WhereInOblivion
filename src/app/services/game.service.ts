import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentRound: number = 0;
  private currentView: string = "start"
  private currentPanorama: any;
  private lastGuessCoordinate?: Coordinate;
  private lastLine?: Feature;
  private lastCircle?: Feature;

  panoramas = [
    { id: 1, imageUrl: 'panorama.jpg', oblivionCoordinate: [21245, 64071] },
    { id: 2, imageUrl: 'panorama.jpg', oblivionCoordinate: [-21245, 64071] },
    { id: 3, imageUrl: 'panorama.jpg', oblivionCoordinate: [21245, -64071] },
  ];

  constructor() { }

  nextRound(): void {
    if (this.currentRound < 3) {
      this.currentRound = 0;
    } else {
      this.currentRound++;
    }
  }

  getCurrentRound(): number {
    return this.currentRound;
  }

  getCurrentView(): string {
    return this.currentView;
  }

  getCurrentPanorama(): any {
    return this.panoramas[this.getCurrentRound()];
  }

  toggleView(): void {
    if (this.currentView == "panorama") {
      this.currentView = "map";
    } else {
      this.currentView = "panorama";
    }
  }

  switchToPanoramaView(): void {
    this.currentView = "panorama";
  }

  setLastGuessCoordinate(coordinate: Coordinate | undefined): void {
    this.lastGuessCoordinate = coordinate;
  }

  getLastGuessCoordinate(): Coordinate | undefined {
    return this.lastGuessCoordinate;
  }

  getLastLine(): Feature | undefined {
    return this.lastLine;
  }

  setLastLine(lineFeature: Feature | undefined): void {
    this.lastLine = lineFeature;
  }

  getLastCircle(): Feature | undefined {
    return this.lastCircle;
  }

  setLastCircle(circleFeature: Feature | undefined): void {
    this.lastCircle = circleFeature;
  }
}
