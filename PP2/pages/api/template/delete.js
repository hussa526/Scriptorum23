import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed." });  
    }

    // user must be authenticated before deleting any templates

    const authHeader = req.headers.authorization;
    
    const result = await authUser(authHeader);
    
    if (result.success === false) {
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;

    const { tempId } = req.body;

    if (isNaN(tempId) || typeof tempId !== "number") {
        return res.status(400).json({ error: "Template id must be a number." });
    }

    try {
        const template = await prisma.template.findUnique({
            where: {
                id: tempId,
            }
        });

        if (!template) {
            return res.status(402).json({ error: "Template does not exist." });
        }

        if (user.id != template.userId) {
            return res.status(403).json({ error: "Unauthorized, must be template's author to delete." })
        }

        // delete template
        await prisma.template.delete({
            where: {
                id: tempId,
            }
        });

        return res.status(200).json({ message: "Template deleted." });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Could not delete template." });
    }
}