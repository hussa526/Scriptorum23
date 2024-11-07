import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(400).json({ error: "Method not allowed." });
    }

    // user must be authenticated before replying to comment

    const authHeader = req.headers.authorization;
    
    const result = await authUser(authHeader);
    
    if (result.success === false) {
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;

    const { commentId, text } = req.body;

    if (isNaN(commentId) || typeof commentId !== "number") {
        return res.status(400).json({ error: "Comment id must be a number." });
    }

    if (typeof text !== "string") {
        return res.status(400).json({ error: "Text must be a string." });
    }

    try {
        // get parent comment we're replying to
        const parentComment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!parentComment) {
            return res.status(400).json({ error: "Comment does not exist." });
        }

        // create a new comment with a parent
        const repliedComment = await prisma.comment.create({
            data: {
                text: text,
                userId: user.id,
                blogpostId: parentComment.blogpostId,
                isHidden: false,
                parentId: parentComment.id,
            },
            select: {
                replies: true,
                votes: true,
            }
        });

        return res.status(200).json(repliedComment);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error replying to comment." });
    }
}