import prisma from "@/utils/prismaclient"

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const { username } = req.query;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            },
            select: {
                username: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                phone: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User does not exist." });
        }

        return res.status(200).json(user);            
    } catch (error) {
        return res.status(500).json({ error: "Error getting user." });
    }
}