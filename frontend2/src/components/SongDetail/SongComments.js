"use client";

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { submitUserComment, deleteUserComment, editUserComment } from '@/lib/api';

export default function SongComments({ song }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [editCommentText, setEditCommentText] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [hasCommented, setHasCommented] = useState(false);
  const [comments, setComments] = useState(song.comments || []);

  // Check authentication status on component mount
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    setIsAuthenticated(!!authToken);
    
    // Try to get user ID from localStorage
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData && userData.id) {
        setUserId(userData.id);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    // Check if song exists and has comments
    if (!song) {
      console.error('Song object is null or undefined');
      return;
    }
    
    // Initialize comments from song
    setComments(song.comments || []);
    
    // Check if user has already commented
    if (song.comments && isAuthenticated && userId) {
      const userComment = song.comments.find(
        (comment) => comment.user_id === userId
      );
      setHasCommented(!!userComment);
    }
  }, [song, isAuthenticated, userId]);

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
    // Clear any previous error/success messages when user starts typing
    setCommentError(null);
    setCommentSuccess(false);
  };

  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      setCommentError("Please login to comment");
      return;
    }
    
    try {
      if (!commentText.trim()) {
        setCommentError("😖 Comment cannot be blank");
        return;
      }

      // Check if the user has already commented
      if (hasCommented) {
        setCommentError("😩 You have already commented on this song");
        return;
      }

      // Check if song exists and has an id
      if (!song || !song.id) {
        setCommentError("😱 Error: Cannot submit comment for this song");
        console.error('Song object is null or missing id:', song);
        return;
      }

      const authToken = localStorage.getItem('authToken');
      await submitUserComment(song.id, commentText, authToken);
      
      // Optimistically update the UI
      let userData;
      try {
        userData = JSON.parse(localStorage.getItem('userData'));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
      
      // If we can't get user data, just use placeholder values
      // The real data will be loaded when the page refreshes
      const newComment = {
        id: Date.now(), // Temporary ID until we refresh
        text: commentText,
        user_id: userData?.id || 0,
        username: userData?.username || 'You',
        created_at: new Date().toISOString(),
      };
      
      setComments([newComment, ...comments]);
      setCommentText("");
      setCommentSuccess(true);
      setHasCommented(true);
    } catch (error) {
      setCommentError("🤢 Error submitting comment");
      console.error('Error submitting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) return;
    
    // Check if commentId is valid
    if (!commentId) {
      console.error('Invalid comment ID:', commentId);
      return;
    }
    
    try {
      const confirmed = window.confirm(
        "😮 Are you sure you want to delete this comment?"
      );
      
      if (confirmed) {
        const authToken = localStorage.getItem('authToken');
        await deleteUserComment(commentId, authToken);
        
        // Update comments list
        setComments(comments.filter(comment => comment.id !== commentId));
        setHasCommented(false);
      }
    } catch (error) {
      console.error("🤕 Error deleting comment:", error);
    }
  };

  const handleEditComment = (commentId, existingText) => {
    setEditCommentId(commentId);
    setEditCommentText(existingText);
  };

  const handleSaveEditComment = async () => {
    if (!isAuthenticated || !editCommentId) return;
    
    try {
      // Check if song exists and has an id
      if (!song || !song.id) {
        console.error('Song object is null or missing id:', song);
        return;
      }
      
      const authToken = localStorage.getItem('authToken');
      
      // Instead of trying to edit the comment, we'll delete it and create a new one
      // First, delete the old comment
      await deleteUserComment(editCommentId, authToken);
      
      // Then create a new comment with the updated text
      await submitUserComment(song.id, editCommentText, authToken);
      
      // Update comments list optimistically
      // Remove the old comment
      const updatedComments = comments.filter(comment => comment.id !== editCommentId);
      
      // Add a new comment with the updated text
      const userData = JSON.parse(localStorage.getItem('userData'));
      const newComment = {
        id: Date.now(), // Temporary ID until we refresh
        text: editCommentText,
        user_id: userData?.id || 0,
        username: userData?.username || 'You',
        created_at: new Date().toISOString(),
      };
      
      // Add the new comment to the top of the list
      setComments([newComment, ...updatedComments]);
      
      setEditCommentId(null);
      setEditCommentText("");
    } catch (error) {
      console.error("😡 Error saving edited comment:", error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    return formatDistanceToNow(new Date(dateTimeString), { addSuffix: true });
  };

  return (
    <div className="mb-8">
      <h2 className="sr-only">User Comments</h2>
      {isAuthenticated && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
          <form className="w-full">
            <label className="block mb-2">
              <p className="font-bold text-gray-700 mb-2">
                Add Your Comment:
              </p>
              <textarea
                value={commentText}
                onChange={handleCommentChange}
                className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                rows="3"
                placeholder="Share your thoughts about this song..."
              />
            </label>
            <div className="flex flex-col items-end">
              <button
                type="button"
                onClick={handleCommentSubmit}
                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                Post Comment
              </button>
              
              <div className="w-full mt-2">
                {commentError && (
                  <p className="text-red-500 text-sm text-center">{commentError}</p>
                )}
                {commentSuccess && (
                  <p className="text-green-500 text-sm text-center">
                    Comment submitted successfully!
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((comment) => (
              <div
                key={comment.id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg"
              >
                {editCommentId === comment.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      rows="3"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => setEditCommentId(null)}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg mr-2 hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEditComment}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 p-2 rounded-t-lg mb-3">
                      <p className="text-gray-700 font-medium">
                        {comment.username || "Unknown User"}
                        <span className="ml-2 text-xs text-gray-500">
                          {formatDateTime(comment.created_at)}
                        </span>
                      </p>
                    </div>
                    
                    <p className="text-gray-800 px-2 mb-4">{comment.text}</p>
                    
                    {isAuthenticated && (
                      <div className="flex justify-end space-x-3 mt-2 border-t border-gray-100 pt-2">
                        <button
                          onClick={() => handleEditComment(comment.id, comment.text)}
                          className="text-blue-500 hover:text-blue-700 transition-colors flex items-center"
                          aria-label="Edit comment"
                          title="Edit comment"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          <span className="text-xs">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                          aria-label="Delete comment"
                          title="Delete comment"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span className="text-xs">Delete</span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
          <p className="text-gray-500">
            No comments yet. {isAuthenticated ? "Be the first to share your thoughts!" : (
              <>
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login
                </Link> to share your thoughts!
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
