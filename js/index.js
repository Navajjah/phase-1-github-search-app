const form = document.getElementById('github-form');
const input = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');

let searchType = 'user'; // Default search type

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
        if (searchType === 'user') {
            searchUsers(query);
        } else {
            searchRepos(query);
        }
    }
});

function searchUsers(query) {
    fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => {
        displayUsers(data.items);
    })
    .catch(error => console.error('Error:', error));
}

function displayUsers(users) {
    userList.innerHTML = ''; // Clear previous results
    reposList.innerHTML = ''; // Clear previous repos
    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" style="width: 50px; height: 50px; border-radius: 50%;">
            <a href="${user.html_url}" target="_blank">${user.login}</a>
        `;
        userItem.addEventListener('click', () => {
            searchUserRepos(user.login);
        });
        userList.appendChild(userItem);
    });
}

function searchUserRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(data => {
        displayRepos(data);
    })
    .catch(error => console.error('Error:', error));
}

function displayRepos(repos) {
    reposList.innerHTML = ''; // Clear previous results
    repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `
            <strong>${repo.name}</strong>: ${repo.description || 'No description'}
            <br>
            <a href="${repo.html_url}" target="_blank">View Repository</a>
        `;
        reposList.appendChild(repoItem);
    });
}

const toggleButton = document.getElementById('toggle-search');

toggleButton.addEventListener('click', () => {
    searchType = searchType === 'user' ? 'repo' : 'user';
    toggleButton.textContent = searchType === 'user' ? 'Toggle to Repo Search' : 'Toggle to User Search';
    userList.innerHTML = ''; // Clear previous results
    reposList.innerHTML = ''; // Clear previous results
});
