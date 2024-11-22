import { ECategoryTeam } from "../../teams/model/ECaterogy.enum";
import { ETypeTeam } from "../../teams/model/EType.enum";
import { EStateGame } from "./EState.enum";
import { IGames } from "./IGames.interface";

export interface IGamesRepository{
    getGames(): Promise<IGames[]>;
    getGameById(id: number): Promise<IGames>;
    getGamesByCategory(category: ECategoryTeam): Promise<IGames[]>;
    getGamesByType(type: ETypeTeam): Promise<IGames[]>;
    getGamesByDate(date: Date): Promise<IGames[]>;
    getGamesByTeam(teamId: number): Promise<IGames[]>;
    addGame(game: Partial<IGames>): Promise<void>;
    updateGame(id: number, game: Partial<IGames>): Promise<void>;
    updateState(id: number, state:EStateGame): Promise<void>;
    deleteGame(id: number): Promise<void>;
}