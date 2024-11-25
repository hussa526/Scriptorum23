import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const languages = [
    'javascript', 'python', 'c', 'cpp',
    'java', 'go', 'haskell', 
    'perl', 'php', 'r', 'ruby', 'rust', 'swift'
];

async function imageExists(imageTag) {
    try {
        const { stdout } = await execPromise(`docker images -q ${imageTag}`);
        return stdout.trim() !== ''; // Returns true if image exists, false otherwise
    } catch (error) {
        console.error('Error checking image:', error);
        return false;
    }
}

async function buildImage(language) {
    const imageTag = `${language}_image`;
    const imageExist = await imageExists(imageTag);

    console.log(`${imageTag}`);
    if (!imageExist) {
        console.log(`   does not exist, building...`);

        // Build the Docker image if it doesn't exist
        const dockerBuildCommand = `docker build -t ${imageTag} -f docker/Dockerfile.${language} .`;
        console.log(`   ${dockerBuildCommand}`);
        await execPromise(dockerBuildCommand);

        console.log(`   -> ${imageTag} built successfully`);
    } else {
        console.log(`   -> ${imageTag} already built`);
    }
}

export async function buildImages() {
    for (let language of languages) {
        await buildImage(language);
    }
}

await buildImages();