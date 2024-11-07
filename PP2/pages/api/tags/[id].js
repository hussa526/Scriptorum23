import prisma from "../../../utils/prismaclient"

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;
        const tagId = parseInt(id, 10);

        try {
            // get this tag
            const existingTag = await prisma.tags.findUnique({
                where: {
                    id: tagId,
                },
            });

            if (!existingTag) {
                return res.status(404).json({ error: "Tag does not exist." });
            }

            return res.status(200).json(existingTag);            
        } catch (error) {
            return res.status(500).json({ error: "Error getting tag." });
        }
    } else {
        return res.status(400).json({ error: "Method not allowed." });
    }
}