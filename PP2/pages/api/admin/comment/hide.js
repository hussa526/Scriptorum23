import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        return res.status(400).json({ error: "Method not allowed." });
    }

    // user must be authenticated before reporting a comment

    const authHeader = req.headers.authorization;
    
    const result = await authUser(authHeader);
    
    if (result.success === false) {
        console.log(result);
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;

    if (user.role !== 'admin') {
        return res.status(400).json({ error: "Must be admin." });
    }

    const { id } = req.body;
    
    console.log(id);
    if (isNaN(id) || typeof id !== "number") {
        return res.status(400).json({ error: "Comment id must be a number." });
    }

    try {
        // check if comment first exists
        const comment = await prisma.comment.findUnique({
            where: { id: id }
        });

        if (!comment) {
            return res.status(400).json({ error: "Comment does not exist." });
        }

        // update the comment
        const hiddenComment = await prisma.comment.update({
            where: { id: id },
            data: {
                isHidden: true,
            },
            include: {
                replies: true,
                votes: true,
            }
        });

        return res.status(200).json(hiddenComment);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error reporting comment." });
    }
}