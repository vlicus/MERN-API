// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require('@sentry/node');

Sentry.init({
    dsn: 'https://c7011a44068d21411ab6f410f7f8e580@o4509606362087424.ingest.de.sentry.io/4509606364053584',

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
});
