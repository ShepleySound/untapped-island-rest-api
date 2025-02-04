'use strict';

const supertest = require('supertest');
const { app } = require('../src/server');
const mockRequest = supertest(app);

let userData = {
  username: 'user',
  password: 'test',
};

describe('User Routes', () => {
  test('Can create a new user', async () => {
    const response = await mockRequest.post('/signup').send(userData);
    userData.id = response.body.id;

    expect(response.status).toEqual(201);
    expect(response.body.userId).toBeDefined();
    expect(response.body.user).toEqual(userData.username);
  })
  test('Fail to create a new user with no password', async () => {
    const response = await mockRequest.post('/signup').send({ username: 'fail' });

    expect(response.status).toEqual(500);
    expect(response.body.message).toEqual('signup error occurred');
  })
  test('Fail to create a new user when username already exists', async () => {
    const response = await mockRequest.post('/signup').send(userData);

    expect(response.status).toEqual(500);
    expect(response.body.message).toEqual('Username already exists.');
  })

  test('Can sign in to an existing user', async () => {
    const response = await mockRequest.post('/signin').auth(userData.username, userData.password);
    userData.token = response.body.accessToken;

    expect(response.status).toEqual(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user).toEqual(userData.username);
  })
  test('Fail to sign in to an existing user with no authorization information', async () => {
    const responseName = await mockRequest.post('/signin');
    expect(responseName.status).toEqual(401);
    expect(responseName.text).toEqual('Not Authorized');
  })
  test('Fail to sign in to an existing user with the wrong username or password', async () => {
    const responseName = await mockRequest.post('/signin').auth('fail', userData.password);
    expect(responseName.status).toEqual(500);
    expect(responseName.body.message).toEqual('Invalid username or password');

    const responsePass = await mockRequest.post('/signin').auth(userData.username, 'fail');
    expect(responsePass.status).toEqual(500);
    expect(responsePass.body.message).toEqual('Invalid username or password');
  })

  test('Get all users', async () => {
    const userList = await mockRequest.get('/users').set('Authorization', `Bearer ${userData.token}`);

    expect(userList.status).toEqual(200);
    expect(userList.body.results[0].name).toBeDefined();
  })
  test('Get one user', async () => {
    const response = await mockRequest.get(`/users/${userData.username}`).set('Authorization', `Bearer ${userData.token}`);

    expect(response.status).toEqual(200);
    expect(response.text).toEqual(userData.username);
  })

  test('Update a user', async () => {
    let newUserData = {
      username: `${userData.username}new`,
      password: 'new pass'
    }
    const response = await mockRequest.put(`/users/${userData.username}`).set('Authorization', `Bearer ${userData.token}`).send(newUserData);
    userData = newUserData;
    userData.token = response.body.accessToken

    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual(userData.username);
    expect(response.body.accessToken).toBeDefined();
  })
  
  test('Delete a user', async () => {
    const response = await mockRequest.delete(`/users/${userData.username}`).set('Authorization', `Bearer ${userData.token}`)
    const verify = await mockRequest.get(`/users/${userData.username}`).set('Authorization', `Bearer ${userData.token}`)
    
    expect(response.status).toEqual(200)
    expect(response.text).toEqual(`${userData.username} deleted`)
    expect(verify.status).toEqual(500);
    expect(verify.body.message).toEqual(`User ${userData.username} not found.`)
  })
  test('Fail to delete a user that does not exist', async () => {
    const response = await mockRequest.delete(`/users/${userData.username}`).set('Authorization', `Bearer ${userData.token}`)
    const verify = await mockRequest.get(`/users/${userData.username}`).set('Authorization', `Bearer ${userData.token}`)
    
    expect(response.status).toEqual(500)
    expect(response.body.message).toEqual('Delete error occurred')
  })
  test('Fail to update a user that does not exist', async () => {
    const response = await mockRequest.put(`/users/${userData.username}`).set('Authorization', `Bearer ${userData.token}`).send(userData);
    expect(response.status).toEqual(500);
    expect(response.body.message).toEqual('update error occurred');
  })
  test('Fail to delete a user you do not own', async () => {
    const response = await mockRequest.delete(`/users/other${userData.username}`).set('Authorization', `Bearer ${userData.token}`)
    const verify = await mockRequest.get(`/users/${userData.username}`).set('Authorization', `Bearer ${userData.token}`)
    
    expect(response.status).toEqual(500)
    expect(response.body.message).toEqual('Cannot delete an account you do not own')
  })
  test('Fail to update a user you do not own', async () => {
    const response = await mockRequest.put(`/users/other${userData.username}`).set('Authorization', `Bearer ${userData.token}`).send(userData);
    expect(response.status).toEqual(500);
    expect(response.body.message).toEqual('Cannot edit an account you do not own');
  })
})