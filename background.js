// 当扩展安装或更新时启用侧边栏
chrome.runtime.onInstalled.addListener(() => {
    // 设置点击扩展图标时打开侧边栏
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// 当标签页更新时检查是否为GitHub页面
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (tab.url && tab.url.includes("github.com")) {
        await chrome.sidePanel.setOptions({
            tabId,
            path: 'sidepanel.html',
            enabled: true
        });
    } else {
        await chrome.sidePanel.setOptions({
            tabId,
            enabled: false
        });
    }
}); 