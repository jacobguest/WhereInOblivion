import { Injectable } from '@angular/core';
import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentRound: number = 0;
  private currentView: string = "panorama"
  private lastGuessCoordinate?: Coordinate;
  private lastLine?: Feature;
  private lastCircle?: Feature;
  private lastWinningArea?: Feature;
  private lastPerfectGuessFlag?: Feature;
  private guessHasBeenSubmitted: boolean = false;
  private currentScore: number = 0;
  private totalScore: number = 0;

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
      this.totalScore = 0;
    }

    this.currentScore = 0;
    this.setGuessHasBeenSubmitted(false);
    this.setLastGuessCoordinate(undefined);
    this.setLastLine(undefined);
    this.setLastCircle(undefined);
    this.setLastWinningArea(undefined);
    this.setLastPerfectGuessFlag(undefined);
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

  getLastWinningArea(): Feature | undefined {
    return this.lastWinningArea;
  }

  setLastWinningArea(winningAreaFeature: Feature | undefined): void {
    this.lastWinningArea = winningAreaFeature;
  }

  getLastPerfectGuessFlag(): Feature | undefined {
    return this.lastPerfectGuessFlag;
  }

  setLastPerfectGuessFlag(lastPerfectGuessFlag: Feature | undefined): void {
    this.lastPerfectGuessFlag = lastPerfectGuessFlag;
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

  setCurrentScore(score: number): void {
    this.currentScore = score;
    this.totalScore += score;
  }

  getCurrentScore(): number {
    return this.currentScore;
  }

  getTotalScore(): number {
    return this.totalScore;
  }
}
