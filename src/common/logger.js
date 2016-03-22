'use strict'

const fs = require('fs');
const config = require('../config.global');

if (!fs.existsSync("./log")) {
    fs.mkdirSync("./log");
}

function log() {
    writeLog('', 'info', arguments);
}

function info() {
    writeLog('  ', 'info', arguments);
}

function warn() {
    writeLog("  ", 'warn', arguments);
}

function error() {
    writeLog("  ", 'error', arguments);
}

function debug() {
    writeLog("  ", 'debug', arguments);
}

const env = process.env.NODE_ENV || "development";
const consolePrint = config.debug && env !== 'test';

function writeLog(prefix, logType, args) {
    let filePrint = logType !== 'debug';

    if (!filePrint && !consolePrint) {
        return;
    }

    let infos = Array.prototype.slice.call(args);
    let logStr = infos.join(" ");

    switch (logType) {
        case "debug":
            logStr = logStr.gray;
            break;
        case 'warn':
            logStr = logStr.yellow;
            break;
        case 'error':
            logStr = logStr.red;
            break;
    }

    let line = prefix + logStr;

    if (filePrint) {
        fs.appendFile('./log/' + env + '.log', line + "\n");
    }
    if (consolePrint) {
        console.log(line);
    }
}

module.export = { log, info, debug, warn, error };