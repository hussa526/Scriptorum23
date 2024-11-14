#!/bin/bash

# 1. Python
echo "Running Python code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "python",
    "code": "print(\"Hello, World!\")",
    "stdin": ""
}'
echo 

# 2. JavaScript
echo "Running JavaScript code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "javascript",
    "code": "console.log(\"Hello, World!\")",
    "stdin": ""
}'
echo 

# 2. JavaScript Error
echo "Running JavaScript code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "javascript",
    "code": "console.log(\"Hello, World!\")\na",
    "stdin": ""
}'
echo 

# 3. C
echo "Running C code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "c",
    "code": "#include <stdio.h>\nint main() { printf(\"Hello, World!\\n\"); return 0; }",
    "stdin": ""
}'
echo 

# 4. C++
echo "Running C++ code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "cpp",
    "code": "#include <iostream>\nint main() { std::cout << \"Hello, World!\" << std::endl; return 0; }",
    "stdin": ""
}'
echo 

# 5. Java
echo "Running Java code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "java",
    "code": "public class Main { public static void main(String[] args) { System.out.println(\"Hello, World!\"); } }",
    "stdin": ""
}'
echo 

# 6. Go
echo "Running Go code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "go",
    "code": "package main\nimport \"fmt\"\nfunc main() { fmt.Println(\"Hello, World!\") }",
    "stdin": ""
}'
echo 

# 7. Rust
echo "Running Rust code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "rust",
    "code": "fn main() { println!(\"Hello, World!\"); }",
    "stdin": ""
}'
echo 

# 8. PHP
echo "Running PHP code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "php",
    "code": "<?php echo \"Hello, World!\"; ?>",
    "stdin": ""
}'
echo 

# 9. Perl
echo "Running Perl code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "perl",
    "code": "print \"Hello, World!\\n\";",
    "stdin": ""
}'
echo 

# 10. Swift
echo "Running Swift code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "swift",
    "code": "print(\"Hello, World!\")",
    "stdin": ""
}'
echo 

# 11. Haskell
echo "Running Haskell code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "haskell",
    "code": "main = putStrLn \"Hello, World!\"",
    "stdin": ""
}'
echo 

# 12. R
echo "Running R code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "r",
    "code": "cat(\"Hello, World!\\n\")",
    "stdin": ""
}'
echo 

# 13. Ruby
echo "Running Ruby code..."
curl -X POST http://localhost:3000/api/code/execute -H "Content-Type: application/json" -d '{
    "language": "ruby",
    "code": "puts \"Hello, World!\"",
    "stdin": ""
}'
echo 
