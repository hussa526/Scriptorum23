import prisma from "../../../utils/prismaclient";

import { verifyToken } from "../../../utils/auth";

export default async function handler (req, res)
{
	if (req.method != 'PUT')
		return res.status(405).json({message: "need to use PUT method"})

	const {authorization} = req.headers; 
	
	if (!authorization) {
		return res.status(401).json({ message: "No authorization token" });
	}

	const token = authorization.split(" ")[1];

	try {
		const decoded = verifyToken(token);
		const userId = decoded.userId;

		const { username, firstName, lastName, email, avatar, phoneNumber, role} = req.body;
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				username,
				firstName,
				lastName,
				email,
				avatar,
				phoneNumber,
				role
			},
		});

		return res.status(200).json({ message: "Profile updated", user: updatedUser });
	} catch (error) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
}
