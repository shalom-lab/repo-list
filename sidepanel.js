import { t } from './i18n.js';

async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

function getUsername(url) {
    try {
        const urlObj = new URL(url);
        const path = urlObj.pathname.split('/').filter(Boolean); // 过滤空字符串
        
        // 如果路径为空，返回 null
        if (path.length === 0) return null;
        
        // 检查第一个路径段是否是有效的用户名
        const invalidPaths = ['settings', 'marketplace', 'pulls', 'issues', 'explore', 'notifications', 'login', 'signup'];
        if (!invalidPaths.includes(path[0])) {
            return path[0];
        }
        
        return null;
    } catch (e) {
        console.error('URL parsing error:', e);
        return null;
    }
}

async function fetchUserRepos(username) {
    if (!username) {
        console.log('No valid username found');
        return [];
    }

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.mercy-preview+json'
            }
        });
        
        if (response.status === 404) {
            console.log(`User "${username}" not found`);
            return [];
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const repos = await response.json();
        return repos;
    } catch (error) {
        console.error('Error fetching repos:', error);
        return [];
    }
}

// 获取浏览器语言设置
const browserLang = navigator.language || navigator.userLanguage;
const isZH = browserLang.startsWith('zh');

// 相对时间格式化配置
const rtf = new Intl.RelativeTimeFormat(browserLang, { numeric: 'auto' });

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 60) {
        return rtf.format(-diffMinutes, 'minute');
    } else if (diffHours < 24) {
        return rtf.format(-diffHours, 'hour');
    } else if (diffDays < 30) {
        return rtf.format(-diffDays, 'day');
    } else if (diffDays < 365) {
        return rtf.format(-Math.floor(diffDays/30), 'month');
    } else {
        return rtf.format(-Math.floor(diffDays/365), 'year');
    }
}

function getLanguageDisplayName(langCode) {
    try {
        return new Intl.DisplayNames([browserLang], { type: 'language' }).of(langCode);
    } catch (e) {
        return langCode;
    }
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'TypeScript': '#2b7489',
        'C++': '#f34b7d',
        'C#': '#178600',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Swift': '#ffac45',
        'Rust': '#dea584',
        'Kotlin': '#F18E33',
        'Vue': '#41b883',
        'HTML': '#e34c26',
        'CSS': '#563d7c'
    };
    return colors[language] || '#8b949e';
}

function setupSearch() {
    const searchInput = document.getElementById('repo-search');
    let allRepoItems;
    let unstarredSection;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // 延迟获取元素，确保它们已经被渲染
        if (!allRepoItems) {
            allRepoItems = document.querySelectorAll('.repo-item');
            unstarredSection = document.querySelector('.unstarred-section');
        }
        
        let visibleUnstarredCount = 0;

        allRepoItems.forEach(item => {
            const repoName = item.querySelector('.repo-name').textContent.toLowerCase();
            const repoDesc = item.querySelector('.repo-description').textContent.toLowerCase();
            const topics = Array.from(item.querySelectorAll('.topic-tag'))
                .map(tag => tag.textContent.toLowerCase());
            const language = item.querySelector('.repo-language')?.textContent.toLowerCase() || '';
            
            const matches = repoName.includes(searchTerm) || 
                          repoDesc.includes(searchTerm) ||
                          topics.some(topic => topic.includes(searchTerm)) ||
                          language.includes(searchTerm);
            
            item.classList.toggle('hidden', !matches);
            
            // 计算未加星标仓库中可见的数量
            if (matches && item.closest('.section-content')) {
                visibleUnstarredCount++;
            }
        });

        // 更新未加星标仓库区域的显示状态和计数
        if (unstarredSection) {
            const countSpan = unstarredSection.querySelector('.section-title');
            if (countSpan) {
                countSpan.textContent = `未获得 Star 的仓库 (${visibleUnstarredCount})`;
            }
            unstarredSection.classList.toggle('empty', visibleUnstarredCount === 0);
        }
    });
}

