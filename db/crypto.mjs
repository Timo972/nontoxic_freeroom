import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export function encrypt(player) {
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(player.socialId.substring(0,32)), iv);
    let encrypted = cipher.update(JSON.stringify([player.pos, player.rot, player.health, player.armour, player.model, player.data]));
   
    encrypted = Buffer.concat([encrypted, cipher.final()]);
   
    return [player.hwidExHash, iv.toString('hex') + ':' + encrypted.toString('hex')];
   }
   
   export function decrypt(player) {
    text = fs.readFileSync(path.join(process.cwd(), './players', player.hwidExHash+'.usr'));
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(player.socialId.substring(0,32)), iv);
    let decrypted = decipher.update(encryptedText);
   
    decrypted = Buffer.concat([decrypted, decipher.final()]);
   
    return JSON.parse(decrypted.toString());
   }

   export default {encrypt, decrypt}