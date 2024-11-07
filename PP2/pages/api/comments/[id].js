import prisma from "../../../utils/prismaclient"

export default async function handler(req, res) {
    const { id } = req.query;
    const commentId = parseInt(id, 10);

    if (req.method === "GET") {
        // get comment by id

        try {
            const comment = await prisma.comment.findUnique({
                where: { id: commentId },
            });

            if (!comment) {
                return res.status(404).json({ error: "Comment not found." });
            }

            if(comment.isHidden == true)
            {
                return res.status(403).json({message: "forbidden content!"}) //if isHidden flag is true, use 403 (forbidden) code 
            }
    
            return res.status(200).json(comment);
        } catch (error) {
            return res.status(500).json({ error: "Error fetching comment."});
        }
    } else {
        return res.status(400).json({ error: "Method not allowed." });
    }
}