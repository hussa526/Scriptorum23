import prisma from "@/utils/prismaclient";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const { reportId } = req.body;
  
    const authHeader = req.headers.authorization;

    try {
        // authenticate user
        const result = await authUser(authHeader);
        if (result.success === false) {
            return res.status(result.status).json({ error: result.error });
        }

        const user = result.user;
        if (user.role !== "admin") {
            return res.status(400).json({ error: "Admin role required." });
        }

        // find report and verify it exists
        const report = await prisma.report.findUnique({
            where: { id: reportId }
        });

        if (!report) {
            return res.status(400).json({ error: "Report does not exist." });
        }

        if (report.blogpostId) {
            // report is of a blogpost: verify and hide the blogpost
            const blogpost = await prisma.blogpost.findUnique({
                where: { id: report.blogpostId }
            });

            if (!blogpost) {
                return res.status(400).json({ error: "Report not associated with existing blogpost." });
            }

            const hiddenBlogpost = await prisma.blogpost.update({
                where: { id: report.blogpostId },
                data: {
                    isHidden: true,
                }
            });

            return res.status(200).json(hiddenBlogpost);
        } else if (report.commentId) {
            // report is of a comment: verify and hide the comment
            const comment = await prisma.comment.findUnique({
                where: { id: report.commentId }
            });

            if (!comment) {
                return res.status(400).json({ error: "Report not associated with existing comment." });
            }

            const hiddenComment = await prisma.comment.update({
                where: { id: report.commentId },
                data: {
                    isHidden: true,
                }
            });

            return res.status(200).json(hiddenComment);
        } else {
            // shouldn't happen, if a blogpost or comment is deleted, report should also be deleted
            return res.status(500).json({ error: "Report not associated with existing blogpost or comment." });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error blocking content." });
    }
}

