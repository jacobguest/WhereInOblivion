import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PanoramaComponent } from './panorama/panorama.component';
import { MapComponent } from "./map/map.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, PanoramaComponent, MapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'OblivionGeoGuesser';
  view: string = "panorama";

  toggleView(): void {
    if (this.view == "panorama") {
      this.view = "view";
    } else {
      this.view = "panorama";
    }
  }
}
