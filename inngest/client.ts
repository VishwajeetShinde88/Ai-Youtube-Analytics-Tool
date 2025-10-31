import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "Ai Youtube Analytics Tool",
  eventKey: process.env.INNGEST_EVENT_KEY, 
});
