import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { TeamProvider } from './TeamProvider.provider';
import { ITeam, Team } from '@jocevs/core';

@Controller('api/team')
export class TeamController {
  constructor(private readonly repo: TeamProvider) {}
  @Post('create')
  async addTeam(@Body() teamBody: Partial<ITeam>) {
    const team = new Team(this.repo);
    try {
      return await team.addTeam(teamBody);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
  @Get('getAll')
  async getTeams(): Promise<ITeam[]> {
    const team = new Team(this.repo);
    try {
      return await team.getTeams();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  @Get('getById:id')
  async getTeamById(@Param('id') id: number): Promise<ITeam> {
    const team = new Team(this.repo);
    try {
      return await team.getTeamById(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  @Get('getByName:name')
  async getTeamByName(@Param('name') name: string): Promise<ITeam> {
    const team = new Team(this.repo);
    try {
      return await team.getTeamByName(name);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  @Post('update/:id')
  async updateTeam(@Param('id') id: number, @Body() teamBody: Partial<ITeam>) {
    const team = new Team(this.repo);
    try {
      await team.updateTeam(id, teamBody);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
  @Post('delete/:id')
  async deleteTeam(@Param('id') id: number) {
    const team = new Team(this.repo);
    try {
      await team.deleteTeam(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
