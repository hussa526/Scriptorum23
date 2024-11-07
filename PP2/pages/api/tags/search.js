import prisma from "../../../utils/prismaclient"

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Empty query." });
        }
        
        try {
            // search for tags matching a specific query
            const tags = await prisma.tags.findMany({
                where: {
                    tag: {
                        contains: query.toLowerCase()
                    },
                },
            });

            return res.status(200).json(tags);
        } catch (error) {
            console.error("Error searching for tags:", error);
            return res.status(500).json({ error: "Error searching for tags" });
        }
    } else {
        return res.status(400).json({ error: "Method not allowed." });
    }
}