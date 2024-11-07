import prisma from "../../../utils/prismaclient"

import { authUser } from "../../../utils/template";

export default async function handler(req, res) {
    // user must be authenticated before replying to comment

    if (req.method === "POST") { 
        const authHeader = req.headers.authorization;
        
        const result = await authUser(authHeader);
        
        if (result.success === false) {
            return res.status(result.status).json({ error: result.error });
        }

        const user = result.user;

        const { commentId, text } = req.body;

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
                }
            });

            return res.status(200).json(repliedComment);
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ error: "Error replying to comment." });
        }
    } else {
        return res.status(400).json({ error: "Method not allowed." });
    }
}