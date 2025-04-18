import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentRound: number = 0;
  private currentView: string = "start"
  private currentPanorama: any;

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
}
