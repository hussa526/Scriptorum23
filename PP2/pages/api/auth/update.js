import prisma from "@/utils/prismaclient";

import { authUser } from "@/utils/auth";

export default async function handler(req, res) {
	if (req.method !== "PUT") {
		return res.status(405).json({ message: "Method not allowed." });
	}

	const { firstName, lastName, newUsername, email, avatar, phone } = req.body; //all required fields

    const authHeader = req.headers.authorization;
    const result = await authUser(authHeader);
    
    if (result.success === false) {
        return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;

	try {
		const updatedUser = await prisma.user.update({
            where: { username: user.username },
            data: {
                firstName,
                lastName,
                username: newUsername,
                email,
                avatar,
                phone,
            }
		});
	
		if (!updatedUser) { 
			return res.status(401).json({ message: "User does not exist." });
		}
	
		return res.status(200).json(updatedUser);
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ error: "Error login in user." });
	}
}
