import prisma from "../../../utils/prismaclient"

import { authUser } from "../../../utils/template";

export default async function handler(req, res) {
    // user must be authenticated before reporting a comment

    if (req.method === "PUT") { 
        const authHeader = req.headers.authorization;
        
        const result = await authUser(authHeader);
        
        if (result.success === false) {
            return res.status(result.status).json({ error: result.error });
        }

        const user = result.user;

        const { commentId, explanation } = req.body;

        try {
            // check if comment first exists
            const comment = await prisma.comment.findUnique({
                where: { id: commentId }
            });

            if (!comment) {
                return res.status(400).json({ error: "Comment does not exist." });
            }

            // create a report for this comment
            await prisma.report.create({
                data: {
                    userId: user.id,
                    explanation: explanation,
                    blogpostId: comment.blogpostId,
                    commentId: commentId
                }
            });

            // update the comment
            const reportedComment = await prisma.comment.update({
                where: { id: commentId },
                data: {
                    isHidden: true,
                }
            });

            return res.status(200).json(reportedComment);
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ error: "Error reporting comment." });
        }
    } else {
        return res.status(400).json({ error: "Method not allowed." });
    }
}