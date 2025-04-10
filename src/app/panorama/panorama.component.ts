import { AfterViewInit, Component } from '@angular/core';
declare var pannellum: any;

@Component({
  selector: 'app-panorama',
  imports: [],
  templateUrl: './panorama.component.html',
  styleUrl: './panorama.component.scss'
})
export class PanoramaComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    pannellum.viewer('panorama', {
      "type": "equirectangular",
      "panorama": "panorama.jpg"
    });
  }
}