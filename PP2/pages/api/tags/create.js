import prisma from "@/utils/prismaclient"

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    // create a new tag
    const { tag } = req.body;

    if (typeof tag !== "string") {
        return res.status(400).json({ error: "Tag must be a string." });
    }

    try {
        // find if tag with that name already exists
        const existingTag = await prisma.tags.findUnique({
            where: {
                tag: tag,
            },
        });

        if (existingTag) {
            return res.status(400).json({ error: "Tag already exists." });
        }

        // create a new tag
        const newTag = await prisma.tags.create({
            data: { 
                tag: tag
            },
        });

        return res.status(201).json(newTag);
    } catch (error) {
        return res.status(500).json({ error: "Error creating tag." });
    }
}