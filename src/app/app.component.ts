import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PanoramaComponent } from './panorama/panorama.component';
import { MapComponent } from "./map/map.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Coordinate } from 'ol/coordinate';
import { Feature } from 'ol';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, CommonModule,
    PanoramaComponent, MapComponent,
    MatToolbarModule, MatButtonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'OblivionGeoGuesser';
  guessHasBeenSubmitted: boolean = false;
  lastGuessCoordinate?: Coordinate;
  lastCorrectCoordinateLineFeature?: Feature;
  lastCorrectCoordinateCircleFeature?: Feature;

  constructor(public gameService: GameService) {}

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
    
    this.gameService.nextRound();
    this.gameService.switchToPanoramaView();
  } 
}
