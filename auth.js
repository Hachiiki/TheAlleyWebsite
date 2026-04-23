const AUTH_API_SERVER = 'http://localhost:3000'; // Make sure this matches backend

// UI state management
function showState(stateId) {
    document.querySelectorAll('.auth-state').forEach(el => el.classList.remove('active'));
    document.getElementById(stateId).classList.add('active');
}

// Check current user status against backend
async function checkAuthStatus() {
    try {
        const response = await fetch(`${AUTH_API_SERVER}/api/me`, {
            credentials: 'include' // crucial for sending cookies
        });

        if (response.ok) {
            const data = await response.json();
            if (data.authenticated && data.user) {
                // Display profile
                const avatarUrl = data.user.avatar 
                    ? `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`
                    : 'https://cdn.discordapp.com/embed/avatars/0.png'; // fallback
                
                document.getElementById('user-avatar').src = avatarUrl;
                document.getElementById('user-global-name').innerText = data.user.global_name || data.user.username;
                document.getElementById('user-username').innerText = `@${data.user.username}`;
                
                showState('auth-profile');
                return;
            }
        }
        // Not authenticated
        showState('auth-login');
    } catch (error) {
        console.error("Auth status check failed:", error);
        showState('auth-login'); // degrade gracefully to login prompt
    }
}

// Handle redirects back from the discord oauth flow
function handleOAuthUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    
    if (authStatus) {
        // Clean url immediately for aesthetics
        window.history.replaceState({}, document.title, window.location.pathname);
        
        if (authStatus === 'success') {
            // Check auth status which will load the profile
            checkAuthStatus();
            return true;
        } else if (authStatus === 'error' || authStatus === 'csrf_error') {
            showState('auth-error');
            return true;
        }
    }
    return false;
}

// Logout
window.logout = async function() {
    showState('auth-loading');
    try {
        await fetch(`${AUTH_API_SERVER}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        showState('auth-login');
    } catch (error) {
        console.error("Logout failed:", error);
        showState('auth-login'); // force state back anyway
    }
}

// Preloader removal (using existing theme logic)
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('loaded');
            setTimeout(() => preloader.remove(), 800);
        }
        
        // Reveal elements
        document.querySelector('.reveal').classList.add('visible');

        // Check auth status or handle redirects
        if (!handleOAuthUrlParams()) {
            checkAuthStatus();
        }

    }, 800); // slightly faster than index page
});
