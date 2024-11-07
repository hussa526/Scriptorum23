import prisma from "@/utils/prismaclient"

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const { id } = req.body;
    const tagId = parseInt(id, 10);

    if (isNaN(tagId) || typeof tagId !== "number") {
        return res.status(400).json({ error: "Tag id must be a number." });
    }
    
    try {
        // find the tag
        const tag = await prisma.tags.findUnique({
            where: { id: tagId },
            include: {
                templates: true,
                blogposts: true,
            },
        })

        if (!tag) {
            return res.status(404).json({ error: "Tag not found." });
        }

        // if the tag is associated with any templates or blogposts then it can't be deleted    
        if (tag.templates.length > 0 || tag.blogposts.length > 0) {
            return res.status(400).json({ error: "Cannot delete tag. It is still associated with templates or blog posts." });
        }

        await prisma.tags.delete({
            where: { id: tagId },
        });

        return res.status(200).json({ message: "Tag successfully deleted." });
    } catch (error) {
        return res.status(500).json({ error: "Error deleting tag." });
    }
}