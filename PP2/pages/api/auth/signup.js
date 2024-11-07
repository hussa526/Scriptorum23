import prisma from "../../../utils/prismaclient";
import { hashPassword } from "../../../utils/auth";
export default async function handler (req, res)
{
    if (req.method !== 'POST')
        return res.status(405).json({message: "need to use POST method"});

    const {firstName, lastName, username, password, email, avatar, phoneNumber, role} = req.body; //all required fields

    if (!firstName || !lastName || !username || !password || !email || !avatar || !role) //if required fields not filled out, return error
        return res.status(400).json({message: "required fields not filled out"});

    if (role !== 'user' && role !== 'administrator')
        return res.status(400).json({message: "role can only be user or administrator"}) //roles can only be user or admin

    const user = await prisma.user.create({ //what we are putting in the database 
        data: { 
            firstName,
            lastName,
            username,
            password: await hashPassword(password), 
            email,
            avatar, 
            phoneNumber,
            role
        },
        select: { //what can be actively displayed 
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true
          },
    });
    res.status(200).json(user);
} 


