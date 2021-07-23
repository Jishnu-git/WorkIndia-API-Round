require("dotenv").config();
const crypto = require("crypto");

const password = crypto.scryptSync("workindiaapiroundsubmissionabcde", "salt", 32);
const iv = Buffer.from("workindiapiround", "utf-8");
const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    password,
    iv
);
const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    password,
    iv
);


function encryptText(text) {
    var encryptedText = cipher.update(text);
    encryptedText = Buffer.concat([encryptedText, cipher.final()]);
    return encryptText.toString("hex"); 
}

function decryptText(hex) {
    var decryptedText = decipher.update(hex);
    decryptedText = Buffer.concat([decryptedText, decipher.final()]);
    return decryptedText.toString();
}

module.exports = {
    encryptText,
    decryptText
}