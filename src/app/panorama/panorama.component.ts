import { AfterViewInit, Component, Input } from '@angular/core';
declare var pannellum: any;

@Component({
  selector: 'app-panorama',
  imports: [],
  templateUrl: './panorama.component.html',
  styleUrl: './panorama.component.scss'
})
export class PanoramaComponent implements AfterViewInit {
  @Input() image: string = '';

  ngAfterViewInit(): void {
    pannellum.viewer('panorama', {
      "type": "equirectangular",
      "panorama": this.image,
      "autoLoad": true
    });
  }
}