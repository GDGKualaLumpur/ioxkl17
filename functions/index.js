const functions = require('firebase-functions');
const google = require('googleapis');
const moment = require('moment');
const md5 = require("blueimp-md5");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

let auth;
let options = {};


exports.makeConfirmation = functions.https.onRequest((request, response) => {
    console.log(request.query.hash);
    console.log(request.query.confirmation);
    console.log(request.method);

    readData()
        .then(() => checkDeadline())
        .then(() => initApp())
        .then(_ => initSpreadsheet())
        .then(rows => updateSpreadsheet(rows, request.query.hash))
        .then(data => updateData(data.row, data.rows, data.updateRow, request.query.confirmation))
        //todo
        .then(result => response.redirect(`${options.redirect_to}?msg=${result}`))
        .catch(reason => response.send("Something went wrong, your confirmation is not confirmed. Please contact JT via email: jt@gdg.my\nError: " + reason));
});

exports.ticket = functions.https.onRequest((req, res) => {
    msg = req.query.msg;
    res.status(200).send(`<!doctype html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">
        <title>Google I/O Extended 2017 Kuala Lumpur</title>
        <link rel="icon" href="https://ioxkl17.firebaseapp.com/images/favicon.png">
        <meta http-equiv="refresh" content="5;url=https://ioxkl17.firebaseapp.com/" />
        <style>
            body {
                -webkit-box-pack: center;
                    -ms-flex-pack: center;
                        justify-content: center;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                    -ms-flex-direction: column;
                        flex-direction: column;
                min-height: 100vh;
                text-align: center;
                font-family: Roboto, sans-serif;
                padding: 0 12px;
            }
            img {
                margin: 24px auto;
                max-width: 240px;
            }
            .big {
                font-weight: 500;
                font-size: 1.4em;
                margin: 32px 0 4px 0;
                color: #212121;
            }
            p {
                color: #424242;
                font-size: 0.95em;
            }
            a {
                color: #2047fd;
                font-weight: 500;
            }
        </style>
    </head>
    <body>
        <img src="https://ioxkl17.firebaseapp.com/images/io.svg">
        <p class="big">${msg}</p>
        <p>You will be redirected automatically in 5 seconds, or click <a href="https://ioxkl17.firebaseapp.com/">here</a>.</p>
    </body>
  </html>`);
});

function readData() {
    console.log('readData');
    return new Promise((resolve, reject) => {
        admin.database().ref('/admin').once('value', (data) => {
            options = data.val();
            console.log(options);
            resolve();
        }, (error) => {
            reject(error.code);
        })
    });
}

function checkDeadline() {
    console.log('checkDeadline');
    const deadline = moment(options.deadline);
    return new Promise((resolve, reject) => {
        if (deadline.diff(moment(), 'days') < 0) {
            reject(options.deadline_text)
        }
        resolve();
    });

}

function initApp() {
    console.log('initApp');
    return new Promise((resolve, reject) => {
        let jwtClient = new google.auth.JWT(
            options.service_email,
            null,
            options.private_key,
            ['https://www.googleapis.com/auth/spreadsheets'],
            null
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
            }
            auth = jwtClient;
            resolve();
        });
    })
}

function initSpreadsheet() {
    console.log('initSpreadsheet');
    return new Promise((resolve, reject) => {
        let sheets = google.sheets('v4');
        sheets.spreadsheets.values.get({
            auth: auth,
            spreadsheetId: options.spreadsheet_id,
            range: options.spreadsheet_range,
        }, function (err, response) {
            if (err) {
                reject('The API returned an error: ' + err);
            }
            let rows = response.values;
            if (rows.length == 0) {
                reject('No data found.');
            } else {
                resolve(rows)
            }
        });
    });
}

function updateSpreadsheet(rows, hash) {
    console.log('updateSpreadsheet');

    return new Promise((resolve, reject) => {
        let email = getHeaderIndex(rows, "email");
        for (let i = 1; i < rows.length; i++) {
            let row = rows[i];
            if (hashMD5(row[email].toLowerCase(), options.hash) === hash) {
                resolve({ row, rows, updateRow: i })
            }
        }
        reject("Record not found")
    });

}

function updateData(row, rows, i, confirmation) {
    console.log(`update ${row}`);
    let sheets = google.sheets('v4');
    let name = getHeaderIndex(rows, "name");
    let status = getHeaderIndex(rows, "status");
    return new Promise((resolve, reject) => {
        if (row[status] === "CONFIRMED") {
            resolve(options.already_confirmation_text);
        } else if (row[status] === "CANCELLED") {
            resolve(options.already_cancellation_text);
        }
        let requests = [];
        requests.push(getWriteCellRequest(i, status, confirmation));
        let batchUpdateRequest = { requests: requests };
        sheets.spreadsheets.batchUpdate({
            spreadsheetId: options.spreadsheet_id,
            auth: auth,
            resource: batchUpdateRequest
        }, function (err, response) {
            if (err) {
                reject(err);
            }
            if (confirmation == "cancel") {
                resolve(options.cancellation_text)
            } else {
                resolve(options.confirmation_text)
            }

        });
    })
}

function getWriteCellRequest(row, column, confirmation) {
    console.log('getWriteCellRequest');
    let textToWrite, color;
    if (confirmation == "cancel") {
        textToWrite = "CANCELLED";
        color = { red: 1 }
    } else {
        textToWrite = "CONFIRMED";
        color = { green: 1 };
    }
    return {
        updateCells: {
            start: {
                sheetId: options.sheet_id,
                rowIndex: row,
                columnIndex: column
            },
            rows: [
                {
                    values: {
                        userEnteredValue: {
                            stringValue: textToWrite
                        },
                        userEnteredFormat: {
                            textFormat: {
                                bold: true
                            },
                            backgroundColor: color
                        }
                    }
                }
            ],
            fields: 'userEnteredValue,userEnteredFormat'
        }
    };
}

function getHeaderIndex(rows, headerName) {
    console.log('getHeaderIndex: ' + headerName);
    let row = rows[0];
    for (let column = 0; column < row.length; column++) {
        if (row[column].toLowerCase() === headerName.toLowerCase()) {
            return column;
        }
    }
    return -1;
}

function hashMD5(email, salt) {
    let hash = md5(email + salt);
    console.log('hashMD5: ' + hash);
    return hash;
}
