import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://b543a1689ffd65ce86062049d25d70e3@o4511442764169216.ingest.us.sentry.io/4511442808340480",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});