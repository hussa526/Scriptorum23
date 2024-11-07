import prisma from "../../../utils/prismaclient"

export default async function handler(req, res) {
    const { id } = req.query;
    const tempId = parseInt(id, 10);

    if (req.method === "GET") {
        // get template

        try {
            const template = await prisma.template.findUnique({
                where: { id: tempId },
            });

            if (!template) {
                return res.status(404).json({ error: "Template not found." });
            }
    
            return res.status(200).json(template);
        } catch (error) {
            return res.status(500).json({ error: "Error fetching template."});
        }
    } else {
        return res.status(400).json({ error: "Method not allowed." });
    }
}