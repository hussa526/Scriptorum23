import prisma from "@/utils/prismaclient";

export default async function handler (req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const authHeader = req.headers.authorization;

    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to limit 10
    
    try {
        // authenticate user
        const result = await authUser(authHeader);
        if (result.success === false) {
            return res.status(result.status).json({ error: result.error });
        }

        const user = result.user;

        if (user.role !== "admin") {
            return res.status(400).json({ error: "Admin role required." });
        }

        const blogposts = await prisma.blogpost.findMany({
            include: {
                reports: true,
            },
            orderBy: {
                reports: {
                _count: 'desc',  // Sort by the number of reports in descending order
                },
            },
        });

        const comments = await prisma.comment.findMany({
            include: {
              reports: true,
            },
            orderBy: {
              reports: {
                _count: 'desc',  // Sort by the number of reports in descending order
              },
            },
        });

        // Combine blogposts and comments, adding report count for sorting
        const combined = [
            ...blogposts.map(post => ({ ...post, type: 'blogpost', reportCount: post.reports.length })),
            ...comments.map(comment => ({ ...comment, type: 'comment', reportCount: comment.reports.length }))
        ];

        // Sort combined items by report count in descending order
        combined.sort((a, b) => b.reportCount - a.reportCount);

        // Apply pagination
        const paginatedResults = combined.slice((page - 1) * limit, page * limit);
        
        return res.status(200).json({
            page,
            limit,
            totalItems: combined.length,
            totalPages: Math.ceil(combined.length / limit),
            data: paginatedResults,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error obtaining reports." });
    }
}
