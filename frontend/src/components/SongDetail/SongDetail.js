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
  FacebookIcon, // Importing FacebookIcon
  XIcon, // Importing TwitterIcon
  WhatsappIcon, // Importing WhatsappIcon
  FacebookMessengerIcon, // Importing FacebookMessengerIcon
} from "react-share";

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
    <div className="container mx-auto px-4 py-8">
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
            <link rel="canonical" href={`https://pophits.org/songs/${song.slug}`} />
          </Helmet>
          <div className="flex flex-col items-center justify-center">
            <h1 className="song-title">
              <span>{song.title}</span>
              <br />
              <span className="text-md">
                by <Link to={`/artist/${song.artist_slug}`}>{song.artist}</Link>
              </span>
            </h1>
          </div>
          <div className="flex items-center">
            {isAuthenticated && (
              <button
                className={`circle-button bookmark-button ${
                  isBookmarked ? "bookmarked" : ""
                }`}
                onClick={handleBookmarkToggle}
              >
                <span>{isBookmarked ? "❤️" : "🤍"}</span>
              </button>
            )}
            {song.average_user_score !== null && (
              <div className="bg-pink-200 text-pink-700 font-bold px-2 py-1 rounded">
                <span>
                  {song.average_user_score === 0
                    ? "-"
                    : song.average_user_score}
                </span>
              </div>
            )}
          </div>

          <h2 className="sr-only">Song Information</h2>
          <div className="song-info-container bg-gray-50 text-black p-2 mt-2 mb-4 text-center border border-gray-300 rounded-lg">
            <div className="song-info-box">
              <p>
                <span className="info-item">📅 Year: {song.year}</span>
                <span className="info-item">
                  📈 Peak Position: {song.peak_rank}
                </span>
                <span className="info-item">
                  ⏱ Weeks on chart: {song.weeks_on_chart}
                </span>
                <span className="info-item">
                  🖐🏾 # of ratings: {song.total_ratings}
                </span>
              </p>
            </div>
          </div>

          <h2 className="sr-only">Share Options</h2>
          <div
            className="social-share-buttons"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div style={{ textAlign: "center", marginRight: "10px" }}>
              <FacebookShareButton
                url={window.location.href}
                quote={`${song.title} by ${song.artist}`}
                hashtag="#popmusic"
                image="https://pophits.org/static/media/oldhits_logo.b80a2dacf31854b558ac.png"
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            </div>
            <div style={{ textAlign: "center", marginRight: "10px" }}>
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
                <XIcon size={32} round />
              </TwitterShareButton>
            </div>
            <div style={{ textAlign: "center", marginRight: "10px" }}>
              <WhatsappShareButton
                url={window.location.href}
                title={`${song.title} (${song.year}) was a hit by ${song.artist}, spending ${song.weeks_on_chart} weeks on the Hot 100, peaking at #${song.peak_rank}`}
                separator=" - "
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>
            <div style={{ textAlign: "center" }}>
              <FacebookMessengerShareButton
                url={window.location.href}
                appId="your-facebook-app-id" // Replace with your Facebook App ID
                image="https://pophits.org/static/media/oldhits_logo.b80a2dacf31854b558ac.png"
              >
                <FacebookMessengerIcon size={32} round />
              </FacebookMessengerShareButton>
            </div>
          </div>

          <h2 className="sr-only">Audio Player</h2>
          <div className="spotify-embed">
            {song.spotify_url ? (
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
              ></iframe>
            ) : (
              <div className="audio-link-not-available-box">
                <p>No audio link available atm</p>
                <div className="search-buttons">
                  <a
                    href={`https://open.spotify.com/search/${encodeURIComponent(
                      `${song.artist} ${song.title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="search-spotify-button"
                  >
                    Search Spotify
                  </a>
                  <br />
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      `${song.artist} ${song.title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="search-youtube-button"
                  >
                    Search YouTube
                  </a>
                </div>
              </div>
            )}
          </div>
          {!isAuthenticated && (
            <div
              className="flex items-center p-4 mt-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50"
              role="alert"
            >
              <svg
                className="flex-shrink-0 w-4 h-4 mr-2"
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
                  Please <a href="/login">login</a> to rate this song. This will
                  also allow you to create playlist, bookmark songs and filter
                  your rating history.
                </span>
              </div>
            </div>
          )}
          <div className="flex flex-col">
            {isAuthenticated && (
              <div className="scoring-container">
                <div className="flex flex-wrap">
                  <p className="scoring-label">Your score:</p>
                  <div className="flex flex-wrap">
                    {[...Array(10)].map((_, index) => (
                      <div
                        key={index}
                        className={`score-box ${
                          userScore === index + 1 ? "selected" : ""
                        }`}
                        onClick={() => handleScoreChange(index + 1)}
                        style={{ fontSize: "0.8rem" }}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <h2 className="sr-only">Song Review</h2>
            <div className="review-text bg-gray-50 text-black p-2 mt-2 mb-4 border border-gray-300 rounded-lg">
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(song.review),
                }}
              />
            </div>
            {isAuthenticated && (
              <div className="flex flex-wrap">
                <h2 className="sr-only">User Comments</h2>
                <form style={{ display: "block", width: "100%" }}>
                  <label className="block mb-2">
                    <p className="mr-2 font-bold">Your Comment:</p>
                    <textarea
                      value={commentText}
                      onChange={handleCommentChange}
                      className="block w-full mt-1 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleCommentSubmit}
                    className="submit-comment-button"
                  >
                    📢
                  </button>
                  {commentError && (
                    <p className="text-red-500 mt-2">{commentError}</p>
                  )}
                  {commentSuccess && (
                    <p className="text-green-500">
                      Comment submitted successfully!
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>

          <div className="comments-section">
            {song.comments &&
              song.comments.length > 0 &&
              song.comments
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((comment) => (
                  <div key={comment.id} className="comment-container">
                    {editCommentId === comment.id ? (
                      <>
                        <textarea
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="block w-full mt-1 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={handleSaveEditComment}
                          className="submit-comment-button"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="comment-text">{comment.text}</p>
                        <p className="comment-meta">
                          Posted by:{" "}
                          {comment.username ? comment.username : "Unknown User"}
                          <span className="ml-2">
                            Posted {formatDateTime(comment.created_at)}
                          </span>
                        </p>
                        {comment.user_id === userId && (
                          <div className="mt-2">
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-500 mr-2"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() =>
                                handleEditComment(comment.id, comment.text)
                              }
                              className="text-indigo-500"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
            {(!song.comments || song.comments.length === 0) && (
              <div className="mt-6">
                <p className="text-black font-bold">Comments:</p>
                <p className="text-xs">No comments available.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SongDetail;