function renderRepos(repos) {
    const container = document.getElementById('repos-list');
    container.innerHTML = '';
    
    if (!Array.isArray(repos)) {
        container.innerHTML = `<div class="error-message">${t('loadFailed')}</div>`;
        return;
    }
    
    if (repos.length === 0) {
        container.innerHTML = `<div class="error-message">${t('noRepos')}</div>`;
        return;
    }
    
    // 将仓库分成两组：有star的和无star的
    const starredRepos = repos.filter(repo => repo.stargazers_count > 0)
        .sort((a, b) => b.stargazers_count - a.stargazers_count);
    const unstarredRepos = repos.filter(repo => repo.stargazers_count === 0);
    
    // 渲染有star的仓库
    starredRepos.forEach(repo => renderRepoItem(repo, container));
    
    // 如果有无star的仓库，创建一个折叠区域
    if (unstarredRepos.length > 0) {
        const unstarredSection = document.createElement('div');
        unstarredSection.className = 'unstarred-section';
        
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        
        const sectionTitle = document.createElement('div');
        sectionTitle.className = 'section-title';
        sectionTitle.innerHTML = `
            ${t('unstarredRepos')} (${unstarredRepos.length})
            <span class="expand-icon">▼</span>
        `;
        
        // 添加点击事件监听器
        sectionTitle.addEventListener('click', () => {
            unstarredSection.classList.toggle('expanded');
        });
        
        const sectionContent = document.createElement('div');
        sectionContent.className = 'section-content';
        
        unstarredRepos.forEach(repo => renderRepoItem(repo, sectionContent));
        
        sectionHeader.appendChild(sectionTitle);
        unstarredSection.appendChild(sectionHeader);
        unstarredSection.appendChild(sectionContent);
        container.appendChild(unstarredSection);
    }
    
    // 添加 Star 提示框
    const starPrompt = document.createElement('div');
    starPrompt.className = 'star-prompt';
    starPrompt.innerHTML = `${t('starPrompt')} <a href="https://github.com/shalom-lab/repo-list" target="_blank"><svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="star-icon"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg> Star</a>`;
    
    // 点击整个提示框也可以打开链接
    starPrompt.addEventListener('click', (e) => {
        if (!e.target.matches('a')) {
            chrome.tabs.create({ url: 'https://github.com/shalom-lab/repo-list' });
        }
    });
    
    container.appendChild(starPrompt);

    // 在渲染完成后设置搜索功能
    setupSearch();
}

function renderRepoItem(repo, container) {
    const repoElement = document.createElement('div');
    repoElement.className = 'repo-item';
    
    // 为有星标的仓库默认添加expanded类
    if (repo.stargazers_count > 0) {
        repoElement.classList.add('expanded');
    }
    
    // 添加星标数量作为数据属性
    repoElement.setAttribute('data-stars', repo.stargazers_count);
    
    const topicsHtml = repo.topics && repo.topics.length > 0
        ? `<div class="repo-topics">
            ${repo.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
           </div>`
        : '';
        
    const updatedAt = formatDate(repo.updated_at);
    const starCount = repo.stargazers_count;
    const langHtml = repo.language 
        ? `<span class="repo-language">
            <span class="language-color" style="background-color: ${getLanguageColor(repo.language)}"></span>
            ${getLanguageDisplayName(repo.language)}
           </span>` 
        : '';
    
    repoElement.innerHTML = `
        <div class="repo-header">
            <div class="repo-name">
                ${repo.name}
                <span class="expand-icon">▼</span>
            </div>
            <div class="repo-stats">
                ${langHtml}
                <span class="update-time">${updatedAt}</span>
                <span class="star-count">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="star-icon">
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                    </svg>
                    ${starCount}
                </span>
            </div>
        </div>
        <div class="repo-details">
            <div class="repo-description">${repo.description || t('noDescription')}</div>
            ${topicsHtml}
        </div>
    `;
    
    // 获取 header 元素并添加点击事件
    const header = repoElement.querySelector('.repo-header');
    header.addEventListener('click', (e) => {
        e.preventDefault();
        repoElement.classList.toggle('expanded');
    });
    
    // 添加仓库链接点击事件
    repoElement.addEventListener('click', (e) => {
        if (!e.target.closest('.repo-header')) {
            chrome.tabs.create({ url: repo.html_url });
        }
    });
    
    container.appendChild(repoElement);
}

async function init() {
    try {
        const tab = await getCurrentTab();
        if (!tab?.url?.includes('github.com')) {
            document.getElementById('repos-list').innerHTML = 
                `<div class="error-message">${t('notGitHub')}</div>`;
            return;
        }

        const username = getUsername(tab.url);
        if (!username) {
            document.getElementById('repos-list').innerHTML = 
                `<div class="error-message">${t('invalidPage')}</div>`;
            return;
        }
        
        const repos = await fetchUserRepos(username);
        renderRepos(repos);
        
        // 设置搜索框占位符
        document.getElementById('repo-search').placeholder = t('searchPlaceholder');
    } catch (error) {
        console.error('Init error:', error);
        document.getElementById('repos-list').innerHTML = 
            `<div class="error-message">${t('loadError')}</div>`;
    }
}

// 监听URL变化
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        init();
    }
});

init(); 