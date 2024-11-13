import { codeExecution } from "@/utils/execution"

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const { language, code, stdin } = req.body;

    try {        
        const result = await codeExecution(language, code, stdin);

        if (result.error) {
            return res.status(400).json(result);
        }

        console.log(result);

        return res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error during execution." });
    }
}