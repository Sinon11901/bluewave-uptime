const {
  getAllMonitors,
  getMonitorById,
} = require('../../controllers/monitorController'); 

const { successMessages } = require('../../utils/messages'); 
const httpMocks = require('node-mocks-http'); 
const sinon = require('sinon'); 
const FakeDb = require('../../db/FakeDb'); 
const mockRequest = (data) => httpMocks.createRequest(data); 
const mockResponse = () => {
  const res = httpMocks.createResponse();
  res.json = sinon.stub().returns(res); 
  res.status = sinon.stub().returns(res); 
  return res;
};
const mockNext = sinon.stub(); 

describe('monitorController', () => {
  beforeEach(() => {
    sinon.stub(FakeDb, 'getAllMonitors'); 
    sinon.stub(FakeDb, 'getMonitorById'); 
  });

  afterEach(() => {
    sinon.restore(); 
  });

  describe('getAllMonitors', () => {
    it('should return all monitors successfully', async () => {
      const monitors = [{ id: 1, name: 'Monitor 1' }];
      FakeDb.getAllMonitors.resolves(monitors); 

      const req = mockRequest({ db: FakeDb }); 
      const res = mockResponse(); 

      await getAllMonitors(req, res, mockNext); 

      sinon.assert.calledWith(res.json, {
        success: true,
        msg: successMessages.MONITOR_GET_ALL,
        data: monitors,
      });
    });

    it('should call next with error when database fails', async () => {
      const error = new Error('Database error');
      FakeDb.getAllMonitors.rejects(error); 

      const req = mockRequest({ db: FakeDb }); 
      const res = mockResponse(); 

      await getAllMonitors(req, res, mockNext); 

      sinon.assert.calledOnce(mockNext); 
      sinon.assert.calledWith(mockNext, error); 
    });
  });

  describe('getMonitorById', () => {
    it('should return a monitor by ID', async () => {
      const monitor = { id: '123', name: 'Monitor 123' };
      FakeDb.getMonitorById.resolves(monitor); 

      const req = mockRequest({ db: FakeDb, params: { monitorId: '123' } }); 
      const res = mockResponse(); 

      await getMonitorById(req, res, mockNext); 

      sinon.assert.calledWith(res.json, {
        success: true,
        msg: successMessages.MONITOR_GET_BY_ID,
        data: monitor,
      });
    });

    it('should return 404 when monitor is not found', async () => {
      FakeDb.getMonitorById.resolves(null);
    
      const req = mockRequest({
        db: FakeDb,
        params: { monitorId: '13548795' },
      });
      const res = mockResponse(); 
      const next = sinon.spy(); 
    
      await getMonitorById(req, res, next); 
    
      sinon.assert.calledOnce(next); 
      sinon.assert.calledWith(next, sinon.match.has('status', 404)); 
      sinon.assert.calledWith(next, sinon.match.has('message', 'Monitor not found')); 
    });
  });
  
});
