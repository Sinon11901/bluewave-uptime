/*const { 
    getMetrics, 
    getJobs, 
    addJob, 
    obliterateQueue 
} = require("../../controllers/queueController");

const { errorMessages, successMessages } = require('../../utils/messages');
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
const sslChecker = require('ssl-checker');
const jwt = require('jsonwebtoken');
const { getTokenFromHeaders } = require('../../utils/utils');

describe("JobQueueController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      jobQueue: {
        getMetrics: sinon.stub(),
        getJobStats: sinon.stub(),
        addJob: sinon.stub(),
        obliterate: sinon.stub(),
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
      send: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getMetrics", () => {
    it("should return metrics data on success", async () => {
      const mockMetrics = { jobCount: 5, completedJobs: 3 };
      req.jobQueue.getMetrics.resolves(mockMetrics);

      await getMetrics(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ success: true, msg: "Metrics retrieved", data: mockMetrics })).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should call next with error if getMetrics fails", async () => {
      const error = new Error("Metrics error");
      req.jobQueue.getMetrics.rejects(error);

      await getMetrics(req, res, next);

      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  });

  describe("getJobs", () => {
    it("should return job stats on success", async () => {
      const mockJobStats = { pendingJobs: 2, completedJobs: 3 };
      req.jobQueue.getJobStats.resolves(mockJobStats);

      await getJobs(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ jobs: mockJobStats })).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should call next with error if getJobs fails", async () => {
      const error = new Error("Job retrieval error");
      req.jobQueue.getJobStats.rejects(error);

      await getJobs(req, res, next);

      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  });

  describe("addJob", () => {
    it("should add a job and send success response", async () => {
      req.jobQueue.addJob.resolves();

      await addJob(req, res, next);

      expect(res.send.calledWith("Added job")).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should call next with error if addJob fails", async () => {
      const error = new Error("Job addition error");
      req.jobQueue.addJob.rejects(error);

      await addJob(req, res, next);

      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  });

  describe("obliterateQueue", () => {
    it("should obliterate the queue and send success response", async () => {
      req.jobQueue.obliterate.resolves();

      await obliterateQueue(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith("Obliterated queue")).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should call next with error if obliterateQueue fails", async () => {
      const error = new Error("Obliteration error");
      req.jobQueue.obliterate.rejects(error);

      await obliterateQueue(req, res, next);

      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  });
});
*/

const { 
  getMetrics, 
  getJobs, 
  addJob, 
  obliterateQueue 
} = require("../../controllers/queueController");

const { errorMessages, successMessages } = require('../../utils/messages');
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
const v8Profiler = require('v8-profiler-next');
const fs = require('fs');
const { expect } = require('chai'); // Ensure chai is installed

describe("JobQueueController", () => {
let req, res, next;

beforeEach(() => {
  req = {
    jobQueue: {
      getMetrics: sinon.stub(),
      getJobStats: sinon.stub(),
      addJob: sinon.stub(),
      obliterate: sinon.stub(),
    },
  };
  res = {
    status: sinon.stub().returnsThis(),
    json: sinon.stub(),
    send: sinon.stub(),
  };
  next = sinon.stub();
});

afterEach(() => {
  sinon.restore();
});

describe("getMetrics", () => {
  before(() => {
    // Začiatok profilovania
    v8Profiler.startProfiling("getMetrics Profile");
  });

  after(() => {
    // Ukončenie profilovania a export do súboru
    const profile = v8Profiler.stopProfiling("getMetrics Profile");
    profile.export((error, result) => {
      if (error) throw error;
      fs.writeFileSync('./getMetrics.cpuprofile', result);
      profile.delete();
    });
  });

  it("should return metrics data on success", async () => {
    const mockMetrics = { jobCount: 5, completedJobs: 3 };
    req.jobQueue.getMetrics.resolves(mockMetrics);

    await getMetrics(req, res, next);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ success: true, msg: "Metrics retrieved", data: mockMetrics })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it("should call next with error if getMetrics fails", async () => {
    const error = new Error("Metrics error");
    req.jobQueue.getMetrics.rejects(error);

    await getMetrics(req, res, next);

    expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
  });
});

// Rovnaký prístup môžete použiť na ďalšie testovacie bloky:
describe("getJobs", () => {
  before(() => {
    v8Profiler.startProfiling("getJobs Profile");
  });

  after(() => {
    const profile = v8Profiler.stopProfiling("getJobs Profile");
    profile.export((error, result) => {
      if (error) throw error;
      fs.writeFileSync('./getJobs.cpuprofile', result);
      profile.delete();
    });
  });

  it("should return job stats on success", async () => {
    const mockJobStats = { pendingJobs: 2, completedJobs: 3 };
    req.jobQueue.getJobStats.resolves(mockJobStats);

    await getJobs(req, res, next);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ jobs: mockJobStats })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it("should call next with error if getJobs fails", async () => {
    const error = new Error("Job retrieval error");
    req.jobQueue.getJobStats.rejects(error);

    await getJobs(req, res, next);

    expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
  });
});
});
