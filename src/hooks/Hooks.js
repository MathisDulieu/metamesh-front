import Cookies from 'js-cookie';
import data from "bootstrap/js/src/dom/data";

const API_URL = 'https://metamesh-app-metamesh-api.azuremicroservices.io/api';

export async function login(data) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Expected status 200, but received: ${response.status}`);
    }

    return await response.text();
}

export async function register(data) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.status !== 201) {
        throw new Error(`HTTP error! Expected status 201, but received: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function getUserData() {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        return {};
    }

    try {
        const response = await fetch(`${API_URL}/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        return {};
    }
}

export async function getPosts(keyword = '') {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        return {};
    }

    try {
        const response = await fetch(`${API_URL}/search/posts?keyword=${encodeURIComponent(keyword)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        return {};
    }
}

export async function getComments(postId) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        return {};
    }

    try {
        const response = await fetch(`${API_URL}/posts/${encodeURIComponent(postId)}/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching comments:", error);
        return {};
    }
}

export async function subscribe(userId) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        return {};
    }

    const response = await fetch(`${API_URL}/users/${encodeURIComponent(userId)}/subscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function unsubscribe(userId) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        return {};
    }

    const response = await fetch(`${API_URL}/users/${encodeURIComponent(userId)}/unsubscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function deletePost(postId) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        return {};
    }

    const response = await fetch(`${API_URL}/posts/${encodeURIComponent(postId)}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function createPost(data) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        console.error("No auth token found");
        return {};
    }

    const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
    });

    console.log("API Response status:", response.status);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function updatePost(postId, data) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        console.error("No auth token found");
        return {};
    }

    const response = await fetch(`${API_URL}/posts/${encodeURIComponent(postId)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
    });

    console.log("API Response status:", response.status);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function addComment(postId, content) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        console.error("No auth token found");
        return {};
    }

    const response = await fetch(`${API_URL}/posts/${encodeURIComponent(postId)}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(content),
    });

    console.log("API Response status:", response.status);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function getPostById(postId) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        return {};
    }

    try {
        const response = await fetch(`${API_URL}/posts/${encodeURIComponent(postId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching post:", error);
        return {};
    }
}

export async function getNotifications(userId) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        return {};
    }

    try {
        const response = await fetch(`${API_URL}/users/${encodeURIComponent(userId)}/notifications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return {};
    }
}

export async function setUserPrivacy(userId, isPrivate) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        return {};
    }

    try {
        const response = await fetch(`${API_URL}/users/${encodeURIComponent(userId)}/privacy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(isPrivate),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return {};
    }
}