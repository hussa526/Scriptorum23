import prisma from "../../../utils/prismaclient";
import jwt from 'jsonwebtoken';


export default async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).json({message: "need to use POST method"});
    const {id, isHidden} = req.body; //a bool 
  
    if (!id || typeof isHidden !== 'boolean') { //verify inputs
      return res.status(400).json({
        message: "Please provide all the required fields",
      });
    }

    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: "Authorization token required" });
    }

    try
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role == 'user') {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }

        const comment = await prisma.comment.findUnique({
            where: {
              id, //finding comment based off id 
            },
          });

          if (!comment)
            return res.status(404).json({message: "no such comment with id exists"});

        const updatedComment = await prisma.comment.update({ //update isHidden with entered value
            where: {
                id,
            },
            data: {
                isHidden : isHidden,
            },

        })
        return res.status(200).json({message: "successful update"})

    }
    catch(error)
    {
        console.error("error updating", error)
        return res.status(500).json({message: "error"})
    }
}

