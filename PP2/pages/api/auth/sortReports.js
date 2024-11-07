import prisma from "@/utils/prismaclient";

export default async function handler (req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const authHeader = req.headers.authorization;

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
        
        return res.status(200).json({ blogposts, comments });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error obtaining reports." });
    }
}
