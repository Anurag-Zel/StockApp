// utils/encryption.js

export async function importPublicKey(pem) {
  const pemBody = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, '')
    .replace(/-----END PUBLIC KEY-----/, '')
    .replace(/\s+/g, '');
  
  const binaryDer = Uint8Array.from(atob(pemBody), char => char.charCodeAt(0));

  return crypto.subtle.importKey(
    'spki',
    binaryDer.buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt']
  );
}

export async function encryptWithPublicKey(pemKey, data) {
  const publicKey = await importPublicKey(pemKey);
  const encodedData = new TextEncoder().encode(JSON.stringify(data));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    encodedData
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted))); // base64 encode
}
