import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { PanoramaComponent } from "../panorama/panorama.component";
import { MapComponent } from "../map/map.component";

@Component({
  selector: 'app-game',
  imports: [PanoramaComponent, MapComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  constructor(public gameService: GameService) {}
  
}
