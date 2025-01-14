// Function to fetch GitHub profile data
async function fetchGitHubProfile() {
    const username = document.getElementById("username").value;
    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.style.display = "block"; // Show spinner

    const errorElement = document.getElementById("error");
    const profileElement = document.getElementById("profile");

    profileElement.style.display = "none";
    errorElement.style.display = "none";

    if (!username) {
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            throw new Error("User not found");
        }

        const data = await response.json();

        // Hide spinner and show profile
        loadingSpinner.style.display = "none";
        profileElement.style.display = "block";
        profileElement.classList.add("show");

        // Populate profile
        document.getElementById("avatar").src = data.avatar_url;
        document.getElementById("name").innerText = data.name || "No name available";
        document.getElementById("bio").innerText = data.bio || "No bio available";
        document.getElementById("repos").innerText = data.public_repos;
        document.getElementById("followers").innerText = data.followers;
        document.getElementById("following").innerText = data.following;
        document.getElementById("location").innerText = data.location || "No location available";
        document.getElementById("website").href = data.blog || "#";

        // Social links
        document.getElementById("github-link").href = data.html_url;
        document.getElementById("twitter-link").href = data.twitter_username ? `https://twitter.com/${data.twitter_username}` : "#";

        // Call displayRepos to show repositories
        displayRepos(username);
    } catch (error) {
        loadingSpinner.style.display = "none";
        errorElement.style.display = "block";
    }
}

// Function to fetch repositories
async function fetchRepositories(username) {
    const repoResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=created`);
    const reposData = await repoResponse.json();
    return reposData;
}

// Display repositories in the profile
async function displayRepos(username) {
    const repos = await fetchRepositories(username);
    const reposList = document.getElementById("repos-list");
    reposList.innerHTML = ""; // Clear previous results

    repos.forEach(repo => {
        const repoCard = document.createElement("div");
        repoCard.classList.add("repo-card");

        repoCard.innerHTML = `
            <h4>${repo.name}</h4>
            <p>${repo.description || "No description"}</p>
            <p><strong>⭐ ${repo.stargazers_count}</strong></p>
            <p>Language: ${repo.language || "N/A"}</p>
        `;
        reposList.appendChild(repoCard);
    });
}

// Function to toggle light/dark theme
function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-theme");
    body.classList.toggle("light-theme");
}
