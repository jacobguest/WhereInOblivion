import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PanoramaComponent } from './panorama/panorama.component';
import { MapComponent } from "./map/map.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Coordinate } from 'ol/coordinate';
import { Feature } from 'ol';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, CommonModule,
    PanoramaComponent, MapComponent,
    MatToolbarModule, MatButtonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'OblivionGeoGuesser';
  view: string = "start";
  currentRound: number = 0;
  currentPanorama: any;
  guessHasBeenSubmitted: boolean = false;
  lastGuessCoordinate?: Coordinate;
  lastCorrectCoordinateLineFeature?: Feature;
  lastCorrectCoordinateCircleFeature?: Feature;

  panoramas = [
    { id: 1, imageUrl: 'panorama.jpg', oblivionCoordinate: [21245, 64071] },
    { id: 2, imageUrl: 'panorama.jpg', oblivionCoordinate: [-21245, 64071] },
    { id: 3, imageUrl: 'panorama.jpg', oblivionCoordinate: [21245, -64071] },
  ];

  ngOnInit(): void {
    this.loadNextPanorama();
  }

  loadNextPanorama(): void {
    this.currentPanorama = this.panoramas[this.currentRound];
    console.log(this.currentPanorama);
  }

  onGuessSubmitted() {
    this.guessHasBeenSubmitted = true;
  }

  onGuessMade(newCoordinate: Coordinate) {
    this.lastGuessCoordinate = newCoordinate;
  }

  onLineFeedbackDraw(line: Feature) {
    this.lastCorrectCoordinateLineFeature = line;
  }

  onCircleFeedbackDraw(circle: Feature) {
    this.lastCorrectCoordinateCircleFeature = circle;
  }

  nextRound(): void {
    this.guessHasBeenSubmitted = false;
    this.lastGuessCoordinate = undefined;
    this.lastCorrectCoordinateLineFeature = undefined;
    this.lastCorrectCoordinateCircleFeature = undefined;

    if (this.currentRound < this.panoramas.length - 1) {
      this.currentRound++;
    } else {
      this.currentRound = 0;
    }

    this.loadNextPanorama();
    this.switchToPanoramaView();
  } 

  toggleView(): void {
    if (this.view == "panorama") {
      this.view = "map";
    } else {
      this.view = "panorama";
    }
  }

  switchToPanoramaView(): void {
    this.view = "panorama";
  }
}
