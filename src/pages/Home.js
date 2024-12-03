import React, { useContext, useEffect, useState } from "react";
import {
    getUserData,
    getPosts,
    getComments,
    subscribe,
    unsubscribe,
    deletePost,
    createPost,
    updatePost, addComment
} from "../hooks/Hooks";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";
import Cookies from "js-cookie";
import "../assets/css/home.css";

function Home() {
    document.title = "Home - MetaMesh";

    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [subscriptions, setSubscriptions] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [commentsByPost, setCommentsByPost] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserData();

                setUsername(data.username);
                setUserId(data.id);
                localStorage.setItem("userId", data.id); // Enregistrer le userId dans le localStorage

                const subscriptionsArray = Object.entries(data.subscriptions || {}).map(
                    ([id, username]) => ({ id, username })
                );
                setSubscriptions(subscriptionsArray);

                const subscribersArray = Object.entries(data.subscribers || {}).map(
                    ([id, username]) => ({ id, username })
                );
                setSubscribers(subscribersArray);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, []);


    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const data = await getPosts("");
            setPosts(data);

            const commentsPromises = data.map(async (post) => {
                const comments = await getComments(post.id);
                return { postId: post.id, comments };
            });

            const commentsResults = await Promise.all(commentsPromises);
            const commentsMap = commentsResults.reduce((acc, { postId, comments }) => {
                acc[postId] = comments;
                return acc;
            }, {});

            setCommentsByPost(commentsMap);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLogout = () => {
        Cookies.remove("authToken");
        Cookies.remove("userData");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        navigate("/login");
    };

    const handleOpenModalForEdit = (post) => {
        setIsEditing(true);
        setPostToEdit(post);
        setIsModalOpen(true);
    };

    const handleOpenModalForCreate = () => {
        setIsEditing(false);
        setPostToEdit(null);
        setIsModalOpen(true);
    };

    const toggleSubscription = async (authorId) => {
        const isCurrentlySubscribed = subscriptions.some((sub) => sub.id === authorId);

        try {
            if (isCurrentlySubscribed) {
                await unsubscribe(authorId);
                setSubscriptions((prevSubscriptions) =>
                    prevSubscriptions.filter((sub) => sub.id !== authorId)
                );
            } else {
                await subscribe(authorId);
                setSubscriptions((prevSubscriptions) => [
                    ...prevSubscriptions,
                    { id: authorId, username: `User ${authorId}` } // Remplacez `User ${authorId}` par une méthode pour obtenir le vrai username si possible
                ]);
            }

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.authorId === authorId
                        ? { ...post, isSubscribed: !isCurrentlySubscribed }
                        : post
                )
            );
        } catch (error) {
            console.error(
                `Failed to ${isCurrentlySubscribed ? "unsubscribe" : "subscribe"}:`,
                error
            );
        }
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <nav className="nav-menu">
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                    <Link
                        to="/subscriptions"
                        state={{ subscriptions, subscribers }}
                        className="nav-link"
                    >
                        Subscriptions
                    </Link>
                    <Link to="/notifications" className="nav-link">
                        Notifications
                    </Link>
                    <Link to="/settings" className="nav-link">
                        Settings
                    </Link>
                </nav>
                <div className="header-actions">
                    <button className="create-post-button" onClick={handleOpenModalForCreate}>
                        Create Post
                    </button>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>
            <main className="posts-container">
                {isLoading ? (
                    <div className="loader">
                        <p>Loading posts...</p>
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            comments={commentsByPost[post.id] || []}
                            subscriptions={subscriptions}
                            userId={userId}
                            toggleSubscription={toggleSubscription}
                            refreshPosts={fetchPosts}
                            onEditPost={handleOpenModalForEdit}
                        />
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
            </main>

            <footer className="connected-info">Connected as {username}</footer>

            {isModalOpen && (
                <PostModal
                    closeModal={() => {
                        setIsModalOpen(false);
                        setPostToEdit(null);
                    }}
                    refreshPosts={fetchPosts}
                    isEditing={isEditing}
                    initialPost={postToEdit}
                />
            )}
        </div>
    );
}


