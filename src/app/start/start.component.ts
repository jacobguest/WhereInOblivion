import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-start',
  imports: [FormsModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {
  playerName: string = "";

  constructor(private gameService: GameService) {}

  public startGame(): void {
    this.gameService.startGame(this.playerName);
  }
}
