import { AfterViewInit, Component } from '@angular/core';
import { Feature } from 'ol';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { getCenter } from 'ol/extent.js';
import ImageLayer from 'ol/layer/Image.js';
import VectorLayer from 'ol/layer/Vector';
import Projection from 'ol/proj/Projection.js';
import Static from 'ol/source/ImageStatic.js';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
import { Circle } from 'ol/geom';
import { LineString } from 'ol/geom';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  oblivionCoordinate: Coordinate = [21245, 64071];
  lastGuessCoordinate?: Coordinate;
  centerX: number = 594.69;
  centerY: number = 495.79;
  vectorSource: VectorSource;
  map!: Map;

  constructor() { this.vectorSource = new VectorSource(); }

  ngAfterViewInit(): void { this.initializeMap(); }

  initializeMap() {
    const extent = [0, 0, 1200, 980];

    const projection = new Projection({
      code: 'xkcd-image',
      units: 'pixels',
      extent: extent,
    });

    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
    })

    this.map = new Map({
      layers: [
        new ImageLayer({
          source: new Static({
            url: 'map.jpg',
            projection: projection,
            imageExtent: extent,
          }),
        }),
        vectorLayer
      ],
      target: 'map',
      view: new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 2,
        maxZoom: 8,
      }),
    });

    this.map.on('click', (event) => {
      this.vectorSource.clear();

      this.vectorSource.addFeature(new Feature({
        geometry: new Point(event.coordinate),
      }));
    
      this.lastGuessCoordinate = event.coordinate;
    });
  }
  
  makeGuess() {
    if (this.lastGuessCoordinate == null) {
      window.alert("You haven't picked a point yet")
      return;
    }

    const correctCoordinate = this.convertOblivionToMapCoordinate(this.oblivionCoordinate);
    const score = this.getGuessScore(correctCoordinate, this.lastGuessCoordinate);
    console.log(score);
    
    this.drawGuessFeedback(correctCoordinate, this.lastGuessCoordinate);
  }

  getGuessScore(correctCoordinate: Coordinate, guessCoordinate: Coordinate): number {
    const winDistance = 10;
    const maxScore = 1000;

    const distance = Math.sqrt(
      Math.pow(guessCoordinate[0] - correctCoordinate[0], 2) + Math.pow(guessCoordinate[1] - correctCoordinate[1], 2)
    );

    if (distance <= winDistance) {
      return maxScore
    }

    return Math.max(0, maxScore - (distance - winDistance) * 10);
  }

  convertOblivionToMapCoordinate(oblivionCoordinate: Coordinate): Coordinate {
    let mapCoordinateX = this.centerX + oblivionCoordinate[0] / 404.87;
    let mapCoordinateY = this.centerY + oblivionCoordinate[1] / 404.87;

    return [mapCoordinateX, mapCoordinateY];
  }

  drawGuessFeedback(correctCoordinate: Coordinate, guessCoordinate: Coordinate): void {
    const lineFeature = new Feature({
      geometry: new LineString([correctCoordinate, guessCoordinate]),
    });

    const circleFeature = new Feature({
      geometry: new Circle(correctCoordinate, 10),
    });
  
    this.vectorSource.addFeature(lineFeature);
    this.vectorSource.addFeature(circleFeature);
  }
}
