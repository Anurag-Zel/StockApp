import crypto from "crypto";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export const decryptOrderData = (encryptedData) => {
  const privateKeyPath = path.join(process.cwd(), "keys", "private.pem");
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");

  const buffer = Buffer.from(encryptedData, "base64");

  try {
    // Try native Node.js decryption (RSA-OAEP with SHA-256)
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      buffer
    );

    return JSON.parse(decrypted.toString("utf8"));
  } catch (err) {
    console.warn("Node.js crypto decryption failed, falling back to OpenSSL…", err.message);

    // OpenSSL fallback
    try {
      const encryptedPath = path.join(process.cwd(), "temp_encrypted.bin");
      fs.writeFileSync(encryptedPath, buffer);

      // Run OpenSSL decryption command
      const decrypted = execSync(
        `openssl rsautl -decrypt -inkey "${privateKeyPath}" -oaep -in "${encryptedPath}"`,
        { encoding: "utf8" }
      );

      fs.unlinkSync(encryptedPath);

      return JSON.parse(decrypted);
    } catch (fallbackErr) {
      console.error("OpenSSL decryption also failed:", fallbackErr.message);
      throw new Error("Decryption failed (Node.js and OpenSSL both)");
    }
  }
};

