import { IGames } from "../../games/model/IGames.interface";
import { ECategoryTeam } from "./ECaterogy.enum";
import { ETypeTeam } from "./EType.enum";

export interface ITeam {
  id: number;
  name: string;
  image?: string;
  category: ECategoryTeam;
  type: ETypeTeam;
  goals?: string;
  goalByGame?: string;
  games?: IGames[];
}
