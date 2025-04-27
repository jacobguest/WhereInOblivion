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
import { GameService } from '../services/game.service';
import { Projection } from 'ol/proj';
import { ImageStatic } from 'ol/source';
import ImageLayer from 'ol/layer/Image';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  vectorSource: VectorSource;
  map!: Map;

  constructor(public gameService: GameService) {
    this.vectorSource = new VectorSource();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap() {
    const extent = [-245761, -266241, 225279, 204799]; // -229377 in extent[1] for tile server
    const centerX = extent[0] + (extent[2] - extent[0]) / 2;
    const centerY = 50000;

    const customProjection = new Projection({
      code: 'CUSTOM',
      units: 'pixels',
      extent: extent,
    });


    var lastGuessCoordinate = this.gameService.getLastGuessCoordinate()

    if (lastGuessCoordinate != undefined) {      
      this.vectorSource.addFeature(new Feature({
        geometry: new Point(lastGuessCoordinate),
      }));
    }

    var lastLine = this.gameService.getLastLine();

    if (lastLine !== undefined) {
      this.vectorSource.addFeature(lastLine);
    }

    var lastCircle = this.gameService.getLastCircle();

    if (lastCircle !== undefined) {
      this.vectorSource.addFeature(lastCircle);
    }

    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

    this.map = new Map({
      layers: [
        new ImageLayer({
          // source: new ImageTile({
          //   url: 'http://localhost:8000/tiles/{z}/{x}/{y}.jpg',
          //   wrapX: false,
          //   projection: customProjection
          // }),
          source: new ImageStatic({
            url: 'map.jpg',
            imageExtent: extent,
            projection: customProjection
          })
    }), vectorLayer
       ],
      target: 'map',
      view: new View({
        projection: customProjection,
        center: [centerX, centerY],
        zoom: 0,
        maxZoom: 3,
        extent: extent,
      }),
      controls: []
    });

    this.map.on('click', (event) => {
      if (this.gameService.getGuessHasBeenSubmitted() === true) {
        return;
      }

      this.vectorSource.clear();

      this.vectorSource.addFeature(new Feature({
        geometry: new Point(event.coordinate),
      }));
    
      this.gameService.setLastGuessCoordinate(event.coordinate);
    });
  }
  
  makeGuess() {
    if (this.gameService.getLastGuessCoordinate() == undefined) {
      window.alert("You haven't picked a point yet")
      return;
    }

    const correctCoordinate = this.gameService.getOblivionCoordinate();
    const score = this.getGuessScore(correctCoordinate, this.gameService.getLastGuessCoordinate());
    this.drawGuessFeedback(correctCoordinate, this.gameService.getLastGuessCoordinate());
    this.gameService.setGuessHasBeenSubmitted(true);
  }

  getGuessScore(correctCoordinate: Coordinate, guessCoordinate: Coordinate | undefined): number {
    const winDistance = 10;
    const maxScore = 1000;

    if (guessCoordinate == undefined) {
      return -1;
    }

    const distance = Math.sqrt(
      Math.pow(guessCoordinate[0] - correctCoordinate[0], 2) + Math.pow(guessCoordinate[1] - correctCoordinate[1], 2)
    );

    if (distance <= winDistance) {
      return maxScore
    }

    return Math.max(0, maxScore - (distance - winDistance) * 10);
  }

  drawGuessFeedback(correctCoordinate: Coordinate, guessCoordinate: Coordinate | undefined): void {
    if (guessCoordinate == undefined) {
      return;
    }

    const lineFeature = new Feature({
      geometry: new LineString([correctCoordinate, guessCoordinate]),
    });

    const circleFeature = new Feature({
      geometry: new Point(correctCoordinate),
    });

    this.gameService.setLastLine(lineFeature);
    this.gameService.setLastCircle(circleFeature);
  
    this.vectorSource.addFeature(circleFeature);
    this.vectorSource.addFeature(lineFeature);
  }
}
