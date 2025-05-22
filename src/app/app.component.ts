import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { GameService } from './services/game.service';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { GameComponent } from './game/game.component';
import { StartComponent } from "./start/start.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, CommonModule,
    LeaderboardComponent, GameComponent,
    MatToolbarModule, MatButtonModule,
    StartComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Where in Oblivion';

  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    this.setRealViewportHeight();
  }

  @HostListener('window:resize')
  onResize() {
    this.setRealViewportHeight();
  }

  setRealViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
