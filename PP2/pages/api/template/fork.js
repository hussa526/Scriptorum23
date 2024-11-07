import prisma from "../../../utils/prismaclient"

import { authUser } from "../../../utils/template";

export default async function handler(req, res) {
    // user must exist to fork a template, visitors aren't allowed

    // check auth, must have a token otherwise not a user

    // forking not complete ?
    // unclear about checking user auth if its a visitor?

    if (req.method === "POST") {
        const authHeader = req.headers.authorization;
        
        const result = await authUser(authHeader);
        
        if (result.success === false) {
            return res.status(result.status).json({ error: result.error });
        }

        const user = result.user;

        // fork this template
        const { tempId } = req.body;
        
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
                }
            });

            return res.status(200).json(forkedTemplate);
        } catch (error) {
            return res.status(500).json({ error: "Error forking template." });
        }
    } else {
        return res.status(400).json({ error: "Method not allowed." });
    }
}