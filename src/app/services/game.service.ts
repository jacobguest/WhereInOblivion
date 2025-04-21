import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentRound: number = 0;
  private currentView: string = "start"
  private lastGuessCoordinate?: Coordinate;
  private lastLine?: Feature;
  private lastCircle?: Feature;
  private guessHasBeenSubmitted: boolean = false;

  panoramas = [
    { id: 1, imageUrl: 'panorama.jpg', oblivionCoordinate: [21245, 64071] },
    { id: 2, imageUrl: 'panorama2.jpg', oblivionCoordinate: [-57083, 85858] },
    { id: 3, imageUrl: 'panorama3.jpg', oblivionCoordinate: [67447, -21193] },
  ];

  constructor() { }

  nextRound(): void {
    if (this.currentRound < 3) {
      this.currentRound++;
    } else {
      this.currentRound = 0;
    }

    this.setGuessHasBeenSubmitted(false);
    this.setLastGuessCoordinate(undefined);
    this.setLastLine(undefined);
    this.setLastCircle(undefined);
    this.switchToPanoramaView();
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

  setGuessHasBeenSubmitted(guessHasBeenSubmitted: boolean): void {
    this.guessHasBeenSubmitted = guessHasBeenSubmitted;
  }

  getGuessHasBeenSubmitted(): boolean {
    return this.guessHasBeenSubmitted;
  }

  getOblivionCoordinate(): Coordinate {
    return this.getCurrentPanorama().oblivionCoordinate;
  }
}
