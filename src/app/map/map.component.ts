import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Feature } from 'ol';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import VectorSource from 'ol/source/Vector';
import { Circle, Point } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
import { LineString } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import ImageTile from 'ol/source/ImageTile';
import VectorLayer from 'ol/layer/Vector';
import { GameService } from '../services/game.service';
import { Projection } from 'ol/proj';
import { ImageStatic } from 'ol/source';
import ImageLayer from 'ol/layer/Image';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';

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
    const extent = [-245761, -229377, 225279, 204799]; // -266241 in extent[1] for static image
    const centerX = extent[0] + (extent[2] - extent[0]) / 2;
    const centerY = 50000;

    const customProjection = new Projection({
      code: 'CUSTOM',
      units: 'pixels',
      extent: extent,
    });

    var lastGuessCoordinate = this.gameService.getLastGuessCoordinate()

    if (lastGuessCoordinate != undefined) {    
      const pin = new Feature({
        geometry: new Point(lastGuessCoordinate),
      });
      
      pin.setStyle(new Style({
        image: new Icon({
          src: 'finsvg.svg',
          anchor: [0.5, 1],
          scale: 0.3,
        }),
      }));
  
      this.vectorSource.addFeature(pin);
    }

    var lastLine = this.gameService.getLastLine();

    if (lastLine !== undefined) {
      this.vectorSource.addFeature(lastLine);
    }

    var lastCircle = this.gameService.getLastCircle();

    if (lastCircle !== undefined) {
      this.vectorSource.addFeature(lastCircle);
    }

    var lastWinningArea = this.gameService.getLastWinningArea();

    if (lastWinningArea !== undefined) {
      this.vectorSource.addFeature(lastWinningArea);
    }

    var lastPerfectGuessFlag = this.gameService.getLastPerfectGuessFlag();

    if (lastPerfectGuessFlag !== undefined) {
      this.vectorSource.addFeature(lastPerfectGuessFlag);
    }

    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

    this.map = new Map({
      layers: [
        new TileLayer({
          source: new ImageTile({
            url: 'tiles/{z}/{x}/{y}.jpg',
            wrapX: false,
            projection: customProjection
          }),
          // source: new ImageStatic({
          //   url: 'map.jpg',
          //   imageExtent: extent,
          //   projection: customProjection
          // })
    }), vectorLayer
       ],
      target: 'map',
      view: new View({
        projection: customProjection,
        center: [centerX, centerY],
        zoom: 0,
        maxZoom: 5,
        extent: extent,
      }),
      controls: []
    });

    this.map.on('click', (event) => {
      if (this.gameService.getGuessHasBeenSubmitted() === true) {
        return;
      }

      this.vectorSource.clear();

      const pin = new Feature({
        geometry: new Point(event.coordinate),
      });
      
      pin.setStyle(new Style({
        image: new Icon({
          src: 'finsvg.svg',
          anchor: [0.5, 1],
          scale: 0.3,
        }),
      }));

      this.vectorSource.addFeature(pin);
    
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
    
    if (score == 10000) {
      this.drawPerfectGuessFeedback(correctCoordinate);
    } else {
      this.drawNonPerfectGuessFeedback(correctCoordinate, this.gameService.getLastGuessCoordinate());
    }

    this.gameService.setGuessHasBeenSubmitted(true);
  }

  getGuessScore(correctCoordinate: Coordinate, guessCoordinate: Coordinate | undefined): number {
    if (guessCoordinate == undefined) {
      return 0;
    }

    const dx = correctCoordinate[0] - guessCoordinate[0];
    const dy = correctCoordinate[1] - guessCoordinate[1];
  
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= 1500) {
      return 10000;
    } else {
      return 5;
    }
  }

  drawNonPerfectGuessFeedback(correctCoordinate: Coordinate, guessCoordinate: Coordinate | undefined): void {
    if (guessCoordinate == undefined) {
      return;
    }

    const lineFeature = new Feature({
      geometry: new LineString([correctCoordinate, guessCoordinate]),
    });

    lineFeature.setStyle(
      new Style({
        stroke: new Stroke({
          color: 'darkred',
          width: 1,
        }),
      })
    );

    const circleFeature = new Feature({
      geometry: new Point(correctCoordinate),
    });

    circleFeature.setStyle(new Style({
      image: new Icon({
        src: 'red-flag-icon.svg',
        anchor: [0.8, 1], // find the percentage of the image that the central bottom of the flag is into
        scale: 0.4,
      }),
    }));

    const winningArea = new Feature({
      geometry: new Circle(correctCoordinate, 1500),
    });
  
    winningArea.setStyle(new Style({
      stroke: new Stroke({
        color: 'red',
        width: 2, 
      }),
    }));

    this.gameService.setLastLine(lineFeature);
    this.gameService.setLastCircle(circleFeature);
    this.gameService.setLastWinningArea(winningArea)
  
    this.vectorSource.addFeature(circleFeature);
    this.vectorSource.addFeature(winningArea);
    this.vectorSource.addFeature(lineFeature);
  }

  drawPerfectGuessFeedback(correctCoordinate: Coordinate): void {
    const winningArea = new Feature({
      geometry: new Circle(correctCoordinate, 1500),
    });
  
    winningArea.setStyle(new Style({
      stroke: new Stroke({
        color: 'lightgreen',
        width: 2,
      }),
    }));

    const flag = new Feature({
      geometry: new Point(correctCoordinate),
    });

    flag.setStyle(new Style({
      image: new Icon({
        src: 'green-flag.svg',
        anchor: [0.95, 1],
        scale: 0.1
      }),
    }));

    this.gameService.setLastGuessCoordinate(undefined);
    this.vectorSource.clear();
    
    this.gameService.setLastPerfectGuessFlag(flag);
    this.gameService.setLastWinningArea(winningArea);

    this.vectorSource.addFeature(flag);
    this.vectorSource.addFeature(winningArea);
  }
}
