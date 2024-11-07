import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/template";

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        return res.status(400).json({ error: "Method not allowed." });
    }
    // user must be authenticated before editing comment

    const authHeader = req.headers.authorization;
    
    const result = await authUser(authHeader);
    
    if (result.success === false) {
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;

    const { commentId, type } = req.body;

    if (isNaN(commentId) || typeof commentId !== "number") {
        return res.status(400).json({ error: "Comment id must be a number." });
    }

    if (typeof type !== "string") {
        return res.status(400).json({ error: "Type must be a string." });
    }

    const voteType = type === "upvote" ? true : type === "downvote" ? false : undefined;

    if (voteType === null) {
        return res.status(400).json({ error: "Invalid vote type: upvote or downvote." });
    }

    try {
        // get the comment we're going to upvote
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: {
                id: true,
                blogpostId: true,
                votes: true
            }
        });

        // verify it exists
        if (!comment) {
            return res.status(400).json({ error: "Comment does not exist." });
        }

        // check to see if user has already voted to this comment
        const existingVote = comment.votes.find(vote => vote.userId === user.id);

        if (existingVote) {
            if (existingVote.type === voteType) {
                return res.status(400).json({ error: "User has already voted." });
            }

            await prisma.vote.update({
                where: { id: existingVote.id },
                data: {
                    type: voteType
                }
            });
        } else {
            // vote doesn't exist and needs to be created
            await prisma.vote.create({
                data: {
                    userId: user.id,
                    type: voteType,
                    commentId: comment.id
                }
            });
        }

        const votedComment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: {
                blogpostId: true,
                parentId: true,
                replies: true,
                votes: true
            }
        });

        return res.status(200).json(votedComment);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error voting comment." });
    }
}