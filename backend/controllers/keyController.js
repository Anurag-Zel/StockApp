import fs from "fs";
import path from "path";

export const getPublicKey = (req, res) => {
  try {
    const publicKeyPath = path.join(process.cwd(), "keys", "public.pem");
    const publicKey = fs.readFileSync(publicKeyPath, "utf8");
    res.status(200).send(publicKey);
  } catch (error) {
    console.error("Error reading public key:", error);
    res.status(500).json({ message: "Unable to fetch public key" });
  }
};
