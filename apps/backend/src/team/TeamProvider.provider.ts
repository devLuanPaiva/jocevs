import { Injectable } from '@nestjs/common';
import { ITeam } from '@jocevs/core';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class TeamProvider {
  constructor(readonly prisma: PrismaService) {}
  async getTeams(): Promise<ITeam[]> {
    const teams = await this.prisma.team.findMany();
    return teams as any;
  }

  async getTeamById(id: number): Promise<ITeam | null> {
    const team = await this.prisma.team.findUnique({ where: { id } });
    return (team as any) ?? null;
  }
  async getTeamByName(name: string): Promise<ITeam | null> {
    const team = await this.prisma.team.findFirst({ where: { name } });
    return (team as any) ?? null;
  }
  async addTeam(team: Partial<ITeam>): Promise<void> {
    const { id, ...data } = team;
    await this.prisma.team.upsert({
      where: { id: id ?? -1 },
      update: data as any,
      create: data as any,
    });
  }
  async updateTeam(id: number, team: Partial<ITeam>): Promise<void> {
    await this.prisma.team.update({ where: { id }, data: team });
  }
  async deleteTeam(id: number): Promise<void> {
    await this.prisma.team.delete({ where: { id } });
  }
}
