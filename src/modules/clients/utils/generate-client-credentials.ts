import { randomBytes } from 'crypto';

export function generateClientId() {
  // short readable id, tweak as you like (nanoid is an option)
  return `c_${randomBytes(8).toString('hex')}`;
}

export function generateClientSecret() {
  return randomBytes(32).toString('base64url'); // safe secret
}

export function generateClientCredentials() {
  return { clientId: generateClientId(), clientSecret: generateClientSecret() };
}
