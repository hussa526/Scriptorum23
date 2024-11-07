import prisma from "@/utils/prismaclient";

import { hashPassword } from "@/utils/auth";

export default async function handler (req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const {firstName, lastName, username, password, email, avatar, phone} = req.body; //all required fields

    if (!firstName || !lastName || !username || !password || !email || !avatar) {
        //if required fields not filled out, return error
        return res.status(400).json({ error: "Required Fields empty." });
    }

    // username must be unique

    try {
        const userExists = await prisma.user.findUnique({
            where: { username }
        });
    
        if (userExists) {
            return res.status(400).json({ error: "Username already exists." });
        }
    
        const user = await prisma.user.create({ //what we are putting in the database 
            data: { 
                firstName,
                lastName,
                username,
                password: await hashPassword(password), 
                email,
                avatar, 
                phone,
                role: "user",
            },
            select: { //what can be actively displayed 
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true
              },
        });
    
        return res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error signing up user." });
    }
} 
