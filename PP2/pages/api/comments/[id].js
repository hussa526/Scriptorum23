import prisma from "@/utils/prismaclient"

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const { id } = req.query;
    const commentId = parseInt(id, 10);

    if (isNaN(commentId)) {
        return res.status(400).json({ error: "Comment id must be a number." });
    }

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: {
                replies: true,
                votes: true,
            }
        });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found." });
        }

        if (comment.isHidden == true) {
            //if isHidden flag is true, use 403 (forbidden) code 
            return res.status(403).json({message: "Forbidden content." })
        }

        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching comment."});
    }
}