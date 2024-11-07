import prisma from "@/utils/prismaclient"

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const { query } = req.query;

    if (!query || typeof query !== "string") {
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
        console.error(error.message);
        return res.status(500).json({ error: "Error searching for tags" });
    }
}