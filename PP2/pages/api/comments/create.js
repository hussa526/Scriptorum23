import prisma from "../../../utils/prismaclient"

import { authUser } from "../../../utils/template";

export default async function handler(req, res) {
    // user must be authenticated before making a comment on a blogpost

    if (req.method === "POST") {
        // check auth, userId will come from authentication token
        const authHeader = req.headers.authorization;
        
        const result = await authUser(authHeader);
        
        if (result.success === false) {
            return res.status(result.status).json({ error: result.error });
        }

        const user = result.user;

        const { blogpostId, text } = req.body;

        // validate inputs
        if (!text) {
            return res.status(400).json({ error: "Missing comment."});
        }

        try {
            // create a comment
            const comment = await prisma.comment.create({
                data: {
                    text: text,
                    userId: user.id,
                    blogpostId: blogpostId,
                    isHidden: false
                }
            });

            return res.status(201).json(comment);
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ error: "Error creating comment."})
        }
    } else {
        return res.status(400).json({ error: "Method not allowed" });
    }
}