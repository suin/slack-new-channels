import type { VercelRequest, VercelResponse } from "@vercel/node";
import { WebClient } from "@slack/web-api";

const postChannel = process.env["POST_CHANNEL"]!;
const web = new WebClient(process.env["TOKEN"]!);
const message =
  "新しいチャンネルが生まれたピヨ！気になる人はチェックしてみてね！";

export default async (request: VercelRequest, response: VercelResponse) => {
  const { body } = request;
  if (body.type === "url_verification") {
    return urlVerification(request, response);
  }
  if (body.type === "event_callback") {
    return handleEvent(request, response);
  }
  response.status(200).end();
};

const urlVerification = async (
  request: VercelRequest,
  response: VercelResponse
) => {
  console.log(request.body);
  await web.chat.postMessage({
    channel: postChannel,
    text: `I'm ready!`,
  });
  response.status(200).send({ challenge: request.body.challenge });
};

const handleEvent = async (
  request: VercelRequest,
  response: VercelResponse
) => {
  const { body } = request;
  const { event } = body;
  switch (event.type) {
    case "channel_created":
      await handleChannelCreated(event);
      break;
    default:
      handleUnknownEvent(event);
      break;
  }
  return response.end();
};

const handleChannelCreated = async (event: any): Promise<void> => {
  console.log("Handle channel created event");
  console.dir(event, { depth: Infinity });
  return postMessage({ channelName: event.channel.name });
};

const postMessage = async ({
  channelName,
}: {
  readonly channelName: string;
}): Promise<void> => {
  await web.chat.postMessage({
    channel: postChannel,
    text: `${message} #${channelName}`,
    unfurl_links: true,
  });
};

const handleUnknownEvent = (event: any) => {
  console.log("Unknown event.");
  console.dir(event, { depth: Infinity });
};
