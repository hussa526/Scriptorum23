import prisma from "@/utils/prismaclient"

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method not allowed." });
    }
        
    try {
        const tags = await prisma.tags.findMany();

        return res.status(200).json(tags);
    } catch (error) {
        console.error("Error searching for tags:", error);
        return res.status(500).json({ error: "Error searching for tags" });
    }
}