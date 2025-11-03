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

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    setIsAuthenticated(!!authToken);
    
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData && userData.id) {
        setUserId(userData.id);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    if (!song) {
      console.error('Song object is null or undefined');
      return;
    }
    
    setComments(song.comments || []);
    
    if (song.comments && isAuthenticated && userId) {
      const userComment = song.comments.find(
        (comment) => comment.user_id === userId
      );
      setHasCommented(!!userComment);
    }
  }, [song, isAuthenticated, userId]);

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
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

      if (hasCommented) {
        setCommentError("😩 You have already commented on this song");
        return;
      }

      if (!song || !song.id) {
        setCommentError("😱 Error: Cannot submit comment for this song");
        console.error('Song object is null or missing id:', song);
        return;
      }

      const authToken = localStorage.getItem('authToken');
      await submitUserComment(song.id, commentText, authToken);
      
      let userData;
      try {
        userData = JSON.parse(localStorage.getItem('userData'));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
      
      const newComment = {
        id: Date.now(),
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
      if (!song || !song.id) {
        console.error('Song object is null or missing id:', song);
        return;
      }
      
      const authToken = localStorage.getItem('authToken');
      
      await deleteUserComment(editCommentId, authToken);
      await submitUserComment(song.id, editCommentText, authToken);
      
      const updatedComments = comments.filter(comment => comment.id !== editCommentId);
      
      const userData = JSON.parse(localStorage.getItem('userData'));
      const newComment = {
        id: Date.now(),
        text: editCommentText,
        user_id: userData?.id || 0,
        username: userData?.username || 'You',
        created_at: new Date().toISOString(),
      };
      
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
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-400 mb-6">
          <form className="w-full">
            <label className="block mb-2">
              <p className="font-bold text-slate-900 mb-2">
                Add Your Comment:
              </p>
              <textarea
                value={commentText}
                onChange={handleCommentChange}
                className="block w-full p-3 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 text-slate-900"
                rows="3"
                placeholder="Share your thoughts about this song..."
              />
            </label>
            <div className="flex flex-col items-end">
              <button
                type="button"
                onClick={handleCommentSubmit}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg shadow-md hover:bg-slate-700 transition-all duration-300 transform hover:scale-105"
              >
                Post Comment
              </button>
              
              <div className="w-full mt-2">
                {commentError && (
                  <p className="text-red-600 text-sm text-center font-medium">{commentError}</p>
                )}
                {commentSuccess && (
                  <p className="text-green-600 text-sm text-center font-medium">
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
                className="bg-white p-4 rounded-xl shadow-md border border-slate-400 transition-all duration-300 hover:shadow-lg"
              >
                {editCommentId === comment.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      className="block w-full p-3 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-slate-900"
                      rows="3"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditCommentId(null)}
                        className="bg-slate-300 text-slate-900 px-3 py-1 rounded-lg hover:bg-slate-400 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEditComment}
                        className="bg-slate-900 text-white px-3 py-1 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-50 p-3 rounded-lg mb-3 border-l-4 border-amber-400">
                      <p className="text-slate-900 font-semibold">
                        {comment.username || "Unknown User"}
                        <span className="ml-2 text-xs text-slate-600 font-normal">
                          {formatDateTime(comment.created_at)}
                        </span>
                      </p>
                    </div>
                    
                    <p className="text-slate-800 px-2 mb-4">{comment.text}</p>
                    
                    {isAuthenticated && (
                      <div className="flex justify-end gap-3 mt-3 border-t border-slate-200 pt-3">
                        <button
                          onClick={() => handleEditComment(comment.id, comment.text)}
                          className="text-amber-700 hover:text-amber-900 transition-colors flex items-center font-medium text-sm"
                          aria-label="Edit comment"
                          title="Edit comment"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 hover:text-red-800 transition-colors flex items-center font-medium text-sm"
                          aria-label="Delete comment"
                          title="Delete comment"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-400 text-center">
          <p className="text-slate-700 font-medium">
            No comments yet. {isAuthenticated ? "Be the first to share your thoughts!" : (
              <>
                <Link href="/login" className="text-amber-700 hover:text-amber-900 font-semibold">
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
