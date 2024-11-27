// Created by ChatGPT

import React, { useState } from "react";
import { Comment } from "@/interface/Comment";

interface CommentsSectionProps {
  comments: Comment[];
  blogpostId: number; // Pass the blog post ID to associate new comments
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments, blogpostId}) => {
  const [allComments, setAllComments] = useState<Comment[]>(comments); // State for all comments
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [replyTo, setReplyTo] = useState<number | null>(null); // State for reply input
  const [reportingCommentId, setReportingCommentId] = useState<number | null>(null); // State for reporting form
  const [reportExplanation, setReportExplanation] = useState(""); // Explanation for reporting a comment

  const userToken = localStorage.getItem("userToken");
  const userIdTemp = localStorage.getItem("UserId");
  const userId = userIdTemp? +userIdTemp: null;

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const endpoint = replyTo ? `/api/comments/reply` : `/api/comments/create`;
      const body = replyTo
        ? { text: newComment, commentId: replyTo }
        : { content: newComment, blogpostId };

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
        throw new Error("Failed to create comment or reply");
      }

      const data = await res.json();
      if (replyTo) {
        setAllComments((prev) =>
          prev.map((comment) =>
            comment.id === replyTo
              ? { ...comment, replies: [...(comment.replies || []), data] }
              : comment
          )
        );
      } else {
        setAllComments((prev) => [data, ...prev]);
      }

      setNewComment("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error creating comment or reply:", error);
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
        if (res.status === 401) {
          alert("You need to be logged in to report a comment.");
          return;
        }
        throw new Error("Failed to report comment");
      }

      alert("Comment reported successfully!");
      setReportingCommentId(null);
      setReportExplanation("");
    } catch (error) {
      console.error("Error reporting comment:", error);
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
        throw new Error("Failed to delete comment");
      }

      setAllComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <section className="comments-section mt-10">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {/* Add Comment Form */}
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

      {/* Comments List */}
      <ul className="space-y-4">
        {allComments.map((comment) => (
          <li key={comment.id} className="bg-white p-4 rounded-md shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <strong>{comment.user.username}</strong>
              </p>
              {userId !== null && userId === comment.user.id && (
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
              <button className="text-sm text-green-500 hover:text-green-700">
                👍 {comment.votes.filter((vote) => vote.type).length}
              </button>
              <button className="text-sm text-red-500 hover:text-red-700">
                👎 {comment.votes.filter((vote) => !vote.type).length}
              </button>
              <button
                className="text-sm text-blue-500 hover:text-blue-700"
                onClick={() => setReplyTo(comment.id)}
              >
                Reply
              </button>
              <button
                className="text-sm text-yellow-500 hover:text-yellow-700"
                onClick={() => setReportingCommentId(comment.id)}
              >
                Report
              </button>
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
            {comment.replies && (
              <ul className="ml-4 mt-4 border-l pl-4 space-y-2">
                {comment.replies.map((reply) => (
                  <li key={reply.id} className="bg-gray-100 p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        <strong>{reply.user.username}</strong>
                      </p>
                    </div>
                    <p className="mt-2 text-gray-800">{reply.text}</p>

                    {/* Voting Buttons */}
                    <div className="flex items-center mt-2 gap-4">
                      <button className="text-sm text-green-500 hover:text-green-700">
                        👍 {reply.votes.filter((vote) => vote.type).length}
                      </button>
                      <button className="text-sm text-red-500 hover:text-red-700">
                        👎 {reply.votes.filter((vote) => !vote.type).length}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CommentsSection;
