import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor() { }

  public sendNewScore(score: number, name: string): void {
    const newEntry = { score, name };

    const storedData = localStorage.getItem('scoreData');
    const scoreData = storedData ? JSON.parse(storedData) : [];

    scoreData.push(newEntry);

    localStorage.setItem('scoreData', JSON.stringify(scoreData));
  }

  public getScores(): { name: string, score: number }[] {
    const storedData = localStorage.getItem('scoreData');

    const scores = storedData ? JSON.parse(storedData) : [];

    return scores.sort();
  }
}
