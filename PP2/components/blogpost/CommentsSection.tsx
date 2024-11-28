import React, { useState, useContext } from "react";
import { Comment } from "@/interface/Comment";
import { AuthContext } from "@/context/AuthContext";
import CommentItem from "@/components/blogpost/CommentItem";

interface CommentsSectionProps {
  comments: Comment[];
  blogpostId: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments, blogpostId }) => {
  const [allComments, setAllComments] = useState<Comment[]>(comments);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [reportingCommentId, setReportingCommentId] = useState<number | null>(null);
  const [reportExplanation, setReportExplanation] = useState("");

  const auth = useContext(AuthContext);
  const userToken = localStorage.getItem("userToken");
  const userId = auth?.userId;

  // Function to build a nested comment structure
  const buildCommentTree = (comments: Comment[]): Comment[] => {
    const commentMap: Record<number, Comment & { replies: Comment[] }> = {};
    const topLevelComments: Comment[] = [];

    // Initialize comment map
    comments.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    // Populate replies
    comments.forEach((comment) => {
      if (comment.parentId === null) {
        topLevelComments.push(commentMap[comment.id]);
      } else {
        commentMap[comment.parentId?comment.parentId:0]?.replies.push(commentMap[comment.id]);
      }
    });

    return topLevelComments;
  };

  const commentTree = buildCommentTree(allComments);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
  
    try {
      const endpoint = replyTo ? `/api/comments/reply` : `/api/comments/create`;
      const body = replyTo
        ? { text: newComment, commentId: replyTo }
        : { text: newComment, blogpostId };
  
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      if (!res.ok) {
        if (res.status === 401) {
          alert("You need to be logged in to comment.");
          return;
        }
        throw new Error("Failed to create comment or reply.");
      }
  
      const newCommentData = await res.json();
  
      setAllComments((prev) => {
        if (!replyTo) {
          // Add a top-level comment
          return [{ ...newCommentData, replies: [] }, ...prev];
        }
  
        // Add a reply to the correct parent comment
        const updatedComments = prev.map((comment) => {
          if (comment.id === replyTo) {
            return {
              ...comment,
              replies: [...(comment.replies || []), { ...newCommentData, replies: [] }],
            };
          }
          return comment;
        });
  
        return updatedComments;
      });
  
      setNewComment("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };
  

  const handleDeleteComment = async (commentId: number) => {
    try {
      const res = await fetch(`/api/comments/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete comment.");
      }

      setAllComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleReportComment = async () => {
    if (!reportExplanation.trim() || reportingCommentId === null) return;

    try {
      const res = await fetch(`/api/comments/report`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: reportingCommentId,
          explanation: reportExplanation,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to report comment.");
      }

      alert("Comment reported successfully!");
      setReportingCommentId(null);
      setReportExplanation("");
    } catch (error) {
      console.error("Error reporting comment:", error);
    }
  };

  return (
    <section className="comments-section mt-10">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {auth?.isAuthenticated && (
        <div className="mb-6">
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows={3}
            placeholder={replyTo ? "Write your reply..." : "Add a comment..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            {replyTo && (
              <button
                onClick={() => setReplyTo(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {replyTo ? "Reply" : "Comment"}
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {commentTree.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            userId={userId}
            isLoggedIn={auth?.isAuthenticated}
            setReplyTo={setReplyTo}
            setReportingCommentId={setReportingCommentId}
            reportingCommentId={reportingCommentId}
            reportExplanation={reportExplanation}
            setReportExplanation={setReportExplanation}
            handleDeleteComment={handleDeleteComment}
            handleReportComment={handleReportComment}
          />
        ))}
      </ul>
    </section>
  );
};

export default CommentsSection;
