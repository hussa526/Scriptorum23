import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method not allowed." });        
    }

    // user must be authenticated before deleting any blogposts

    const authHeader = req.headers.authorization;
    
    const result = await authUser(authHeader);
    
    if (result.success === false) {
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;
    const { blogpostId } = req.body;

    if (typeof(blogpostId) !== "number") {
        return res.status(400).json({ error: "Id must be a number." });
    }

    if (!blogpostId) {
        return res.status(400).json({ error: "Missing blogpostId." });
    }

    try {
        const blogpost = await prisma.blogpost.findUnique({
            where: {
                id: blogpostId,
            }
        });

        if (!blogpost) {
            return res.status(404).json({ error: "Blogpost does not exist." });
        }

        if (user.id !== blogpost.userId) {
            return res.status(403).json({ error: "Unauthorized, must be blog post's author to delete." })
        }

        // delete template
        await prisma.blogpost.delete({
            where: {
                id: blogpostId,
            }
        });

        return res.status(200).json({ message: "Blogpost deleted." });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Could not delete blogpost." });
    }
}