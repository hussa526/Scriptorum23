import prisma from "@/utils/prismaclient"

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const { id } = req.query;
    const blogpostId = parseInt(id, 10);

    try {
        const blogpost = await prisma.blogpost.findUnique({
            where: { id: blogpostId },
            include: {
              templates: {
                include: {
                  user: true, // Ensure this is properly structured and that the `Template` model has a `user` relation
                  tags: true,
                },
              },
              user: true,
              tags: true,
              comments: {
                include: {
                  user: true,
                  votes: true,
                },
              },
              votes: true,
            },
          });
          
          

        if (!blogpost) {
            return res.status(404).json({ error: "Blogpost not found." });
        }

        return res.status(200).json(blogpost);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching blogpost."});
    }
}