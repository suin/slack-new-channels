import type { VercelRequest, VercelResponse } from "@vercel/node";
import { WebClient } from "@slack/web-api";

const channel = process.env["CHANNEL"]!;
const web = new WebClient(process.env["TOKEN"]!);
const message =
  process.env["MESSAGE"] ??
  "A new channel {channel} was created by {creator}. Check it now!";
const channelIgnored = process.env["CHANNEL_IGNORED"];
const channelIgnoredPattern = channelIgnored && new RegExp(channelIgnored);

export default async (request: VercelRequest, response: VercelResponse) => {
  const { body } = request;
  if (body?.type === "url_verification") {
    return urlVerification(request, response);
  }
  if (body?.type === "event_callback") {
    return handleEvent(request, response);
  }
  if (body?.type === "test") {
    await postMessage({
      channelId: body.id,
      channelName: body.name,
      creatorId: body.creator,
    });
  }
  response.status(200).end();
};

const urlVerification = async (
  request: VercelRequest,
  response: VercelResponse
) => {
  console.log(request.body);
  await web.chat.postMessage({ channel, text: `I'm ready!` });
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
  return postMessage({
    channelId: event.channel.id,
    channelName: event.channel.name,
    creatorId: event.channel.creator,
  });
};

const postMessage = async ({
  channelId,
  channelName,
  creatorId,
}: {
  readonly channelId: string;
  readonly channelName: string;
  readonly creatorId: string;
}): Promise<void> => {
  if (channelIgnoredPattern && channelIgnoredPattern.test(channelName)) {
    console.log(`The channel ${channelName} is ignored.`);
    return;
  }
  await web.chat.postMessage({
    channel,
    text: message
      .replaceAll("{channel}", `<#${channelId}>`)
      .replaceAll("{creator}", `<@${creatorId}>`),
    unfurl_links: true,
  });
};

const handleUnknownEvent = (event: any) => {
  console.log("Unknown event.");
  console.dir(event, { depth: Infinity });
};
