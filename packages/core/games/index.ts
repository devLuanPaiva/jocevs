import { ELocation } from "./model/ELocation.enum";
import { EStateGame } from "./model/EState.enum";
import { IGames } from "./model/IGames.interface";
import { IGamesRepository } from "./model/IGamesRepository.interface";
import Game from "./model/Game.class";

export type { ELocation, IGamesRepository, IGames, EStateGame };
export { Game };
