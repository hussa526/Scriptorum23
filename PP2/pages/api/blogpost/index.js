import prisma from "@utils/prismaclient";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    // Get blogposts and perform any filtering or pagination necessary

    // All below should be Strings, and individual values seperated by commas 
    const tags = req.query.tags;
    const title = req.query.title;
    const content = req.query.content;
    const templates = req.query.templates;

    // Create a filter to give to prisma findMany based on what the use is searching
    const filter = {};

    // Add filters conditionally

    // Validate title (first if statement from ChatGPT)
    if (title && typeof title !== 'string') {
        return res.status(400).json({ error: "Title must be a string." });
    }

    if (title) {
        filter.title = { contains: title };
    }

    if (tags) {
        const tagNames = tags.split(",").map(tag => tag.trim());
        // if statement from ChatGPT
        if (tagNames.some(tag => !tag)) {
            return res.status(400).json({ error: "Tags must be non-empty strings." });
        }
        
        filter.tags = {
            some: {    
                tag: { in: tagNames }, // Filter by tag names
            },
        }
    }

    // Validate content (first if statement from ChatGPT)
    if (content && typeof content !== 'string') {
        return res.status(400).json({ error: "Content must be a string." });
    }
    if (content) {
        filter.content = { contains: content };
    }

    if (templates) {
        const templateNames = templates.split(",");
        
        // if statement from ChatGPT
        if (templateNames.some(template => !template)) {
            return res.status(400).json({ error: "Templates must be non-empty strings." });
        }
        filter.templates = {
            some: {    
                templates: { in: templateNames }, // Filter by template names
            },
        }
    }

    // Get page number and limit for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Following two if statements from ChatGPT
    if (isNaN(page) || page < 1) {
        return res.status(400).json({ error: "Invalid page number. It must be a positive integer." });
    }

    if (isNaN(limit) || limit < 1) {
        return res.status(400).json({ error: "Invalid limit. It must be a positive integer." });
    }

    try {
        // Fetch the blog posts from the database and count how many total results there are.
        // (following 8 lines from ChatGPT, which modified my original code)
        const blogposts = await prisma.blogpost.findMany({
            where: filter,
            skip: (page - 1) * limit,
            take: limit,
        });

        // Get the total count of blogposts that match the filter
        const totalCount = await prisma.blogpost.count({
            where: filter,
        });

        // 
        return res.status(200).json({
            blogposts: blogposts,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount: totalCount,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Blogposts could not be fetched." });
    }
}

