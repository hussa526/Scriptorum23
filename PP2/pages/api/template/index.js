import prisma from "@/utils/prismaclient"

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    // get all templates, this is public
    
    // fetch all templates according to title, tags, or codeContent
    const { title, tags, codeContent } = req.query;

    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to limit 10

    const offset = (page - 1) * limit;

    const filters = {};

    // filter for title
    if (title) {
        filters.title = {
            contains: title.toLowerCase(),
        };
    }

    // filter for tags
    if (tags) {
        const tagNames = tags.split(",").map(tag => tag.trim());

        if (tagNames.some(tag => !tag)) {
            return res.status(400).json({ error: "Tags must be non-empty strings." });
        }
        
        filters.tags = {
            some: {
                OR: tagNames.map(tag => ({
                    tag: {
                        contains: tag,
                    },
                })),
            },
        };
    }

    // filter for code content
    if (codeContent) {
        filters.code = {
            contains: codeContent.toLowerCase(),
        };
    }

    try {
        // find as many templates as possible according to the filters + pagination
        const templates = await prisma.template.findMany({
            where: filters,
            skip: offset,
            take: limit,
            include: {
                tags: true,
                blogposts: true,
                forks: true,
                user: true,
            }
        });

        const totalCount = await prisma.template.count({
            where: filters,
        });

        return res.status(200).json({
            templates,
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Templates could not be fetched."})
    }
}