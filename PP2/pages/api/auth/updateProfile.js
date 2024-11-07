import prisma from "@/utils/prismaclient";

export default async function handler (req, res) {
	if (req.method != "PUT") {
		return res.status(405).json({ error: "Method not allowed." });
	}

	const authHeader = req.headers.authorization;
    
	try {
		// authenticate user
		const result = await authUser(authHeader);
		if (result.success === false) {
			// failure to authenticate user
			return res.status(result.status).json({ error: result.error });
		}

		const user = result.user;

		const { username, firstName, lastName, email, avatar, phoneNumber, role} = req.body;

		const updatedUser = await prisma.user.update({
			where: { id: user.id },
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

		return res.status(200).json(updatedUser);
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ error: "Error updating profile." });
	}
}
