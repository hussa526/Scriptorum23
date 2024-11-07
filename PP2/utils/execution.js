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
                      language === 'cpp' ? '.cpp' : 
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
        case 'cpp':
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
    
    const output = {}
    if (compile) {
        try {
            const { stderrWarn } = await execPromise(compile);

            if (stderrWarn) {
                // compiler warnings
                if (language === 'c' || language === 'cpp' || language === 'java') {
                    fs.unlinkSync(`${sourceFile}`);
                }
                console.log(`Compiler (warning) error: ${stderrWarn}`);
                output["stderrWarn"] = stderrWarn;
            }
        } catch (error) {
            // compiler errors
            if (language === 'c' || language === 'cpp' || language === 'java') {
                fs.unlinkSync(`${sourceFile}`);
            }

            return { stderr: error.message };
        }
    }

    try {
        const { stdout, stderr } = await execPromise(command);

        // Clean up temporary files
        fs.unlinkSync(`${sourceFile}`);
        if (stdin) fs.unlinkSync(inputFile);
        if (language === 'c' || language === 'cpp') {
            fs.unlinkSync(compiledFile);
        } else if (language === 'java') {
            fs.unlinkSync(`${compiledFile}.class`);
        }

        if (stderr) {
            // never reach here?
            // console.log(`Runtime error ??: ${stderr}`);
            return { stderr: stderr };
        }

        // Return stdout or stderr as the result
        output["stdout"] = stdout;
        return output;
    } catch (error) {
        // Clean up even if there's an error
        fs.unlinkSync(`${sourceFile}`);
        if (stdin) fs.unlinkSync(inputFile);
        if (language === 'c' || language === 'cpp') {
            fs.unlinkSync(compiledFile);
        } else if (language === 'java') {
            fs.unlinkSync(`${compiledFile}.class`);
        }

        // console.log(`Runtime error: ${error.message}`);
        return { stderr: error.message };
    }
}