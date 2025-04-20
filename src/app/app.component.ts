import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PanoramaComponent } from './panorama/panorama.component';
import { MapComponent } from "./map/map.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
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

  constructor(public gameService: GameService) {}

  onGuessSubmitted() {
    this.guessHasBeenSubmitted = true;
  }

  nextRound(): void {
    this.guessHasBeenSubmitted = false;
    this.gameService.setLastGuessCoordinate(undefined);
    this.gameService.setLastLine(undefined);
    this.gameService.setLastCircle(undefined);
    // TODO NEXT: move some of these things into a service
    // eventually will all be in gameservice
    // 

    this.gameService.nextRound();
    this.gameService.switchToPanoramaView();
  } 
}
