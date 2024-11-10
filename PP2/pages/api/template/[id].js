import prisma from "@/utils/prismaclient"

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed." });
    }
    const { id } = req.query;
    const tempId = parseInt(id, 10);

    if (isNaN(tempId) || typeof tempId !== "number") {
        return res.status(400).json({ error: "Template id must be a number." });
    }

    try {
        const template = await prisma.template.findUnique({
            where: { id: tempId },
            include: {
                blogposts: true,
                tags: true,
                forks: true,
                user: true,
            }
        });

        if (!template) {
            return res.status(404).json({ error: "Template not found." });
        }

        return res.status(200).json(template);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching template."});
    }
}