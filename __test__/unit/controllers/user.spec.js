const userController = require('../../../controllers/user')
const User = require('../../../models/User')
const jwt = require('jsonwebtoken'); // Ensure you're importing jwt

// Mocking response methods
const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

// we are mocking .send(), .json() and .end()
const mockStatus = jest.fn(() => ({ 
  send: mockSend, 
  json: mockJson, 
  end: mockEnd 
}));

const mockRes = { status: mockStatus };


describe('Users controller', () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe('register', () => {
    it('should return user with a status code 201', async () => {
      const testUser = {username: "Test", password: "testing", login_id: 1}
      const req = {body: {username: testUser.username, password: testUser.password}}
      jest.spyOn(User, 'create').mockResolvedValue(new User(testUser))

      await userController.register(req, mockRes)
      
      expect(User.create).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(201)
      expect(mockJson).toHaveBeenCalledWith(testUser)
    })

    it('should return an error upon failure when no password submitted', async () => {
        const testUser = {username: "Test", login_id: 1}
        const req = {body: {username: testUser.username, password: testUser.password}}

        await userController.register(req, mockRes)
  
        expect(mockStatus).toHaveBeenCalledWith(400)
        expect(mockJson).toHaveBeenCalledWith({ error: 'data and salt arguments required' })
    })
  })

  describe('login', () => {
    it('should return user with a status code 200', async () => {
      const testUser = {username: "Test", password: "$2b$10$WoP3NXT3j2iSJfCB3iSWguqddO3FUffoilTDYrZhnclYEDeBVqoKG", login_id: 1}
      const req = {body: {username: testUser.username, password: "testing"}}
      jest.spyOn(User, "getOneByUsername").mockResolvedValue(new User(testUser))
      jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options, callback) => {
        callback(null, 'mocked-token'); // Simulate token generation with a mocked token
    });
      
      await userController.login(req, mockRes)
      
      expect(User.getOneByUsername).toHaveBeenCalledTimes(1)
      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockJson).toHaveBeenCalledWith({success: true, token: 'mocked-token'})
    })
  })
})