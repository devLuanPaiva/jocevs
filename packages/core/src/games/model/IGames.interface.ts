import { ECategoryTeam, ETypeTeam } from "../../teams";
import { ITeam } from "../../teams/model/ITeam.interface";
import { ELocation } from "./ELocation.enum";
import { EStateGame } from "./EState.enum";

export interface IGames {
  id: number;
  team1: ITeam;
  team2: ITeam;
  date: Date;
  time: number;
  location: ELocation;
  state: EStateGame;
  category: ECategoryTeam;
  type: ETypeTeam;
}
