const ms = require("ms");
const yargs = require("yargs");

require('dotenv').config();

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

launch({
  id: process.env.ID || parser.argv.id,
  type: process.env.TYPE || parser.argv.type,
  logDest: process.env.LOG_DEST || parser.argv["log-dest"],
  jobDir: process.env.JOB_DIR || parser.argv["job-dir"],
  puppeteerLaunchOptionsPath: process.env.PUPPETEER_LAUNCH_OPTIONS_PATH || parser.argv["puppeteer-launch-options-path"],
  // http worker
  httpPollJobUrl: process.env.HTTP_POLL_JOB_URL || parser.argv["http-poll-job-url"],
  httpPollJobAccessToken: process.env.HTTP_POLL_JOB_ACCESS_TOKEN || parser.argv["http-poll-job-access-token"],
  httpPollJobResponseUrl: process.env.HTTP_POLL_JOB_RESPONSE_URL || parser.argv["http-poll-job-response-url"],
  httpPollJobEveryMs: process.env.HTTP_POLL_JOB_EVERY_MS || parser.argv["http-poll-job-every-ms"],
  // rabbit worker
  rabbitmqConnectionString: process.env.RABBITMQ_CONNECTION_STRING || parser.argv["rabbitmq-connection-string"],
  amqpEncryptionKey: process.env.AMQP_ENCRYPTION_KEY || parser.argv["amqp-encryption-key"],
  // standalone
  schedulesDir: process.env.SCHEDULES_DIR || parser.argv["schedules-dir"],
  // other
  logWorkerDoing: process.env.LOG_WORKER_DOING || parser.argv["log-worker-doing"],
});
