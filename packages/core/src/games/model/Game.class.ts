import { ECategoryTeam } from "../../teams/model/ECaterogy.enum";
import { ETypeTeam } from "../../teams/model/EType.enum";
import { IGames } from "./IGames.interface";
import { IGamesRepository } from "./IGamesRepository.interface";

export default class Game {
  constructor(private readonly repo: IGamesRepository) {}
  async addGame(game: Partial<IGames>) {
    const games = await this.repo.getGames();
    const hasGameInLocationAndTime = games.find(
      (g) => g.location === game.location && g.time === game.time
    );
    if (hasGameInLocationAndTime) {
      throw new Error("Já existe um jogo neste local e horário");
    }
    if (game.team1 === game.team2) {
      throw new Error("O time 1 e o time 2 não podem ser o mesmo time");
    }
    return this.repo.addGame(game);
  }
  async getGames(): Promise<IGames[]> {
    return this.repo.getGames();
  }
  async getGameById(id: number): Promise<IGames> {
    return this.repo.getGameById(id);
  }

  async getGamesFromCategory(category: ECategoryTeam): Promise<IGames[]> {
    return this.repo.getGamesFromCategory(category);
  }
  async getGamesFromType(type: ETypeTeam): Promise<IGames[]> {
    return this.repo.getGamesFromType(type);
  }
  async getGamesFromDate(date: Date): Promise<IGames[]> {
    return this.repo.getGamesFromDate(date);
  }
  async getGamesFromTeam(teamId: number): Promise<IGames[]> {
    return this.repo.getGamesFromTeam(teamId);
  }
  async updateGame(id: number, updatedGame: Partial<IGames>): Promise<void> {
    const games = await this.repo.getGames();
    const hasGameInLocationAndTime = games.find(
      (g) => g.location === updatedGame.location && g.time === updatedGame.time
    );
    if (hasGameInLocationAndTime) {
      throw new Error("Já existe um jogo neste local e horário");
    }
    if (updatedGame.team1 === updatedGame.team2) {
      throw new Error("O time 1 e o time 2 não podem ser o mesmo time");
    }
    return this.repo.updateGame(id, updatedGame);
  }
}
