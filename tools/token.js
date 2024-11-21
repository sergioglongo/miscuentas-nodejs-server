import moment from 'moment';
import jwt from 'jwt-simple';
import config from '../config/config.js';

export function createToken(user, from) {
  const payload = {
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix(),
  }

  let token_key;

  if (from === 'user') {
    token_key = config.token.user_token_key;
  }

  if (from === 'admin') {
    token_key = config.token.admin_token_key;
  }
 

  return jwt.encode(payload, token_key);
}


export function decodeToken(token, from) {
  const decoded = new Promise((resolve, reject) => {
    try {

      let token_key;

      if (from === 'user') {
        token_key = config.token.user_token_key;
      }

      if (from === 'admin') {
        token_key = config.token.admin_token_key;
      }

      const payload = jwt.decode(token, token_key);

      if (payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'El token ha expirado'
        })
      }
      resolve(payload.sub)
    } catch (err) {
      reject({
        status: 500,
        message: 'Invalid Token'
      })
    }
  })

  return decoded
}
