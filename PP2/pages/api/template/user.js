import prisma from "@/utils/prismaclient"

import { authUser } from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    // user must be authenticated before viewing own templates

    // check auth, userId comes from token

    const authHeader = req.headers.authorization;
    
    const result = await authUser(authHeader);
    
    if (result.success === false) {
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;

    // get all user templates, paginate
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    try {
        // get all the templates from this user with pagination
        const templates = await prisma.template.findMany({
            where: {
                userId: user.id,
            },
            skip: offset,
            take: limit,
        });

        // count the total number of templates the user has
        const totalCount = await prisma.template.count({
            where: {
                userId: user.id
            },
        });

        // return the templates, the current page, and the total number of pages
        return res.status(201).json({
            templates,
            currentPage: page,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        return res.status(500).json({ error: "User templates could not be fetched."})
    }
}