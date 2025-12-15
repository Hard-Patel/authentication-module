import * as crypto from 'crypto';

export async function verifySignature({
  publicKey,
  algorithm,
  challenge,
  signature,
}: {
  publicKey: string;
  algorithm: string;
  challenge: string;
  signature: string;
}) {
  const verifier = crypto.createVerify('SHA256');
  verifier.update(challenge);
  verifier.end();

  return verifier.verify(publicKey, Buffer.from(signature, 'base64'));
}
