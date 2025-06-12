export enum RoundStage {
  Active = "ACTIVE",
  Pending = "PENDING",
  Finished = "FINISHED",
}

export enum UserRole {
  Survivor = "SURVIVOR",
  Nikita = "NIKITA",
  Admin = "ADMIN"
}

export enum WsStatus {
  Offline = "offline",
  Connected = "connected",
  Disconnected = "disconnected",
  Error = "error",
  Unauthorized = "unauthorized",
  Connecting = "connecting",
}

export enum WsEvents {
  Game = "game",
  Round = "round",
}

export enum GameEvent {
  UpdateRounds = "updateRounds",
}

export enum RoundEvent {
  IncreaseScore = "increaseScore",
  GetRoundStats = "getRoundStats",
}

export interface IRound {
  id: number;
  startTime: string;
  endTime: string;
  stats: {
    score: number;
    taps: number;
    user: {
      id: string;
      username: string;
    };
  }[];
}