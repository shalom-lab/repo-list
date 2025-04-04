// 当扩展安装或更新时初始化设置
chrome.runtime.onInstalled.addListener(() => {
    // 设置点击扩展图标时打开侧边栏
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;

    const isGitHubPage = tab.url.startsWith('https://github.com/');

    await chrome.sidePanel.setOptions({
        tabId,
        path: 'sidepanel.html',
        enabled: isGitHubPage
    });
}); 