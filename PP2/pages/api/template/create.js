import prisma from "../../../utils/prismaclient"

import { validateTags } from "../../../utils/template";
import { authUser } from "../../../utils/template";

export default async function handler(req, res) {
    // user must be authenticated before creating any templates

    if (req.method === "POST") {
        // check auth, userId will come from authentication token
        const authHeader = req.headers.authorization;
        
        const result = await authUser(authHeader);
        
        if (result.success === false) {
            return res.status(result.status).json({ error: result.error });
        }

        const user = result.user;

        const { title, explanation, code, extension, tagsId = [] } = req.body;

        // validate inputs
        if (!title) {
            return res.status(400).json({ error: "Missing title."});
        }

        if (!extension) {
            return res.status(400).json({ error: "Missing template code extension."})
        }

        try {
            // validate tags - tags must exist in order to link them to the template
            const invalidTagIds = validateTags(tagsId);
            if (invalidTagIds.length > 0) {
                return res.status(400).json({ error: `Invalid tag IDs: ${invalidTagIds.join(', ')}` });
            }

            // create a template, 
            const template = await prisma.template.create({
                data: {
                    title: title,
                    explanation: explanation,
                    userId: user.id,
                    isForked: false,
                    forkedId: null,
                    code: code,
                    extension: extension,
                    tags: tagsId.length > 0 ? { connect: tagsId.map(tagId => ({ id: tagId })) } : undefined,
                }
            });

            return res.status(201).json(template);
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ error: "Error creating template."})
        }
    } else {
        return res.status(400).json({ error: "Method not allowed" });
    }
}