import { encodeHash } from "../../tools/hash.js";

const hashed_password = await encodeHash(1234);

export const usersInitials = [
  { firstname: 'Admin', lastname: 'Admin', email: 'sergiolongodev@gmail.com', password: hashed_password, permissions: { admin: true, user: true, guest: true } },
  { firstname: 'Sergio', lastname: 'Longo', email: 'sergiolongo@gmail.com', password: hashed_password, permissions: { admin: false, user: true, guest: false } },
  { firstname: 'Daniela', lastname: 'Livi', email: 'gdanielalivi@gmail.com', password: hashed_password, permissions: { admin: false, user: false, guest: true } }
]