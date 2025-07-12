import fs from "fs";
import path from "path";
import crypto from "crypto";

const keyDir = path.join(process.cwd(), "keys");
const privatePath = path.join(keyDir, "private.pem");
const publicPath = path.join(keyDir, "public.pem");

function generateKeys() {
  if (!fs.existsSync(privatePath) || !fs.existsSync(publicPath)) {
    console.log("Generating new 2048-bit RSA-OAEP key pair…");

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki", // Required by SubtleCrypto
        format: "pem"
      },
      privateKeyEncoding: {
        type: "pkcs8", // Recommended modern private key format
        format: "pem"
      }
    });

    fs.mkdirSync(keyDir, { recursive: true });
    fs.writeFileSync(privatePath, privateKey);
    fs.writeFileSync(publicPath, publicKey);
    try { fs.chmodSync(privatePath, 0o600); } catch {}

    console.log(`Keys saved to ${keyDir}/`);
  } else {
    console.log("Keys already exist —> generation skipped.");
  }
}

generateKeys();
