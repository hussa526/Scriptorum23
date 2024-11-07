import { comparePassword, generateToken } from "../../../utils/auth";
import prisma from "../../../utils/prismaclient";
export default async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).json({message: "need to use POST method"});
    const { username, password } = req.body; //username and password as requried inputs
  
    if (!username || !password) {
      return res.status(400).json({
        message: "Please provide all the required fields",
      });
    }
  
    const user = await prisma.user.findUnique({
      where: {
        username, //finding user based off username 
      },
    });
  
    if (!user || !(await comparePassword(password, user.password))) { //if no one with that username or passwords don't match, return fail 
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
  
    const token = generateToken(user.id, user.username, user.role);
  
    return res.status(200).json({
      token,
    });
  }
  
//lecture code 


