import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

function temporaryFile(language) {
    let tempFilePath;
    if (language === 'java') {
        tempFilePath = `Main`;
    } else {
        tempFilePath = `temp_${language}`;
    }
    return tempFilePath;
}

// Helper function to execute code
export async function codeExecution(language, code, stdin) {
    const extension = language === 'javascript' ? '.js' :
                      language === 'python' ? '.py' :
                      language === 'c' ? '.c' :
                      language === 'c++' ? '.cpp' : 
                      language === 'java' ? '.java' :
                      null;

    // Ensure the extension is valid
    if (!extension) {
        return { error: "Unsupported language" };
    }

    const compiledFile = temporaryFile(language);
    const sourceFile = `${compiledFile}${extension}`;
    const inputFile = `${compiledFile}_input.txt`;

    // Create a temporary file for the code
    fs.writeFileSync(`${sourceFile}`, code);
    if (stdin) {
        fs.writeFileSync(inputFile, stdin);
    }    

    let compile = '';
    let command = '';
    switch (language) {
        case 'javascript':
            command = `node ${sourceFile}`;
            break;
        case 'python':
            command = `python3 ${sourceFile}`;
            break;
        case 'c':
            compile = `gcc -Werror -Wall -Wextra ${sourceFile} -o ${compiledFile}`;
            command = `./${compiledFile}`;
            break;
        case 'c++':
            compile = `g++ ${sourceFile} -o ${compiledFile}`
            command = `./${compiledFile}`;
            break;
        case 'java':
            compile = `javac ${sourceFile}`;
            command = `java ${compiledFile}`;
            break;
        default:
            return { error: "Unsupported language" };
    }

    if (stdin) {
        command += ` < ${inputFile}`;
    }
    
    const output = { stderr: [], stdout: null};

    if (compile) {
        try {
            const { stderrWarnings } = await execPromise(compile);

            if (stderrWarnings) {
                // compiler warnings
                if (language === 'c' || language === 'c++' || language === 'java') {
                    fs.unlinkSync(`${sourceFile}`);
                }
                // console.log(`Compiler (warning) error: ${stderrWarnings}`);
                output["stderr"].push(stderrWarnings);
            }
        } catch (error) {
            // compiler errors
            if (language === 'c' || language === 'c++' || language === 'java') {
                fs.unlinkSync(`${sourceFile}`);
            }

            output["stderr"].push(error.message);

            return output;
        }
    }

    try {
        const { stdout, stderr } = await execPromise(command);

        // Clean up temporary files
        fs.unlinkSync(`${sourceFile}`);
        if (stdin) fs.unlinkSync(inputFile);
        if (language === 'c' || language === 'c++') {
            fs.unlinkSync(compiledFile);
        } else if (language === 'java') {
            fs.unlinkSync(`${compiledFile}.class`);
        }

        output["stdout"] = stdout || null;
        if (stderr) output["stderr"].push(stderr);
        
        return output;
    } catch (error) {
        // Clean up even if there's an error
        fs.unlinkSync(`${sourceFile}`);
        if (stdin) fs.unlinkSync(inputFile);
        if (language === 'c' || language === 'c++') {
            fs.unlinkSync(compiledFile);
        } else if (language === 'java') {
            fs.unlinkSync(`${compiledFile}.class`);
        }

        // console.log(`Runtime error: ${error.message}`);
        output["stderr"].push(error.message);
        return output;
    }
}