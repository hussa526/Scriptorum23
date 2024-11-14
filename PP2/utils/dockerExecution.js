import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const execPromise = promisify(exec);

const dockerImages = {
    'javascript': 'node:18', // Base image, we will build a custom image from it
    'python': 'python:3.9',
    'c': 'gcc:latest',
    'c++': 'gcc:latest',
    'java': 'openjdk:17',
    'ruby': 'ruby:3.0',
    'go': 'golang:1.19',
    'rust': 'rust:1.68',
    'php': 'php:8.0',
    'perl': 'perl:latest',
    'swift': 'swift:5.7',
    'haskell': 'haskell:8.10',
    'r': 'rocker/r-ver:4.1.0',
};

// Create a temporary file for the code
function temporaryFile(language) {
    return language === 'java' ? `Main` : `temp_${language}_${uuidv4()}`;
}

function safeUnlink(file) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}

async function imageExists(imageTag) {
    try {
        const { stdout } = await execPromise(`sudo docker images -q ${imageTag}`);
        return stdout.trim() !== ''; // Returns true if image exists, false otherwise
    } catch (error) {
        console.error('Error checking image:', error);
        return false;
    }
}

// Main execution function
export async function codeExecution(language, code, stdin) {
    const extension = language === 'javascript' ? '.js' :
                      language === 'python' ? '.py' :
                      language === 'c' ? '.c' :
                      language === 'cpp' ? '.cpp' : 
                      language === 'java' ? '.java' :
                      language === 'go' ? '.go' :
                      language === 'haskell' ? '.hs' :
                      language === 'lua' ? '.lua' :
                      language === 'perl' ? '.pl' :
                      language === 'php' ? '.php' :
                      language === 'r' ? '.R' :
                      language === 'ruby' ? '.rb' :
                      language === 'rust' ? '.rs' :
                      language === 'swift' ? '.swift' :
                      null;

    if (!extension) { // || !dockerImages[language]) {
        return { error: "Unsupported language" };
    }

    const compiledFile = temporaryFile(language);
    const sourceFile = `${compiledFile}${extension}`;
    const inputFile = stdin ? `${compiledFile}_input.txt` : undefined;
    const outputFile = `${compiledFile}_output.txt`;
    const errorFile = `${compiledFile}_error.txt`;

    const imageTag = `${language}_image`;

    try {
        // Write code and input to files
        fs.writeFileSync(sourceFile, code);
        if (stdin) fs.writeFileSync(inputFile, stdin);

        const imageExist = await imageExists(imageTag);
        if (!imageExist) {
            // Build the Docker image if it doesn't exist
            const dockerBuildCommand = `sudo docker build -t ${imageTag} -f docker/Dockerfile.${language} .`;
            await execPromise(dockerBuildCommand);
        }

        const dockerRunCommand = `sudo docker run --rm --name ${compiledFile} \
        -v "${process.cwd()}":/usr/src/app \
        -w /usr/src/app \
        --memory="512m" \
        --memory-swap="512m" \
        ${imageTag} /bin/bash -c \
        "timeout --signal=SIGKILL 30s ${generateDockerCommand(language, sourceFile, compiledFile, inputFile, outputFile, errorFile)}"`;

        console.log(dockerRunCommand);
        await execPromise(dockerRunCommand);

        // Read the output and errors after execution
        const stdout = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, 'utf-8') : null;
        const stderr = fs.existsSync(errorFile) ? fs.readFileSync(errorFile, 'utf-8') : null;

        return { stdout, stderr: stderr };
    } catch (error) {
        const stdout = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, 'utf-8') : null;
        const stderr = fs.existsSync(errorFile) ? fs.readFileSync(errorFile, 'utf-8') : null;

        return { stdout: stdout, stderr: stderr, server: error.message };
    } finally {
        // Cleanup
        safeUnlink(compiledFile);
        safeUnlink(sourceFile);
        safeUnlink(inputFile);
        safeUnlink(outputFile);
        safeUnlink(errorFile);

        if (language === 'haskell') {
            const haskellHiFile = sourceFile.replace(/\.hs$/, '.hi');
            const haskellOFile = sourceFile.replace(/\.hs$/, '.o');
            
            safeUnlink(haskellHiFile);
            safeUnlink(haskellOFile);
        }

        if (language === 'java') {
            const javaClassFile = `${compiledFile}.class`;

            safeUnlink(javaClassFile);
        }
    }
}

// Helper to generate Docker command for each language
function generateDockerCommand(language, sourceFile, compiledFile, inputFile, outputFile, errorFile) {
    let compileCommand = '';
    let executeCommand = '';

    switch (language) {
        case 'javascript':
            executeCommand = `node ${sourceFile}`;
            break;
        case 'python':
            executeCommand = `python3 ${sourceFile}`;
            break;
        case 'c':
            compileCommand = `gcc -o ${compiledFile} ${sourceFile}`;
            executeCommand = `./${compiledFile}`;
            break;
        case 'cpp':
            compileCommand = `g++ -o ${compiledFile} ${sourceFile}`;
            executeCommand = `./${compiledFile}`;
            break;
        case 'java':
            compileCommand = `javac ${sourceFile}`;
            executeCommand = `java ${compiledFile}`;
            break;
        case 'ruby':
            executeCommand = `ruby ${sourceFile}`;
            break;
        case 'go':
            compileCommand = `go build -o ${compiledFile} ${sourceFile}`;
            executeCommand = `./${compiledFile}`;
            break;
        case 'rust':
            compileCommand = `rustc -o ${compiledFile} ${sourceFile}`;
            executeCommand = `./${compiledFile}`;
            break;
        case 'php':
            executeCommand = `php ${sourceFile}`;
            break;
        case 'perl':
            executeCommand = `perl ${sourceFile}`;
            break;
        case 'swift':
            compileCommand = `swiftc -o ${compiledFile} ${sourceFile}`;
            executeCommand = `./${compiledFile}`;
            break;
        case 'haskell':
            compileCommand = `ghc -o ${compiledFile} ${sourceFile}`;
            executeCommand = `./${compiledFile}`;
            break;
        case 'r':
            executeCommand = `Rscript ${sourceFile}`;
            break;
        default:
            throw new Error("Unsupported language");
    }    

    // Handle input redirection and output
    const inputRedirect = inputFile ? `< ${inputFile}` : '';
    return `${compileCommand ? `${compileCommand} 2>${errorFile} &&` : ''} ${executeCommand} ${inputRedirect} > ${outputFile} 2>${errorFile}`;
}
