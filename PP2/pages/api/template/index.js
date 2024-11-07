import prisma from "../../../utils/prismaclient"

export default async function handler(req, res) {
    // get all templates, this is public
    
    if (req.method === "GET") {
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
            filters.tags = {
                some: {
                    tag: {
                        in: tags,
                    },
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
            });

            const totalCount = await prisma.template.count({
                where: filters,
            });

            return res.status(200).json({
                templates,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
            });
        } catch (error) {
            return res.status(500).json({ error: "Templates could not be fetched."})
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}