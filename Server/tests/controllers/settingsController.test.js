
const { 
    getAppSettings, 
    updateAppSettings 
} = require("../../controllers/settingsController");
const { errorMessages, successMessages } = require('../../utils/messages');
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
const sslChecker = require('ssl-checker');
const jwt = require('jsonwebtoken');
const { getTokenFromHeaders } = require('../../utils/utils');
const { updateAppSettingsBodyValidation } = require("../../validation/joi");

describe("SettingsController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      settingsService: {
        getSettings: sinon.stub(),
        reloadSettings: sinon.stub(),
      },
      db: {
        updateAppSettings: sinon.stub(),
      },
      body: {}
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getAppSettings", () => {
    it("should return app settings without jwtSecret", async () => {
      const mockSettings = { jwtSecret: "secret", appName: "BlueWave" };
      req.settingsService.getSettings.resolves(mockSettings);

      await getAppSettings(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        msg: successMessages.GET_APP_SETTINGS,
        data: { appName: "BlueWave" },
      })).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should call next with error if retrieval fails", async () => {
      const error = new Error("Error retrieving settings");
      req.settingsService.getSettings.rejects(error);

      await getAppSettings(req, res, next);

      expect(next.calledOnceWith(error)).to.be.true;
    });
  });

  describe("updateAppSettings", () => {
    it("should validate, update settings, and return updated settings", async () => {
      req.body = { appName: "NewAppName" };
      sinon.stub(updateAppSettingsBodyValidation, "validateAsync").resolves();
      req.db.updateAppSettings.resolves();
      const updatedSettings = { appName: "NewAppName" };
      req.settingsService.reloadSettings.resolves(updatedSettings);

      await updateAppSettings(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        msg: successMessages.UPDATE_APP_SETTINGS,
        data: updatedSettings,
      })).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it("should call next with validation error on invalid input", async () => {
      const validationError = new Error("Validation Error");
      sinon.stub(updateAppSettingsBodyValidation, "validateAsync").rejects(validationError);

      await updateAppSettings(req, res, next);

      expect(next.calledOnceWith(validationError)).to.be.true;
      expect(res.status.notCalled).to.be.true;
    });

    it("should call next with error if update fails", async () => {
      req.body = { appName: "NewAppName" };
      sinon.stub(updateAppSettingsBodyValidation, "validateAsync").resolves();
      const updateError = new Error("Update Error");
      req.db.updateAppSettings.rejects(updateError);

      await updateAppSettings(req, res, next);

      expect(next.calledOnceWith(updateError)).to.be.true;
      expect(res.status.notCalled).to.be.true;
    });
  });
});