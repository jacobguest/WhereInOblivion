import { AfterViewInit, Component } from '@angular/core';
import { GameService } from '../services/game.service';
declare var pannellum: any;

@Component({
  selector: 'app-panorama',
  imports: [],
  templateUrl: './panorama.component.html',
  styleUrl: './panorama.component.scss'
})
export class PanoramaComponent implements AfterViewInit {
  constructor(public gameService: GameService) { }

  ngAfterViewInit(): void {
    var panorama = this.gameService.getCurrentPanorama();

    pannellum.viewer('panorama', {
      "type": "equirectangular",
      "panorama": panorama.imageUrl,
      "autoLoad": true
    });
  }
}