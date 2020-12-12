import axios, { AxiosInstance } from "axios";

enum ErrorCode {
  INTERNAL = "INTERNAL",
  ALREADY_ANNOUNCED = "ALREADY_ANNOUNCED",
  OVER = "OVER",
  CARD_NOT_ALLOWED = "CARD_NOT_ALLOWED",
  NOT_YOUR_TURN = "NOT_YOUR_TURN",
  ALL_MUST_ANNOUNCE = "ALL_MUST_ANNOUNCE"
}

function mapError(response: { data: { code: string; message: string } }) {
  const code = response.data.code as ErrorCode;
  switch (code) {
    case ErrorCode.ALL_MUST_ANNOUNCE:
      return "Tous les joueurs n'ont pas encore annoncé";
    case ErrorCode.ALREADY_ANNOUNCED:
      return "Tu as déjà fait ton annonce";
    case ErrorCode.CARD_NOT_ALLOWED:
      return "Tu ne peux pas jouer cette carte";
    case ErrorCode.INTERNAL:
      return response.data.message;
    case ErrorCode.NOT_YOUR_TURN:
      return "Ce n'est pas ton tour de jouer";
    case ErrorCode.OVER:
      return "Le SKULLKING est terminé";
  }
}

export default class SkullKingRepository {
  constructor(private axios: AxiosInstance) {}

  async playCard({ gameId, playerId, card }: any) {
    return axios
      .post(
        `${process.env.VUE_APP_SERVER_BASE_URL}/games/${gameId}/players/${playerId}/play`,
        { card }
      )
      .catch(({ response }) => {
        throw mapError(response);
      });
  }
}
