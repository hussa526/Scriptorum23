import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "./prismaclient.js";

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const JWT_SECRET = "NHJEFDNFD3"
const JWT_EXPIRES_IN = "1 hr";

export async function hashPassword(password) {
	return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function comparePassword(password, hash) {
	return await bcrypt.compare(password, hash);
}

export function generateToken(userId, username, role) {
	return jwt.sign({ userId, username, role }, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});
}

function verifyToken(token) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (err) {
		return null;
	}
}

export async function authUser(authHeader) {
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return { success: false, status: 401, error: "Unauthorized" };
	}

	const token = authHeader.split(" ")[1];
	const decoded = verifyToken(token);

	if (!decoded) {
		return { success: false, status: 401, error: "Unauthorized Token" };
	}

	const user = await prisma.user.findUnique({
		where: { id: decoded.userId }
	});

	if (!user) {
		return { success: false, status: 400, error: "User does not exist." };
	}

	return { success: true, user: user };
}
