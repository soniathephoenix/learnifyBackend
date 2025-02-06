const request = require('supertest')
const app = require('../../app')
const { resetTestDB } = require('./config')
const jwt = require('jsonwebtoken')

describe('User API Endpoints', () => {
  let api

  beforeEach(async () => {
    await resetTestDB()
  })

  beforeAll(() => {
    api = app.listen(4000, () => {
      console.log('Test server running on port 4000')
    })
    // Create a JWT token
    token = jwt.sign({ login_id: 1,}, process.env.SECRET_TOKEN, { expiresIn: '1h' });
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
    }),
    it('POST /user/login with incorrect details responds with status 401', async () => {
        const userDetails = {username: "username1", password: "testi"}
        const response = await request(api).post('/users/login').send(userDetails);
    
        expect(response.statusCode).toBe(401)
    })
  });
  describe('POST /users/register', () => {
    it('responds to POST /user/login with a token', async () => {
      const userDetails = {
        "username": "test4",
        "password": "testing",
        "name": "T",
        "surname": "E",
        "email": "s@t.c"
    }

    const userDetailsReturned = {
        "username": "test4",
        "login_id": 3,
        "name": "T",
        "surname": "E",
        "email": "s@t.c"
    }
      const response = await request(api).post('/users/register').send(userDetails)
  
      expect(response.statusCode).toBe(201)
      expect(response.body).toStrictEqual(userDetailsReturned)
    })
  });
  describe('GET /users/currentq', () => {
    it('responds to GET /user/currentq with a question', async () => {
      const question1 = {
        "question_id": 1,
        "level": 1,
        "points_required": 0,
        "question": "Q1",
        "clue": '../images/clue1',
        "option_a": "A1",
        "option_b": "A2",
        "option_c": "A3",
        "option_d": "A4",
        "correct_answer": "CA1"
    }
      const response = await request(api).get('/users/currentq').set('Authorization', `${token}`);
  
      expect(response.statusCode).toBe(200)
      expect(response.body).toStrictEqual(question1)
    }),
    it('On unauthorised GET /user/currentq responds with forbidden', async () => {
        const response = await request(api).get('/users/currentq');
    
        expect(response.statusCode).toBe(403)
    })
  });
  describe('POST /users/update-points', () => {
    it('responds to POST /user/update-points with a one more point', async () => {
        const pointsResponse = {
            "user_id": 1,
            "points": 1,
            "level": 1
        }
      const response = await request(api).post('/users/update-points').set('Authorization', `${token}`);
  
      expect(response.statusCode).toBe(200)
      expect(response.body).toStrictEqual(pointsResponse)
    }),
    it('On unauthorised POST /user/update-points responds with forbidden', async () => {
        const response = await request(api).post('/users/update-points');
    
        expect(response.statusCode).toBe(403)
    })
  });
  describe('POST /users/reset-points', () => {
    it('responds to POST /user/reset-points with a one more point', async () => {
        const zeroPointsResponse = {
            "user_id": 1,
            "points": 1,
            "level": 1
        }

      await request(api).post('/users/update-points').set('Authorization', `${token}`);
      const response = await request(api).post('/users/reset-points').set('Authorization', `${token}`);
      const newPoints = await request(api).post('/users/update-points').set('Authorization', `${token}`);
  
      expect(response.statusCode).toBe(200)
      expect(response.body.message).toBe("Points reset successfully.")
      expect(newPoints.body).toStrictEqual(zeroPointsResponse)
    }),
    it('On unauthorised POST /user/update-points responds with forbidden', async () => {
        const response = await request(api).post('/users/reset-points');
    
        expect(response.statusCode).toBe(403)
    })
  });
})