// const bcrypt = require('bcrypt');
import bcrypt from 'bcrypt'; 

export async function encodeHash(word) {

  try {
    let hashed_password = await bcrypt.hash(word, 10)
    return hashed_password
  } catch (error) {
    return error
  }

}

export async function compareHash(word, compare_word) {

  try {
    let compared_hash = bcrypt.compare(word,compare_word);
    return compared_hash;
  } catch (error) {
    return error
  }


}