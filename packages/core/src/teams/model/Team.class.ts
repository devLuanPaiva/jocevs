import { ITeam } from "./ITeam.interface";
import { ITeamsRepository } from "./ITeamRepository.interface";

export default class Team {
  constructor(private readonly repo: ITeamsRepository) {}
  async addTeam(team: ITeam): Promise<void> {
    const hasTeam = await this.repo.getTeamByName(team.name);
    if (hasTeam) {
      throw new Error("O time já foi cadastrado!");
    }
    const newTeam: ITeam = {
      ...team,
      goals: "",
      goalByGame: "",
      games: [],
    };
    await this.repo.addTeam(newTeam);
  }
  async updateTeam(id: number, team: Partial<ITeam>): Promise<void> {
    await this.repo.updateTeam(id, team);
  }
  async deleteTeam(id: number): Promise<void> {
    await this.repo.deleteTeam(id);
  }
  async getTeams(): Promise<ITeam[]> {
    return this.repo.getTeams();
  }
  async getTeamById(id: number): Promise<ITeam> {
    const team = await this.repo.getTeamById(id);
    if (!team) {
      throw new Error("Time não encontrado!");
    }
    return team;
  }
  async getTeamByName(name: string): Promise<ITeam> {
    const team = await this.repo.getTeamByName(name);
    if (!team) {
      throw new Error("Time não encontrado!");
    }
    return team;
  }
}
