import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export const encryptString = (value: string, secretKey: string): string => {
  const iv = randomBytes(16); // Genera un IV aleatorio
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Guardamos IV + texto cifrado
}

export const decryptString = (value: string, secretKey: string): string => {
  const [iv, encrypted] = value.split(':');
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}