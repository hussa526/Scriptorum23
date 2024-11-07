import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        return res.status(400).json({ error: "Method not allowed." });
    }

    // user must be authenticated before reporting a comment

    const authHeader = req.headers.authorization;

    const result = await authUser(authHeader);
    if (result.success === false) {
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;

    const { blogpostId, explanation } = req.body;

    try {
        // check if comment first exists
        const blogpost = await prisma.blogpost.findUnique({
            where: { id: blogpostId }
        });

        if (!blogpost) {
            return res.status(400).json({ error: "Blogpost does not exist." });
        }

        // create a report for this comment
        const report = await prisma.report.create({
            data: {
                userId: user.id,
                explanation: explanation,
                blogpostId: blogpost.blogpostId,
            }
        });

        return res.status(200).json(report);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error reporting comment." });
    }
}