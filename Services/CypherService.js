const crypto = require("crypto");

class Cypher {
    constructor() {
        this.password = crypto.scryptSync("workindiaapiroundsubmissionabcde", "salt", 32);
        this.iv = Buffer.from("workindiapiround", "utf-8");
    }
    
    encryptText(text) {
        const cipher = crypto.createCipheriv(
            "aes-256-cbc",
            this.password,
            this.iv
        );
        var encryptedText = cipher.update(text);
        encryptedText = Buffer.concat([encryptedText, cipher.final()]);
        return encryptedText.toString("hex"); 
    }

    decryptText(hex) {
        const decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            this.password,
            this.iv
        );
        var decryptedText = decipher.update(hex);
        decryptedText = Buffer.concat([decryptedText, decipher.final()]);
        return decryptedText.toString();
    }
}


module.exports = Cypher;