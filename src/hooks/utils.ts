import { AppMessage } from "../declarations/tswaanda_backend/tswaanda_backend.did";

export const processWsMessage = (message: AppMessage) => {
  if ("FromMarket" in message) {
    if ("OrderUpdate" in message.FromMarket) {
        let res = {
            title : "Tswaanda Order Update",
            message: message.FromMarket.OrderUpdate.message,
        }
      return res;
    } else if ("KYCUpdate" in message.FromMarket) {
        let res = {
            title : "Tswaanda KYC Update",
            message: message.FromMarket.KYCUpdate.message,
        }
      return res;
    } else if ("ProductReview" in message.FromMarket) {
        let res = {
            title : "Tswaanda Product Review",
            message: message.FromMarket.ProductReview.message,
        }
      return res;
    }
  } else {
    return {
      message: "Unknown message",
    };
  }
};