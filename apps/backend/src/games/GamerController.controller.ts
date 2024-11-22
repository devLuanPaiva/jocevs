import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GamerProvider } from './GamerProvider.provider';
import {
  ECategoryTeam,
  EStateGame,
  ETypeTeam,
  Game,
  IGames,
} from '@jocevs/core';

@Controller('api/game')
export class GameController {
  constructor(private readonly repo: GamerProvider) {}
  @Post('create')
  async addGame(@Body() gameBody: IGames) {
    const game = new Game(this.repo);
    try {
      await game.addGame(gameBody);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
  @Get(':id')
  async getGameById(@Param('id') id: number) {
    const game = new Game(this.repo);
    try {
      return await game.getGameById(id);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  @Get()
  async getGames() {
    const game = new Game(this.repo);
    try {
      return await game.getGames();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  @Get('category/:category')
  async getGamesByCategory(@Param('category') category: string) {
    const game = new Game(this.repo);
    try {
      return await game.getGamesByCategory(category as ECategoryTeam);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  @Get('type/:type')
  async getGamesByType(@Param('type') type: string) {
    const game = new Game(this.repo);
    try {
      return await game.getGamesByType(type as ETypeTeam);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  @Get('date/:date')
  async getGamesByDate(@Param('date') date: Date) {
    const game = new Game(this.repo);
    try {
      return await game.getGamesByDate(date);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  @Get('team/:teamId')
  async getGamesByTeam(@Param('teamId') teamId: number) {
    const game = new Game(this.repo);
    try {
      return await game.getGamesByTeam(teamId);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
  @Put('update:id')
  async updateGame(@Param('id') id: number, @Body() gameBody: IGames) {
    const game = new Game(this.repo);
    try {
      await game.updateGame(id, gameBody);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
  @Put('state/:id/:state')
  async updateState(@Param('id') id: number, @Param('state') state: string) {
    const game = new Game(this.repo);
    try {
      await game.updateState(id, state as EStateGame);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
  @Delete(':id')
  async deleteGame(@Param('id') id: number) {
    const game = new Game(this.repo);
    try {
      await game.deleteGame(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
