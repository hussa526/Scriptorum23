import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/template";

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

    const { commentId } = req.body;

    if (isNaN(commentId) || typeof commentId !== "number") {
        return res.status(400).json({ error: "Comment id must be a number." });
    }

    try {
        // verify comment exists
        const comment = await prisma.comment.findUnique({
            where: { id: commentId}
        });

        if (!comment) {
            return res.status(402).json({ error: "Comment does not exist." });
        }

        // verify user can delete this comment
        if (user.id != comment.userId) {
            return res.status(403).json({ error: "Unauthorized, must be comment's author to delete." })
        }
        
        if (!comment.replies) {
            // if it has no replies, can safely delete
            await prisma.comment.delete({
                where: { id: commentId }
            })
            return res.status(200).json({ message: "Comment deleted." });
        } else {
            // if it has replies, we soft delete so as to not delete the replies
            const deletedComment = await prisma.comment.update({
                data: {
                    text: "Deleted comment"
                }
            })
            return res.status(200).json({ deletedComment });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Could not delete comment." });
    }
}