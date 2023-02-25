enum ErrorCode {
  INTERNAL = "INTERNAL",
  ALREADY_ANNOUNCED = "ALREADY_ANNOUNCED",
  OVER = "OVER",
  CARD_NOT_ALLOWED = "CARD_NOT_ALLOWED",
  NOT_YOUR_TURN = "NOT_YOUR_TURN",
  ALL_MUST_ANNOUNCE = "ALL_MUST_ANNOUNCE"
}

function mapError(response: { code: string; message: string }) {
  console.log(response);
  const code = response.code as ErrorCode;
  switch (code) {
    case ErrorCode.ALL_MUST_ANNOUNCE:
      return "Tous les joueurs n'ont pas encore annoncé";
    case ErrorCode.ALREADY_ANNOUNCED:
      return "Tu as déjà fait ton annonce";
    case ErrorCode.CARD_NOT_ALLOWED:
      return "Tu ne peux pas jouer cette carte";
    case ErrorCode.INTERNAL:
      return response.message;
    case ErrorCode.NOT_YOUR_TURN:
      return "Ce n'est pas ton tour de jouer";
    case ErrorCode.OVER:
      return "Le SKULLKING est terminé";
  }
}

export default class SkullKingRepository {
  async playCard(idToken: string, gameId: string, playerId: string, card: any) {
    const url = `${process.env.VUE_APP_SERVER_BASE_URL}/games/${gameId}/players/${playerId}/play`;
    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${idToken}`
      },
      body: JSON.stringify({ card })
    }).then(async response => {
      const body = await response.json();

      if (response.ok) {
        return body;
      }

      console.log(body);

      throw mapError(body);
    });
  }
}
