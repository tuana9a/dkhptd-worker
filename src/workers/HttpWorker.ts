import oxias from "axios";
import { toPrettyErr } from "puppeteer-worker-job-builder";
import { Component } from "tu9nioc";
import { cfg } from "../configs";
import { PuppeteerWorkerController } from "../controllers";
import logger from "../logger";
import loop from "../loop";
import { toJson } from "../utils";


const axios = oxias.create();

@Component
export class HttpWorker {
  constructor(private puppeteerWorkerController: PuppeteerWorkerController) { }

  async start() {
    const puppeteerWorkerController = this.puppeteerWorkerController;
    loop.infinity(async () => {
      const jobInfo = await axios.get(cfg.httpPollJobUrl, { headers: { Authorization: cfg.httpPollJobAccessToken } }).then((res) => res.data).catch((err) => logger.error(err));
      if (!jobInfo) {
        return;
      }
      try {
        const { logs, vars } = await puppeteerWorkerController.do(jobInfo);
        const body = { id: jobInfo.id, workerId: cfg.id, logs, vars };
        axios.post(cfg.httpPollJobResponseUrl, toJson(body), {
          headers: {
            "Content-Type": "application/json",
            Authorization: cfg.httpPollJobAccessToken,
          },
        }).catch((err) => logger.error(err));
      } catch (err) {
        logger.error(err);
        const body = { workerId: cfg.id, err: toPrettyErr(err) };
        axios.post(cfg.httpPollJobResponseUrl, toJson(body), {
          headers: {
            "Content-Type": "application/json",
            Authorization: cfg.httpPollJobAccessToken,
          },
        }).catch((err1) => logger.error(err1));
      }
    }, cfg.httpPollJobEveryMs);
  }
}