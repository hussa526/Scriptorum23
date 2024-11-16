import prisma from "./prismaclient"

export async function findTags(tags) {
    if (tags.length === 0) {
        return [];
    } 

    const tagIds = [];

    // Loop through each tag
    for (const tag of tags) {
        // Try to find the tag in the database
        let existingTag = await prisma.tags.findUnique({
            where: {
                tag: tag,  // Assuming 'tag' is a unique field in your Tag model
            },
        });

        if (existingTag) {
            // If the tag exists, add the ID to the list
            tagIds.push(existingTag.id);
        } else {
            // If the tag doesn't exist, create it and then add the ID
            const newTag = await prisma.tags.create({
                data: {
                    tag: tag,  // Create the new tag
                },
            });
            tagIds.push(newTag.id);
        }
    }

    return tagIds; // Return the list of tag IDs
}

export async function deleteTags(tags) {
    if (tags.length ==- 0) {
        return;
    }

    console.log(tags);

    for (const tag of tags) {
        console.log(tag);

        const tagDelete = await prisma.tags.findUnique({
            where: { id: tag },
            include: {
                templates: true,
                blogposts: true,
            },
        })

        if (!tagDelete) {
            return res.status(404).json({ error: "Tag not found." });
        }

        // if the tag is associated with any templates or blogposts then it can't be deleted
        if (tagDelete.templates.length > 0 || tagDelete.blogposts.length > 0) {
            return res.status(400).json({ error: "Cannot delete tag. It is still associated with templates or blog posts." });
        } else {
            await prisma.tags.delete({
                where: { id: tag },
            });
        }
    }
}