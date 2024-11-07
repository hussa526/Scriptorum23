import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    // user must be authenticated before editing comment

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
        // find the comment we're editing
        const userCommentId = await prisma.comment.findUnique({
            where: {
                id: commentId,
            },
            select: {
                userId: true,
            }
        });

        // if user is not the same as the comments's user, then its an unauthorized request
        if (user.id != userCommentId.userId) {
            return res.status(403).json({ error: "Unauthorized, must be comment's author to modify." })
        }

        // validate inputs, text can't be empty
        if (!text) {
            return res.status(400).json({ error: "Missing comment."});
        }

        // update the text of the comment
        const updComment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                text: text
            },
            select: {
                replies: true,
                votes: true,
            }
        });

        return res.status(200).json(updComment);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error fetching comment." });
    }
}