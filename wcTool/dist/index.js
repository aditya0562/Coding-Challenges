"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const projectRoot = path.resolve(__dirname, '..');
const arguements = process.argv.slice(2);
let commands = arguements.filter(arg => arg.startsWith('-'));
const filename = arguements.find(arg => !arg.startsWith('-'));
const filePath = path.join(projectRoot, filename || 'test.txt');
if (commands.length == 0) {
    commands = ['-w', '-l', '-m'];
}
const countLines = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let fileStream;
        if (process.stdin.isTTY) {
            fileStream = fs.createReadStream(filePath);
        }
        else {
            fileStream = process.stdin;
        }
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        let lineCount = 0;
        rl.on('line', line => {
            lineCount++;
        });
        rl.on('close', () => {
            resolve(lineCount);
        });
        rl.on('error', reject);
    });
});
const countCharacters = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let fileStream;
        if (process.stdin.isTTY) {
            fileStream = fs.createReadStream(filePath, 'utf8');
        }
        else {
            fileStream = process.stdin;
        }
        let charCount = 0;
        fileStream.on('data', (chunk) => {
            charCount += chunk.length;
        });
        fileStream.on('close', () => {
            resolve(charCount);
        });
        fileStream.on('error', reject);
    });
});
const countBytes = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let fileStream;
        if (process.stdin.isTTY) {
            fileStream = fs.createReadStream(filePath);
        }
        else {
            fileStream = process.stdin;
        }
        let byteCount = 0;
        fileStream.on('data', (chunk) => {
            byteCount += Buffer.byteLength(chunk);
        });
        fileStream.on('close', () => {
            resolve(byteCount);
        });
        fileStream.on('error', reject);
    });
});
const countWords = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let fileStream;
        if (process.stdin.isTTY) {
            fileStream = fs.createReadStream(filePath, 'utf8');
        }
        else {
            fileStream = process.stdin;
        }
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        let wordCount = 0;
        rl.on('line', (line) => {
            const words = line.trim().split(/\s+/).filter(Boolean);
            wordCount += words.length;
        });
        rl.on('close', () => resolve(wordCount));
        rl.on('error', reject);
    });
});
let output = "";
function executeCommands(commands, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const command of commands) {
            switch (command) {
                case "-c": {
                    const bytesCount = yield countBytes();
                    output += `${bytesCount} `;
                    break;
                }
                case "-l": {
                    const lines = yield countLines(filePath);
                    output += `${lines} `;
                    break;
                }
                case "-w": {
                    const wordCount = yield countWords();
                    output += `${wordCount} `;
                    break;
                }
                case "-m": {
                    const charCount = yield countCharacters(filePath);
                    output += `${charCount} `;
                    break;
                }
            }
        }
        console.log(output, filename || '');
    });
}
executeCommands(commands, filePath);
//# sourceMappingURL=index.js.map