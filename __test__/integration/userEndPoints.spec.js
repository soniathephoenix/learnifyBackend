const request = require('supertest')
const app = require('../../app')
const { resetTestDB } = require('./config')

describe('User API Endpoints', () => {
  let api

  beforeEach(async () => {
    await resetTestDB()
  })

  beforeAll(() => {
    api = app.listen(4000, () => {
      console.log('Test server running on port 4000')
    })
  })

  afterAll((done) => {
    console.log('Gracefully closing server')
    api.close(done)
  })

  describe('GET /', () => {
    it('responds to GET / with a message and a description', async () => {
      const response = await request(api).get('/')
  
      expect(response.statusCode).toBe(200)
      expect(response.body.name).toBe('Geography puzzle')
      expect(response.body.description).toBe('A puzzle for GCSE geography students')
    })
  });
  describe('POST /users/login', () => {
    it('responds to POST /user/login with a token', async () => {
      const userDetails = {username: "username1", password: "testing"}
      const response = await request(api).post('/users/login').send(userDetails)
  
      expect(response.statusCode).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body).toHaveProperty('token')
    })
  });
})