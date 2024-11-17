// test.js

import { codeExecution } from "./execution.js"; // Adjust the path as necessary

async function test() {
    // Test Python Code
    let pythonCode = `print("Hello from Python!")`;
    let pythonResult = await codeExecution('python', pythonCode);
    console.log('Python Result:', pythonResult);

    pythonCode = `print("Hello from Python!")\nprint(1/0)`;
    pythonResult = await codeExecution('python', pythonCode);
    console.log('Python Result:', pythonResult);

    // const pythonCode = `print("Hello from Python!"`;
    pythonCode = `def divide_by_zero():\n    return 1 / 0\ndivide_by_zero()`;
    pythonResult = await codeExecution('python', pythonCode);
    console.log('Python Result:', pythonResult);      

    // Test JavaScript Code
    let jsCode = `console.log("Hello from JavaScript!");`;
    let jsResult = await codeExecution('javascript', jsCode);
    console.log('JavaScript Result:', jsResult);

    jsCode = `console.log("Hello from JavaScript!");\nasdfasdf;`;
    jsResult = await codeExecution('javascript', jsCode);
    console.log('JavaScript Result:', jsResult);

    // // Test C Code
    let cCode = `#include <stdio.h>\nint main() { printf("Hello from C!\\n"); return 0; }`;
    let cResult = await codeExecution('c', cCode);
    console.log('C Result:', cResult);

    // Test C Code
    cCode = `#include <stdio.h>\n\nint unused_function() {\n    return 42;\n}\n\nint main() {\n    int x;\n    printf("Hello, world!\\n");\n    return 0;\n}`;
    cResult = await codeExecution('c', cCode);
    console.log('C Result:', cResult);

    // Test C Code
    cCode = `#include <stdio.h>\n\nint unused_function() {\n    return 42;\n}\n\nint main() {\n    printf("Hello, world!\\n");\n    return 0;\n}`;
    cResult = await codeExecution('c', cCode);
    console.log('C Result:', cResult);

    // Test C++ Code
    let cppCode = `#include <iostream>\nint main() { std::cout << "Hello from C++!" << std::endl; return 0; }`;
    let cppResult = await codeExecution('c++', cppCode);
    console.log('C++ Result:', cppResult);

    // Test Java Code
    let javaCode = `public class Main { public static void main(String[] args) { System.out.println("Hello from Java!"); } }`;
    let javaResult = await codeExecution('java', javaCode);
    console.log('Java Result:', javaResult);
}

// Run the test
test();
