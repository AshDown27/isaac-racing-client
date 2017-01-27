'use strict';

/*
    Child process that initializes the Steamworks API and generates a login ticket
*/

// Imports
const fs         = require('fs');
const path       = require('path');
const isDev      = require('electron-is-dev');
const tracer     = require('tracer');
const Raven      = require('raven');
const greenworks = require('greenworks'); // This is not an NPM module

/*
    Logging (code duplicated between main, renderer, and child processes because of require/nodeRequire issues)
*/

const logFile = (isDev ? 'Racing+.log' : path.resolve(process.execPath, '..', '..', 'Racing+.log'));
const log = tracer.console({
    format: "{{timestamp}} <{{title}}> {{file}}:{{line}}\r\n{{message}}",
    dateformat: "ddd mmm dd HH:MM:ss Z",
    transport: function(data) {
        // #1 - Log to the JavaScript console
        console.log(data.output);

        // #2 - Log to a file
        fs.appendFile(logFile, data.output + '\r\n', function(err) {
            if (err) {
                throw err;
            }
        });
    }
});
log.info("Child started: steam");

// Get the version
let packageFileLocation = path.join(__dirname, 'package.json');
let packageFile = fs.readFileSync(packageFileLocation, 'utf8');
let version = 'v' + JSON.parse(packageFile).version;

// Raven (error logging to Sentry)
Raven.config('https://0d0a2118a3354f07ae98d485571e60be:843172db624445f1acb86908446e5c9d@sentry.io/124813', {
    autoBreadcrumbs: true,
    release: version,
    environment: (isDev ? 'development' : 'production'),
}).install();

/*
    Handle errors
*/

process.on('uncaughtException', function(err) {
    process.send('error: ' + err);
});

/*
    Greenworks stuff
*/

// Create the "steam_appid.txt" that Greenworks expects to find in:
//   C:\Users\james\AppData\Local\Programs\RacingPlus\steam_appid.txt (in production)
//   or
//   D:\Repositories\isaac-racing-client\steam_appid.txt (in development)
// 570660 is the Steam app ID for The Binding of Isaac: Afterbirth+
fs.writeFileSync('steam_appid.txt', '250900', 'utf8');

// Initialize Greenworks
// We could use greenworks.init instead of initAPI for more verbose error messages
// However, we want to show a user-friendly error message to the user
if (greenworks.initAPI() === false) {
    // Don't bother sending this message to Sentry; the user not having Steam open is a fairly ordinary error
    process.send('errorInit');
    process.exit();
}

// Get the object that contains the computer's Steam ID and screen name
let steamIDObject = greenworks.getSteamId();

// Get a session ticket from Steam and login to the Racing+ server
greenworks.getAuthSessionTicket(function(ticket) {
    let ticketString = ticket.ticket.toString('hex'); // The ticket object contains other stuff that we don't care about
    process.send({
        id:         steamIDObject.steamId,
        screenName: steamIDObject.screenName,
        ticket:     ticketString,
    });
    process.exit();
}, function() {
    process.send('errorTicket');
    process.exit();
});