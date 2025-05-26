import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  getSongBySlug,
  submitUserScore,
  submitUserComment,
  deleteUserComment,
  editUserComment,
  toggleBookmarkSong,
  getUserProfile,
  getUserRatingForSong,
  getBookmarkStatusForSong,
  getCommentStatusForSong,
} from "../../services/api";
import DOMPurify from "dompurify";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../services/auth";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookMessengerShareButton,
  FacebookIcon,
  XIcon,
  WhatsappIcon,
  FacebookMessengerIcon,
  BlueskyShareButton,
  BlueskyIcon,
} from "react-share";
import {
  Calendar,
  TrendingUp,
  Clock,
  Star,
  Music,
  Share2,
  Heart,
} from "lucide-react";

const SongDetail = () => {
  const { slug } = useParams();
  const [song, setSong] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [editCommentText, setEditCommentText] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasCommented, setHasCommented] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [showReview, setShowReview] = useState(false);
  const userId = userProfile ? userProfile.id : null;
  const [artistHashtag, setArtistHashtag] = useState("");

  const toggleReview = () => {
    setShowReview(!showReview);
  };

  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const rating = await getUserRatingForSong(song.id, userId);
        if (rating !== null) {
          setUserScore(rating);
        } else {
          // Handle the case where no rating was found (rating === 0)
          // This could be setting a default state or handling it in a UI way
        }
      } catch (error) {
        // Handle other errors if needed
        console.error("Error fetching user rating:", error);
      }
    };

    if (song && userId) {
      fetchUserRating();
    }
  }, [song, userId]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await getUserProfile(authToken);
        setUserProfile(response.user_data);

        const userScoreForSong = response.user_data.scores.find(
          (score) => score.song_id === song.id
        );
        if (userScoreForSong) {
          setUserScore(userScoreForSong.score);
        }
      } catch (error) {}
    };

    fetchUserProfile();
  }, [song]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedSong = await getSongBySlug(slug);
        setSong(fetchedSong);
        setIsBookmarked(fetchedSong.is_bookmarked);
        document.title = `${fetchedSong.title} by ${fetchedSong.artist} at PopHits.org`;

        const artistHashtag = fetchedSong.artist.replace(/\s+/g, "");
        setArtistHashtag(artistHashtag);

        if (isAuthenticated && fetchedSong.comments) {
          const userComment = fetchedSong.comments.find(
            (comment) => comment.user_id === user.id
          );
          setHasCommented(!!userComment);
        } else {
          setHasCommented(false); // Reset hasCommented if the user is not authenticated or there are no comments
        }

        if (isAuthenticated) {
          const commentStatus = await getCommentStatusForSong(fetchedSong.id);
          setHasCommented(commentStatus.has_commented);
        }
      } catch (error) {}
    };

    fetchData();
  }, [slug, isAuthenticated, user]);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (song && isAuthenticated) {
        try {
          const bookmarkStatus = await getBookmarkStatusForSong(song.id);
          setIsBookmarked(bookmarkStatus.is_bookmarked);
        } catch (error) {}
      }
    };

    fetchBookmarkStatus();
  }, [song, isAuthenticated]);

  useEffect(() => {
    const fetchCommentStatus = async () => {
      if (song && isAuthenticated) {
        try {
          const commentStatus = await getCommentStatusForSong(song.id);
          setHasCommented(commentStatus.has_commented);
        } catch (error) {}
      }
    };

    fetchCommentStatus();
  }, [song, isAuthenticated]);

  const handleBookmarkToggle = async () => {
    try {
      const response = await toggleBookmarkSong(song.id);
      setIsBookmarked(response.is_bookmarked);
    } catch (error) {}
  };

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (song && isAuthenticated) {
        try {
          const bookmarkStatus = await getBookmarkStatusForSong(song.id);
          setIsBookmarked(bookmarkStatus.is_bookmarked);
        } catch (error) {}
      }
    };

    fetchBookmarkStatus();
  }, [song, isAuthenticated]);

  const handleScoreChange = async (score) => {
    try {
      if (userScore === score) {
        setUserScore(0);
        await submitScore(0);
      } else {
        setUserScore(score);
        await submitScore(score);
      }
    } catch (error) {
      setCommentError("Error submitting user score");
    }
  };

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const submitScore = async (score) => {
    try {
      await submitUserScore(song.id, score);
      const updatedSong = await getSongBySlug(slug);
      setSong(updatedSong);
    } catch (error) {
      setCommentError("Error submitting user score");
    }
  };

  const handleCommentSubmit = async () => {
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

      await submitUserComment(song.id, commentText);
      const updatedSong = await getSongBySlug(slug);
      setSong(updatedSong);
      setCommentText("");
      setCommentSuccess(true);

      // Update hasCommented state after successful comment submission
      setHasCommented(true);
    } catch (error) {
      setCommentError("🤢 Error submitting user comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const confirmed = window.confirm(
        "😮 Are you sure you want to delete this comment?"
      );
      if (confirmed) {
        await deleteUserComment(commentId);
        const updatedSong = await getSongBySlug(slug);
        setSong(updatedSong);
      }
    } catch (error) {
      console.error("🤕 Error deleting comment:", error);
    }
  };

  const handleEditComment = async (commentId, existingText) => {
    try {
      setEditCommentId(commentId);
      setEditCommentText(existingText);
    } catch (error) {
      console.error("😵 Error editing comment:", error);
    }
  };

  const handleSaveEditComment = async () => {
    try {
      await editUserComment(song.id, editCommentId, editCommentText);
      const updatedSong = await getSongBySlug(slug);
      setSong(updatedSong);
      setEditCommentId(null);
      setEditCommentText("");
    } catch (error) {
      console.error("😡 Error saving edited comment:", error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    return formatDistanceToNow(new Date(dateTimeString), { addSuffix: true });
  };

  const getTrackIdFromUrl = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      {song && (
        <>
          <Helmet>
            <title>{`${song.title} by ${song.artist}`}</title>
            <meta
              property="og:title"
              content={`${song.title} by ${song.artist}`}
            />
            <meta property="og:description" content={song.review} />
            <meta
              property="og:image"
              content="https://pophits.org/static/media/oldhits_logo.b80a2dacf31854b558ac.png"
            />
            <meta property="og:url" content={window.location.href} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:title"
              content={`${song.title} by ${song.artist}`}
            />
            <meta name="twitter:description" content={song.review} />
            <meta
              name="twitter:image"
              content="https://pophits.org/static/media/oldhits_logo.b80a2dacf31854b558ac.png"
            />
            <link
              rel="canonical"
              href={`https://pophits.org/songs/${song.slug}`}
            />
          </Helmet>

          {/* Enhanced Song Title Section */}
          <div className="flex flex-col items-center justify-center mb-6 bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl shadow-sm">
            <h1 className="text-3xl md:text-5xl px-1 py-1 font-cherry font-bold mb-2 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
              {song.title}
            </h1>
            <div className="text-xl md:text-2xl font-medium text-gray-500 mb-4">
              by{" "}
              <Link
                to={`/artist/${song.artist_slug}`}
                className="text-black hover:text-pink-600 transition-colors"
              >
                {song.artist}
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <button
                  className={`transform transition-transform hover:scale-110 p-3 rounded-full shadow-md ${
                    isBookmarked
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white"
                      : "bg-white text-gray-400 hover:bg-gray-100"
                  }`}
                  onClick={handleBookmarkToggle}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isBookmarked ? "text-white" : "text-gray-400"
                    }`}
                    fill={isBookmarked ? "currentColor" : "none"}
                  />
                </button>
              )}
              {song.average_user_score !== null && (
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold px-4 py-2 rounded-full shadow-md">
                  <span className="text-lg">
                    {song.average_user_score === 0
                      ? "-"
                      : song.average_user_score}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Song Information Box with Lucide icons */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-3 rounded-xl shadow-lg mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <Calendar className="w-6 h-6 text-white mx-auto mb-1" />
                <div className="text-white text-sm">Year</div>
                <div className="text-white font-bold text-pink-400  text-2xl">
                  {song.year}
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <TrendingUp className="w-6 h-6 text-white mx-auto mb-1" />
                <div className="text-white text-sm">Peak Position</div>
                <div className="text-white font-bold text-pink-400  text-2xl">
                  #{song.peak_rank}
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <Clock className="w-6 h-6 text-white mx-auto mb-1" />
                <div className="text-white text-sm">Weeks on Chart</div>
                <div className="text-white font-bold text-pink-400  text-2xl">
                  {song.weeks_on_chart}
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <Star className="w-6 h-6 text-white mx-auto mb-1" />
                <div className="text-white text-sm">Total Ratings</div>
                <div className="text-white font-bold text-pink-400 text-2xl">
                  {song.total_ratings}
                </div>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="mb-4">
            {song.spotify_url ? (
              <div className="overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                <iframe
                  src={`https://open.spotify.com/embed/track/${getTrackIdFromUrl(
                    song.spotify_url
                  )}?utm_source=generator`}
                  width="100%"
                  height="252"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ borderRadius: "12px" }}
                  title={`${song.title} by ${song.artist} on Spotify`}
                ></iframe>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 text-white p-6 rounded-xl shadow-lg">
                <p className="text-center text-lg font-semibold mb-4">
                  No audio link available
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href={`https://open.spotify.com/search/${encodeURIComponent(
                      `${song.artist} ${song.title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-300 flex items-center gap-2"
                  >
                    <Music className="w-4 h-4" /> Search Spotify
                  </a>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      `${song.artist} ${song.title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-300 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> Search YouTube
                  </a>
                </div>
              </div>
            )}
          </div>
          {/* Enhanced Rating Section */}
          <div className="mb-2">
            {!isAuthenticated ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm">
                <div className="flex items-center p-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50">
                  <svg
                    className="flex-shrink-0 w-5 h-5 mr-3 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L8.707 7.293z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div>
                    <span className="font-medium">
                      Please{" "}
                      <a
                        href="/login"
                        className="text-blue-600 hover:text-pink-600 transition-colors font-bold"
                      >
                        login
                      </a>{" "}
                      to rate this song. This will also allow you to create
                      playlists, bookmark songs and filter your rating history.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-sm mb-2">
                {/* Improved mobile-friendly rating UI */}
                <div className="flex flex-col items-center">
                  <p className="text-lg font-medium text-white mb-3 text-center">
                    Your Score:
                  </p>

                  {/* Responsive grid: 2 rows of 5 on mobile, 1 row of 10 on desktop */}
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2 max-w-md mx-auto mb-2">
                    {[...Array(10)].map((_, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md transition-all duration-300 cursor-pointer transform hover:scale-110 ${
                          userScore === index + 1
                            ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => handleScoreChange(index + 1)}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-400 italic text-center mt-3">
                    Click a number to rate, click again to remove your rating
                  </p>
                </div>
              </div>
            )}

            {/* Share Options */}
            <div className="p-1 mb-2">
              <div className="flex justify-center gap-4">
                <div className="transform transition-transform hover:scale-110">
                  <FacebookShareButton
                    url={window.location.href}
                    quote={`${song.title} by ${song.artist}`}
                    hashtag="#popmusic"
                    image="https://pophits.org/static/media/oldhits_logo.b80a2dacf31854b558ac.png"
                  >
                    <FacebookIcon size={40} round className="" />
                  </FacebookShareButton>
                </div>
                <div className="transform transition-transform hover:scale-110">
                  <BlueskyShareButton
                    url={window.location.href}
                    title={`${song.title} (${song.year}) was a hit by ${song.artist}, spending ${song.weeks_on_chart} weeks on the Hot 100, peaking at ${song.peak_rank}`}
                  >
                    <BlueskyIcon size={40} round />
                  </BlueskyShareButton>
                </div>
                <div className="transform transition-transform hover:scale-110">
                  <TwitterShareButton
                    url={window.location.href}
                    title={`${song.title} (${song.year}) was a hit by ${song.artist}, spending ${song.weeks_on_chart} weeks on the Hot 100, peaking at ${song.peak_rank}`}
                    via="PopHitsOrg"
                    hashtags={[
                      "popmusic",
                      "favoritesong",
                      artistHashtag,
                      "pophitsdotorg",
                    ]}
                    image="https://pophits.org/static/media/oldhits_logo.b80a2dacf31854b558ac.png"
                  >
                    <XIcon size={40} round className="" />
                  </TwitterShareButton>
                </div>
                <div className="transform transition-transform hover:scale-110">
                  <WhatsappShareButton
                    url={window.location.href}
                    title={`${song.title} (${song.year}) was a hit by ${song.artist}, spending ${song.weeks_on_chart} weeks on the Hot 100, peaking at #${song.peak_rank}`}
                    separator=" - "
                  >
                    <WhatsappIcon size={40} round className="" />
                  </WhatsappShareButton>
                </div>
                <div className="transform transition-transform hover:scale-110">
                  <FacebookMessengerShareButton
                    url={window.location.href}
                    appId="your-facebook-app-id" // Replace with your Facebook App ID
                    image="https://pophits.org/static/media/oldhits_logo.b80a2dacf31854b558ac.png"
                  >
                    <FacebookMessengerIcon size={40} round className="" />
                  </FacebookMessengerShareButton>
                </div>
              </div>
            </div>

            {/* Review Section */}
            <div className="mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(song.review),
                  }}
                />
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-8">
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
                    <div className="flex justify-between items-center">
                      <div>
                        {commentError && (
                          <p className="text-red-500 text-sm">{commentError}</p>
                        )}
                        {commentSuccess && (
                          <p className="text-green-500 text-sm">
                            Comment submitted successfully!
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleCommentSubmit}
                        className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                      >
                        Post Comment
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {song.comments && song.comments.length > 0 ? (
                <div className="space-y-4">
                  {song.comments
                    .sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    )
                    .map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-white p-4 rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg"
                      >
                        {editCommentId === comment.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={editCommentText}
                              onChange={(e) =>
                                setEditCommentText(e.target.value)
                              }
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
                            <p className="text-gray-800 mb-2">{comment.text}</p>
                            <div className="flex justify-between items-center text-sm">
                              <p className="text-gray-500">
                                <span className="font-medium text-gray-700">
                                  {comment.username
                                    ? comment.username
                                    : "Unknown User"}
                                </span>
                                <span className="ml-2">
                                  {formatDateTime(comment.created_at)}
                                </span>
                              </p>
                              {comment.user_id === userId && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      handleEditComment(
                                        comment.id,
                                        comment.text
                                      )
                                    }
                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                  <p className="text-gray-500">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SongDetail;
