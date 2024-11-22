import { IGames } from '@jocevs/core';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class GamerProvider {
  constructor(readonly prisma: PrismaService) {}

  async getGames(): Promise<IGames[]> {
    const gamers = await this.prisma.game.findMany();
    return gamers as any;
  }
  async getGameById(id: number): Promise<IGames | null> {
    const gamer = await this.prisma.game.findUnique({ where: { id } });
    return (gamer as any) || null;
  }
  async getGamesByCategory(category: string): Promise<IGames[] | null> {
    const gamers = await this.prisma.game.findMany({
      where: { category },
    });
    return (gamers as any) || null;
  }
  async getGamesByType(type: string): Promise<IGames[] | null> {
    const gamers = await this.prisma.game.findMany({
      where: { type },
    });
    return (gamers as any) || null;
  }
  async getGamesByDate(date: Date): Promise<IGames[] | null> {
    const gamers = await this.prisma.game.findMany({
      where: { date },
    });
    return (gamers as any) || null;
  }
  async getGamesByTeam(teamId: number): Promise<IGames[] | null> {
    const gamers = await this.prisma.game.findMany({
      where: {
        OR: [{ team1Id: teamId }, { team2Id: teamId }],
      },
    });
    return (gamers as any) || null;
  }

  async addGame(game: IGames): Promise<void> {
    const { id, team1, team2, ...data } = game;
    await this.prisma.game.upsert({
      where: { id: id ?? -1 },
      update: {
        ...data,
        team1Id: team1.id,
        team2Id: team2.id,
      },
      create: {
        ...data,
        team1Id: team1.id,
        team2Id: team2.id,
      },
    });
  }
  async updateGame(id: number, game: IGames): Promise<void> {
    const { team1, team2, ...rest } = game;

    await this.prisma.game.update({
      where: { id },
      data: {
        ...rest,
        team1Id: team1.id,
        team2Id: team2.id,
      },
    });
  }
  async updateState(id: number, state: string): Promise<void> {
    await this.prisma.game.update({
      where: { id },
      data: { state },
    });
  }
  async deleteGame(id: number): Promise<void> {
    await this.prisma.game.delete({ where: { id } });
  }
}
