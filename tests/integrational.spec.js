const axios = require('axios');

describe('API Script Tests (Real Requests)', () => {
  const AUTH_S = 'http://localhost:3001';
  const R_S = 'http://localhost:3002';

  it('should authenticate and retrieve profile', async () => {
    // Выполнение логина
    const loginRes = await axios.post(`${AUTH_S}/auth/login`, {
      username: 'john',
      password: 'changeme',
    });

    expect(loginRes.data).toHaveProperty('accessToken');
    expect(loginRes.data).toHaveProperty('refreshToken');

    const accessToken = loginRes.data.accessToken;

    // Получение профиля
    const profileRes = await axios.get(`${AUTH_S}/auth/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(profileRes.data).toHaveProperty('userId');
    expect(profileRes.data).toHaveProperty('username');
  });

  it('should add and retrieve resources', async () => {
    // Выполнение логина
    const loginRes = await axios.post(`${AUTH_S}/auth/login`, {
      username: 'john',
      password: 'changeme',
    });
    const accessToken = loginRes.data.accessToken;

    // Получение userId из профиля
    const profileRes = await axios.get(`${AUTH_S}/auth/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userId = profileRes.data.userId;

    // Добавление ресурса
    const addRes = await axios.post(
      `${AUTH_S}/auth/users/${userId}/resources`,
      { resource: 'resource-x' },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    expect(addRes.status).toBe(201);

    // Получение ресурсов
    const getRes = await axios.get(`${AUTH_S}/auth/users/${userId}/resources`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(getRes.data).toContain('resource-x');
  });

  it('should create routes and access them', async () => {
    // Выполнение логина
    const loginRes = await axios.post(`${AUTH_S}/auth/login`, {
      username: 'john',
      password: 'changeme',
    });
    const accessToken = loginRes.data.accessToken;

    // Создание маршрута
    const addRoute = await axios.post(
      `${R_S}/routes`,
      { resourceId: 'resource-x', internalUrl: 'http://resource-x:3000' },
      { headers: { Authorization: `Bearer ${accessToken}` }, }
    );

    expect(addRoute.data.message).toBe('Route added successfully');

    // Доступ к маршруту
    const accessRoute = await axios.post(`${R_S}/resource-x/some-resource`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    expect(accessRoute.data).toHaveProperty('message', 'Resource created successfully');
  });

  it('should remove resources and verify removal', async () => {
    // Выполнение логина
    const loginRes = await axios.post(`${AUTH_S}/auth/login`, {
      username: 'john',
      password: 'changeme',
    });
    const accessToken = loginRes.data.accessToken;

    // Получение userId из профиля
    const profileRes = await axios.get(`${AUTH_S}/auth/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userId = profileRes.data.userId;

    // Удаление ресурса
    const removeRes = await axios.post(
      `${AUTH_S}/auth/users/${userId}/resources/remove`,
      { resource: 'resource-x' },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

    expect(removeRes.status).toBe(201);

    // Получение ресурсов после удаления
    const getRes = await axios.get(`${AUTH_S}/auth/users/${userId}/resources`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(getRes.data).not.toContain('resource-x');
  });
});
