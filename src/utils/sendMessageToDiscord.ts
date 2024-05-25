import axios, { AxiosError } from "axios";

export async function sendMessageToDiscord(message: string) {
  try {
    const bobUrl = process.env.BOB_URL as string;
    const channelId = process.env.BOT_CHANNEL_ID as string;
    const data = {
      message,
      channelId,
    };
    const response = await axios.post(
      `${bobUrl}/v1/bob/send-server-message`,
      data
    );
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response.data.message;
    console.log(errorMessage);
  }
}
