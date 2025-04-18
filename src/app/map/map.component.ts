import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Feature } from 'ol';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
import { LineString } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import ImageTile from 'ol/source/ImageTile';
import VectorLayer from 'ol/layer/Vector';


@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  @Input() oblivionCoordinate: Coordinate = [];
  @Input() guessHasBeenSubmitted: boolean = false;
  @Output() guessSubmitted = new EventEmitter<void>();

  @Input() lastGuessCoordinate?: Coordinate;
  @Output() guessMade = new EventEmitter<Coordinate>();

  @Output() lineFeedbackDrawn = new EventEmitter<Feature>();
  @Output() circleFeedbackDrawn = new EventEmitter<Feature>();
  @Input() lastCorrectCoordinateLineFeature?: Feature;
  @Input() lastCorrectCoordinateCircleFeature?: Feature;

  
  centerX: number = 594.69;
  centerY: number = 495.79;
  vectorSource: VectorSource;
  map!: Map;


  constructor() { this.vectorSource = new VectorSource(); }

  ngAfterViewInit(): void { this.initializeMap(); }

  initializeMap() {
    const extent = [
      -20037508.34,
      -20037508.34,
       20037508.34,
       20037508.34 
    ];

    if (this.lastGuessCoordinate) {
      this.vectorSource.addFeature(new Feature({
        geometry: new Point(this.lastGuessCoordinate),
      }));
    }

    if (this.lastCorrectCoordinateLineFeature) {
      this.vectorSource.addFeature(this.lastCorrectCoordinateLineFeature);
    }

    if (this.lastCorrectCoordinateCircleFeature) {
      this.vectorSource.addFeature(this.lastCorrectCoordinateCircleFeature);
    }

    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

    this.map = new Map({
      layers: [
        new TileLayer({
          source: new ImageTile({
            url: 'http://localhost:8000/tiles/{z}/{x}/{y}.jpg',
            wrapX: false,
          }),
    }), vectorLayer
       ],
      target: 'map',
      view: new View({
        center: [0,0],
        zoom: 0,
        maxZoom: 3,
        extent: extent,
      }),
    });

    this.map.on('click', (event) => {
      this.vectorSource.clear();

      this.vectorSource.addFeature(new Feature({
        geometry: new Point(event.coordinate),
      }));
    
      this.guessMade.emit(event.coordinate);
    });
  }
  
  makeGuess() {
    if (this.lastGuessCoordinate == null) {
      window.alert("You haven't picked a point yet")
      return;
    }
    console.log("obliv: "+ this.oblivionCoordinate);
    const correctCoordinate = this.convertOblivionToMapCoordinate(this.oblivionCoordinate);
    const score = this.getGuessScore(correctCoordinate, this.lastGuessCoordinate);
    console.log(score);
    this.drawGuessFeedback(correctCoordinate, this.lastGuessCoordinate);
    this.guessSubmitted.emit();
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
      geometry: new Point(correctCoordinate),
    });


    this.lineFeedbackDrawn.emit(lineFeature);
    this.circleFeedbackDrawn.emit(circleFeature);
  
    this.vectorSource.addFeature(circleFeature);
    this.vectorSource.addFeature(lineFeature);
  }
}
