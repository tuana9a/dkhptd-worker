const ms = require("ms");
const yargs = require("yargs");

const { launch } = require("./dist");

const parser = yargs
  .usage("Usage: node launch.js")
  .option("id", {
    type: "string",
    requiresArg: false,
  })
  .option("type", {
    type: "string",
    requiresArg: false,
    choices: ["http", "rabbit", "rabbit1", "standalone"],
  })
  .option("job-dir", {
    type: "string",
    requiresArg: false,
    default: "./dist/jobs",
  })
  .option("log-dest", {
    type: "string",
    requiresArg: false,
    choices: ["cs", "fs"],
    default: "cs",
  })
  // setup puppeteer
  .option("puppeteer-launch-options-path", {
    type: "string",
    requiresArg: true,
  })
  // standalone
  .option("schedules-dir", {
    type: "string",
    requiresArg: false,
  })
  // rabbit worker
  .option("rabbitmq-connection-string", {
    type: "string",
    requiresArg: false,
  })
  .option("amqp-encryption-key", {
    type: "string",
    requiresArg: false,
  })
  // http worker
  .option("http-poll-job-access-token", {
    type: "string",
    requiresArg: false,
  })
  .option("http-poll-job-url", {
    type: "string",
    requiresArg: false,
  })
  .option("http-poll-job-response-url", {
    type: "string",
    requiresArg: false,
  })
  .option("http-poll-job-every-ms", {
    type: "number",
    requiresArg: false,
    default: ms("15s"),
  })
  // other opts
  .option("log-worker-doing", {
    type: "boolean",
    requiresArg: false,
    default: false,
  });
const opts = parser.argv;
launch({
  id: process.env.ID || opts.id,
  type: process.env.TYPE || opts.type,
  logDest: process.env.LOG_DEST || opts["log-dest"],
  jobDir: process.env.JOB_DIR || opts["job-dir"],
  puppeteerLaunchOptionsPath: process.env.PUPPETEER_LAUNCH_OPTIONS_PATH || opts["puppeteer-launch-options-path"],
  // http worker
  httpPollJobUrl: process.env.HTTP_POLL_JOB_URL || opts["http-poll-job-url"],
  httpPollJobAccessToken: process.env.HTTP_POLL_JOB_ACCESS_TOKEN || opts["http-poll-job-access-token"],
  httpPollJobResponseUrl: process.env.HTTP_POLL_JOB_RESPONSE_URL || opts["http-poll-job-response-url"],
  httpPollJobEveryMs: process.env.HTTP_POLL_JOB_EVERY_MS || opts["http-poll-job-every-ms"],
  // rabbit worker
  rabbitmqConnectionString: process.env.RABBITMQ_CONNECTION_STRING || opts["rabbitmq-connection-string"],
  amqpEncryptionKey: process.env.AMQP_ENCRYPTION_KEY || opts["amqp-encryption-key"],
  // standalone
  schedulesDir: process.env.SCHEDULES_DIR || opts["schedules-dir"],
  // other
  logWorkerDoing: process.env.LOG_WORKER_DOING || opts["log-worker-doing"],
});
