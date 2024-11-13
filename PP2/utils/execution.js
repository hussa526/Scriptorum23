import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

function temporaryFile(language) {
    return language === 'java' ? `Main` : `temp_${language}`;
}

// Generate shell script content based on language
function generateShellScript(language, sourceFile, compiledFile, inputFile, stdoutFile, stderrFile, hasInput) {
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
            compileCommand = `gcc -Werror -Wall -Wextra ${sourceFile} -o ${compiledFile}`;
            executeCommand = `./${compiledFile}`;
            break;
        case 'c++':
            compileCommand = `g++ ${sourceFile} -o ${compiledFile}`;
            executeCommand = `./${compiledFile}`;
            break;
        case 'java':
            compileCommand = `javac ${sourceFile}`;
            executeCommand = `java ${compiledFile}`;
            break;
        default:
            throw new Error("Unsupported language");
    }

    // Use `< ${inputFile}` only if there is input
    const inputRedirect = hasInput ? `< ${inputFile}` : '';
    
    return `
        #!/bin/bash
        ${compileCommand && `${compileCommand} 2> ${stderrFile} || exit 1`}
        ${executeCommand} ${inputRedirect} > ${stdoutFile} 2>> ${stderrFile}
    `;
}

function safeUnlink(file) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}

// Main execution function

export async function codeExecution(language, code, stdin) {
    const extension = language === 'javascript' ? '.js' :
                      language === 'python' ? '.py' :
                      language === 'c' ? '.c' :
                      language === 'c++' ? '.cpp' : 
                      language === 'java' ? '.java' :
                      null;

    if (!extension) {
        return { error: "Unsupported language" };
    }

    const compiledFile = temporaryFile(language);
    const sourceFile = `${compiledFile}${extension}`;
    const inputFile = `${compiledFile}_input.txt`;
    const stdoutFile = `${compiledFile}_stdout.txt`;
    const stderrFile = `${compiledFile}_stderr.txt`;
    const scriptFile = `${compiledFile}.sh`;

    console.log(language, code, stdin);

    try {
        // Write the code and input file
        fs.writeFileSync(sourceFile, code);
        if (stdin) {
            fs.writeFileSync(inputFile, stdin);
        }

        const shellScriptContent = generateShellScript(language, sourceFile, compiledFile, inputFile, stdoutFile, stderrFile, Boolean(stdin));
        fs.writeFileSync(scriptFile, shellScriptContent);

        await execPromise(`chmod +x ${scriptFile}`);
        await execPromise(`./${scriptFile}`);

        const stdout = fs.readFileSync(stdoutFile, 'utf-8');
        const stderr = fs.readFileSync(stderrFile, 'utf-8');

        return { stdout: stdout || null, stderr: stderr || null };

    } catch (error) {
        const stdout = fs.existsSync(stdoutFile) ? fs.readFileSync(stdoutFile, 'utf-8') : null;
        const stderr = fs.existsSync(stderrFile) ? fs.readFileSync(stderrFile, 'utf-8') : error.message;

        return { error: "Execution failed", stdout, stderr };

    } finally {
        // Cleanup - check if each file exists before attempting to delete it
        safeUnlink(sourceFile);
        safeUnlink(stdoutFile);
        safeUnlink(stderrFile);
        safeUnlink(scriptFile);
        if (stdin) safeUnlink(inputFile);
        if (language === 'c' || language === 'c++') safeUnlink(compiledFile);
        if (language === 'java') safeUnlink(`${compiledFile}.class`);
    }
}