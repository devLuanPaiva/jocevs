import { ECategoryTeam } from "../../teams/model/ECaterogy.enum";
import { ETypeTeam } from "../../teams/model/EType.enum";
import { EStateGame } from "./EState.enum";
import { IGames } from "./IGames.interface";
import { IGamesRepository } from "./IGamesRepository.interface";

export default class Game {
  constructor(private readonly repo: IGamesRepository) {}
  async addGame(game: IGames) {
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
    if (game.team1.category !== game.team2.category) {
      throw new Error("Os times devem ter categorias iguais");
    }
    if (game.team1.type !== game.team2.type) {
      throw new Error("Os times devem ter tipos iguais");
    }
    if (game.category !== (game.team1.category && game.team2.category)) {
      throw new Error("Os times devem ter a mesma categoria do jogo");
    }
    if (game.type !== (game.team1.type && game.team2.type)) {
      throw new Error("Os times devem ter o mesmo tipo do jogo");
    }

    const newGame: IGames = {
      ...game,
      state: EStateGame.WAITING,
    };
    return this.repo.addGame(newGame);
  }
  async getGames(): Promise<IGames[]> {
    return this.repo.getGames();
  }
  async getGameById(id: number): Promise<IGames> {
    return this.repo.getGameById(id);
  }

  async getGamesByCategory(category: ECategoryTeam): Promise<IGames[]> {
    return this.repo.getGamesByCategory(category);
  }
  async getGamesByType(type: ETypeTeam): Promise<IGames[]> {
    return this.repo.getGamesByType(type);
  }
  async getGamesByDate(date: Date): Promise<IGames[]> {
    return this.repo.getGamesByDate(date);
  }
  async getGamesByTeam(teamId: number): Promise<IGames[]> {
    return this.repo.getGamesByTeam(teamId);
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
  async updateState(id: number, state: EStateGame): Promise<void> {
    return this.repo.updateState(id, state);
  }
  async deleteGame(id: number): Promise<void> {
    return this.repo.deleteGame(id);
  }
}
