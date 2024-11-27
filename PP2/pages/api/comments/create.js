import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(400).json({ error: "Method not allowed" });
    }
    // user must be authenticated before making a comment on a blogpost

    // check auth, userId will come from authentication token
    const authHeader = req.headers.authorization;
    
    const result = await authUser(authHeader);
    
    if (result.success === false) {
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;

    const { blogpostId, text } = req.body;

    if (isNaN(blogpostId) || typeof blogpostId !== "number") {
        return res.status(400).json({ error: "Blogpost id must be a number." });
    }

    if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Missing comment."});
    }

    try {
        // create a comment
        const comment = await prisma.comment.create({
            data: {
                text: text,
                userId: user.id,
                blogpostId: blogpostId,
                isHidden: false
            },
            include: {
                replies: true,
                votes: true,
                user: true,
            }
        });

        return res.status(201).json(comment);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error creating comment."})
    }
}