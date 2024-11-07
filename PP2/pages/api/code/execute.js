import prisma from "../../../utils/prismaclient"

import { codeExecution } from "../../../utils/execution"

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { tempId, stdin } = req.body;

        try {
            const template = await prisma.template.findUnique({
                where: {
                    id: tempId,
                }
            });
            
            const result = await codeExecution(template.extension, template.code, stdin);
            return res.status(200).json(result);
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ error: "Error during execution." });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed." });
    }
}