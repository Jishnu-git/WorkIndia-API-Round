const { Cipher } = require("crypto");
const express = require("express");
const app = express();
const session = require("express-session");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("Static/HTML"));
app.use(express.static("Static/JS"));
app.use(session({
    secret: "WorkIndia",
    saveUninitialized: false,
    resave: false,
    unset: "destroy",
    cookie: {maxAge: 3600 * 24 * 1000}
}));


const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    password: "",
    user: "root",
    database: "workindia"
});
db.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }

    console.log("successfully connected");
});

const Cypher = require("./Services/CypherService");

app.post("/app/login/", (req, res) => {
    const user = req.body;
    db.query("SELECT COUNT(*) AS valid FROM users WHERE username = ? AND password = ?", [user.username, user.password], (err, result) => {
        if (err || result[0].valid == 0) {
            res.json({
                status: "failure",
                reason: err | "Invalid username"
            });
        }
        req.session.user = user.username;
            res.json({
                status: "success"
            });
    });
});

app.post("/app/logout/", (req, res) => {
    req.session.user = null;
    res.json({
        status: "success"
    });
})

app.post("/app/register/", (req, res) => {
    const user = req.body;
    db.query("INSERT INTO users VALUES(? ,?)", [user.username, user.password], (err, result) => {
        if (err) {
            res.json({
                status: "failure",
                reason: err
             });
        } else {
            res.json({
                status: "success"
            });
        }
    });
})

app.get("/app/sites/list/", (req, res) => {
    const user = "test" //req.session.user;
    if (!user) {
        res.json({
            status: "failure",
            reason: "session timed out"
        });
    } else {
        db.query(`SELECT website, website_username as user_id, website_password as password
                  FROM saved_passwords WHERE username = ?`, [user], (err, result) => {
                     if (err) {
                         res.json({
                            status: "failure",
                            reason: err
                         });
                     } else {
                         res.json(result);
                     }   
                  });
    }
});

app.post("/app/sites/", (req, res) => {
    const user = "test" //req.session.user;
    const password = req.body;
    if (!user) {
        res.json({
            status: "failure",
            reason: "session timed out"
        });
    } else {
        db.query("INSERT INTO saved_passwords VALUES(?, ?, ?, ?)", [password.website, password.username, Cypher.encryptText(password.password), user],
        (err, result) => {
            if (err) {
                res.json({
                    status: "failure",
                    reason: err
                });
            } else {
                res.json({
                    status: "success"
                });
            }
        });
    }
});

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Listening on port 3000");
    console.log(Cypher.encryptText("hello world"));
})

