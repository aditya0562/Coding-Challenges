    import * as fs from "fs";
    import * as path from "path";
    import * as readline from "readline";

    const projectRoot = path.resolve(__dirname, '..');


    const arguements = process.argv.slice(2);

    let commands = arguements.filter(arg => arg.startsWith('-'));
    const filename = arguements.find(arg => !arg.startsWith('-'));

    const filePath = path.join(projectRoot, filename || 'test.txt');

    if(commands.length == 0){
        commands = ['-w', '-l', '-m'];
    }

    const countLines = async(filePath: string) => {
        return new Promise((resolve, reject) => {
            let fileStream;
            if(process.stdin.isTTY){
                fileStream = fs.createReadStream(filePath);
            }
            else{
                fileStream = process.stdin;
            }
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
            let lineCount = 0;
            rl.on('line', line => {
                lineCount++;
            })
            rl.on('close', () => {
                resolve(lineCount);
            })
            rl.on('error', reject);
        })
    }

    const countCharacters = async(filePath: string) => {
        return new Promise((resolve, reject) => {
            let fileStream;
            if(process.stdin.isTTY){
                fileStream = fs.createReadStream(filePath, 'utf8');
            }
            else{
                fileStream = process.stdin;
            }
            let charCount = 0;
            fileStream.on('data', (chunk: any) => {
                charCount+= chunk.length;
            }) 
            fileStream.on('close', () => {
                resolve(charCount);
            })
            fileStream.on('error', reject);
        })
    }

    const countBytes = async() => {
        return new Promise((resolve, reject) => {
            let fileStream;
            if(process.stdin.isTTY){
                fileStream = fs.createReadStream(filePath);
            }
            else{
                fileStream = process.stdin;
            }
            let byteCount = 0;
            fileStream.on('data', (chunk: any) => {
                byteCount+= Buffer.byteLength(chunk);
            }) 
            fileStream.on('close', () => {
                resolve(byteCount);
            })
            fileStream.on('error', reject);

        })
    }

    const countWords = async() => {
        return new Promise((resolve, reject) => {
            let fileStream;
            if(process.stdin.isTTY){
                fileStream = fs.createReadStream(filePath, 'utf8');
            }
            else{
                fileStream = process.stdin;
            }
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
            let wordCount = 0;
            rl.on('line', (line) => {
                const words = line.trim().split(/\s+/).filter(Boolean);
                wordCount+= words.length;
            })
            rl.on('close', () => resolve(wordCount));
            rl.on('error', reject);
        })
    }

    let output: string = "";
    async function executeCommands(commands: string[], filePath: string ) {
        for(const command of commands) {
            switch(command){
                case "-c": {
                    const bytesCount = await countBytes();
                    output+= `${bytesCount} `;
                    break;
                }
                case "-l": {
                    const lines = await countLines(filePath);
                    output+= `${lines} `;
                    break;
                }
                case "-w": {
                    const wordCount = await countWords();
                    output+= `${wordCount} `;  
                    break;          
                }
                case "-m": {
                    const charCount = await countCharacters(filePath);
                    output+= `${charCount} `;
                    break;         
                }
            } 
        }
        console.log(output, filename || '');
    }

    executeCommands(commands, filePath)


