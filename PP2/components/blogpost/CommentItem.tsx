import React from "react";
import { Comment } from "@/interface/Comment";

interface CommentItemProps {
  comment: Comment;
  userId: string | null | undefined;
  isLoggedIn: boolean | undefined;
  setReplyTo: (commentId: number | null) => void;
  setReportingCommentId: (commentId: number | null) => void;
  reportingCommentId: number | null;
  reportExplanation: string;
  setReportExplanation: (value: string) => void;
  handleDeleteComment: (commentId: number) => void;
  handleReportComment: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    userId,
    isLoggedIn,
    setReplyTo,
    setReportingCommentId,
    reportingCommentId,
    reportExplanation,
    setReportExplanation,
    handleDeleteComment,
    handleReportComment,
  }) => {
    const handleVote = async (commentId: number, type: "upvote" | "downvote") => {
        try {
          const userToken = localStorage.getItem("userToken");
    
          const res = await fetch(`/api/comments/vote`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ commentId, type })
          });
    
          if (!res.ok) {
            if (res.status === 401) {
              alert("You need to be logged in to vote.");
            } else {
              const data = await res.json();
              alert(data.error || "Error voting.");
            }
            return;
          }
    
          const votedComment = await res.json();
    
          // Update the comment state (you might need to update the state here or re-fetch the data)
          // If you're using state to manage comments, you can update the votes for the specific comment here.
    
        } catch (error) {
          console.error("Error voting on comment:", error);
        }
      };

    return (
      <li className="bg-white p-4 rounded-md shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <strong>{comment.user.username}</strong>
          </p>
          {userId !== undefined && userId !== null && +userId === comment.user.id && (
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          )}
        </div>
        <p className="mt-2 text-gray-800">{comment.text}</p>
  
        {/* Voting Buttons */}
        <div className="flex items-center mt-2 gap-4">
          <button className="text-sm text-green-500 hover:text-green-700"
          onClick={() => handleVote(comment.id, "upvote")}>
            👍 {comment.votes.filter((vote) => vote.type).length}
          </button>
          <button className="text-sm text-red-500 hover:text-red-700"
          onClick={() => handleVote(comment.id, "downvote")}>
            👎 {comment.votes.filter((vote) => !vote.type).length}
          </button>
          {isLoggedIn && (
            <button
              className="text-sm text-blue-500 hover:text-blue-700"
              onClick={() => setReplyTo(comment.id)}
            >
              Reply
            </button>
          )}
          {isLoggedIn && (
            <button
              className="text-sm text-yellow-500 hover:text-yellow-700"
              onClick={() => setReportingCommentId(comment.id)}
            >
              Report
            </button>
          )}
        </div>
  
        {/* Reporting Form */}
        {reportingCommentId === comment.id && (
          <div className="mt-4">
            <textarea
              className="w-full p-2 border rounded mb-2"
              rows={3}
              placeholder="Explain why you're reporting this comment..."
              value={reportExplanation}
              onChange={(e) => setReportExplanation(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReportingCommentId(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReportComment}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Submit Report
              </button>
            </div>
          </div>
        )}
  
        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <ul className="ml-4 mt-4 border-l pl-4 space-y-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                userId={userId}
                isLoggedIn={isLoggedIn}
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
        )}
      </li>
    );
  };
  

export default CommentItem;
