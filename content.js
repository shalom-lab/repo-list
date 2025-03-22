function createSidebar() {
  const sidebar = document.createElement('div');
  sidebar.className = 'gh-repos-sidebar';
  document.body.appendChild(sidebar);
  return sidebar;
}

function getUsername() {
  // 从URL中获取用户名
  const path = window.location.pathname.split('/');
  if (path[1] && !path[1].includes('.')) {
    return path[1];
  }
  return null;
}

async function fetchUserRepos(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const repos = await response.json();
    return repos;
  } catch (error) {
    console.error('Error fetching repos:', error);
    return [];
  }
}

function renderRepos(repos, sidebar) {
  sidebar.innerHTML = '<h2>仓库列表</h2>';
  
  repos.forEach(repo => {
    const repoElement = document.createElement('div');
    repoElement.className = 'repo-item';
    
    repoElement.innerHTML = `
      <div class="repo-name">${repo.name}</div>
      <div class="repo-description">${repo.description || '暂无描述'}</div>
    `;
    
    repoElement.addEventListener('click', () => {
      window.location.href = repo.html_url;
    });
    
    sidebar.appendChild(repoElement);
  });
}

async function init() {
  const username = getUsername();
  if (!username) return;
  
  const sidebar = createSidebar();
  const repos = await fetchUserRepos(username);
  renderRepos(repos, sidebar);
}

init(); 