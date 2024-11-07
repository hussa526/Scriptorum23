import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(400).json({ error: "Method not allowed." });
    }
    // user must exist to fork a template, visitors aren't allowed

    // check auth, must have a token otherwise not a user

    const authHeader = req.headers.authorization;
    
    const result = await authUser(authHeader);
    
    if (result.success === false) {
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;

    // fork this template
    const { tempId } = req.body;

    if (isNaN(tempId) || typeof tempId !== "number") {
        return res.status(400).json({ error: "Template id must be a number." });
    }
    
    try {
        // find template to fork
        const template = await prisma.template.findUnique({
            where: { id: tempId },
            include: { tags: true },
        });

        if (!template) {
            return res.status(404).json({ error: "Template not found." });
        }
        
        // create a forked template
        const forkedTemplate = await prisma.template.create({
            data: {
                title: template.title,
                explanation: template.explanation,
                userId: user.id,
                isForked: true,
                forkedId: tempId,
                code: template.code,
                extension: template.extension,
                tags: {
                    connect: template.tags.map(tag => ({ id: tag.id})),
                },
            },
            include: {
                blogposts: true,
                forks: true,
                tags: true,
            }
        });

        return res.status(200).json(forkedTemplate);
    } catch (error) {
        return res.status(500).json({ error: "Error forking template." });
    }
}