import prisma from "@/utils/prismaclient";

import { comparePassword, generateToken } from "@/utils/auth";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed." });
	}

	const { username, password } = req.body; //username and password as requried inputs

	if (!username || !password) {
		return res.status(400).json({ message: "Empty username and password required." });
	}
	
	try {
		const user = await prisma.user.findUnique({
			where: { username },
		});

		const passwordVerified = await comparePassword(password, user.password);
	
		if (!user || !passwordVerified) { 
			//if no one with that username or passwords don't match, return fail 
			return res.status(401).json({ message: "Invalid credentials." });
		}
	
		const token = generateToken(user.id, user.username, user.role);
	
		return res.status(200).json({ token });
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ error: "Error login in user." });
	}
}

//lecture code 
