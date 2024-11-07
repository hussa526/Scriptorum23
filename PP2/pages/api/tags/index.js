import prisma from "../../../utils/prismaclient"

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // return all tags ? paginate
        
        try {
            const tags = await prisma.tags.findMany();

            return res.status(200).json(tags);
        } catch (error) {
            console.error("Error searching for tags:", error);
            return res.status(500).json({ error: "Error searching for tags" });
        }
    } else {
        return res.status(400).json({ error: "Method not allowed." });
    }
}