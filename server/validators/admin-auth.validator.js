'use strict';

const login = {
  body: {
    email:    { type: 'email',  required: true,  trim: true, maxLength: 255 },
    password: { type: 'string', required: true,  minLength: 6, maxLength: 200 },
  },
};

const refresh = {
  body: {
    refresh_token: { type: 'string', required: true, minLength: 20, maxLength: 4096 },
  },
};

const logout = refresh;

module.exports = { login, refresh, logout };