function PostCard({ post, comments, subscriptions, userId, refreshPosts, toggleSubscription, onEditPost }) {
    const [newComment, setNewComment] = useState(""); // État pour le commentaire à envoyer
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleSubscribeToggle = () => {
        toggleSubscription(post.authorId);
    };

    const handleDelete = async () => {
        try {
            await deletePost(post.id);
            refreshPosts();
        } catch (error) {
            console.error("Failed to delete post:", error);
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    const handleSendComment = async () => {
        if (!newComment.trim()) return;
        try {
            await addComment(post.id, newComment);
            setNewComment("");
            refreshPosts();
        } catch (error) {
            console.error("Failed to send comment:", error);
            alert("An error occurred while sending the comment.");
        }
    };

    const isAuthorCurrentUser = post.authorId === userId;
    const isSubscribed = subscriptions.some((sub) => sub.id === post.authorId);

    return (
        <div className="post-card">
            <div className="post-header">
                <span className="post-author">{post.author}</span>
                <span className="post-created-at">
                    {new Date(post.createdAt).toLocaleString()}
                </span>
                {isAuthorCurrentUser ? (
                    <div className="post-actions">
                        <button className="update-button" onClick={() => onEditPost(post)}>
                            Update
                        </button>
                        <button
                            className="delete-button"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            Delete
                        </button>
                    </div>
                ) : (
                    <button
                        className="subscribe-button"
                        onClick={handleSubscribeToggle}
                    >
                        {isSubscribed ? "Unsubscribe" : "Subscribe"}
                    </button>
                )}
            </div>
            {post.mediaId && (
                <img
                    src={`https://d1jyxxz9imt9yb.cloudfront.net/medialib/3615/image/s768x1300/MC_20180821_FRA_BeautyShots_030_334609_reduced.jpg`}
                    //src={`https://your-media-service.com/${post.mediaId}`}
                    alt="Post"
                    className="post-image"
                />
            )}
            <div className="post-content">
                <h4>{post.title}</h4>
                <p>{post.content}</p>
            </div>
            <hr className="content-divider" />
            <div className="post-comments">
                <h4>Comments:</h4>
                <ul>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <li key={index}>
                                <strong>{comment.username}</strong> (
                                {new Date(comment.createdAt).toLocaleString()}):{" "}
                                {comment.content}
                            </li>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </ul>
                <div className="add-comment">
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="comment-input"
                    />
                    <button onClick={handleSendComment} className="send-comment-button">
                        Send
                    </button>
                </div>
            </div>

            {/* Modal de confirmation */}
            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Are you sure you want to delete this post?</h3>
                        <div className="modal-actions">
                            <button
                                className="button confirm-button"
                                onClick={handleDelete}
                            >
                                Confirm
                            </button>
                            <button
                                className="button cancel-button"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


function PostModal({ closeModal, refreshPosts, isEditing, initialPost }) {
    const [title, setTitle] = useState(initialPost?.title || "");
    const [content, setContent] = useState(initialPost?.content || "");
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            alert("Title and content are required!");
            return;
        }

        const postPayload = {
            title,
            content,
            mediaId: image ? image.name : initialPost?.mediaId || null,
        };

        try {
            if (isEditing) {
                await updatePost(initialPost.id, postPayload);
            } else {
                await createPost(postPayload);
            }

            refreshPosts();
            closeModal();
        } catch (error) {
            console.error("Failed to submit post:", error);
            alert("An error occurred while processing the post. Please try again.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{isEditing ? "Update Post" : "Create Post"}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="4"
                        required
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <div className="modal-actions">
                        <button type="submit" className="button">
                            Submit
                        </button>
                        <button type="button" className="button cancel-button" onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Home;
