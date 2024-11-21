import { ITeam } from "./ITeam.interface";

export interface ITeamsRepository {
    getTeams(): Promise<ITeam[]>;
    getTeamById(id: number): Promise<ITeam>;
    getTeamByName(name: string): Promise<ITeam>;
    addTeam(team: Partial<ITeam>): Promise<void>;
    updateTeam(id: number, team: Partial<ITeam>): Promise<void>;
    deleteTeam(id: number): Promise<void>;
}