const i18n = {
    zh: {
        searchPlaceholder: "搜索仓库...",
        noDescription: "暂无描述",
        unstarredRepos: "未获得 Star 的仓库",
        loadError: "加载失败，请稍后重试",
        noRepos: "未找到仓库或用户不存在",
        invalidPage: "请访问 GitHub 用户页面或仓库页面",
        notGitHub: "请访问 GitHub 页面使用此扩展",
        loadFailed: "无法加载仓库信息"
    },
    en: {
        searchPlaceholder: "Search repositories...",
        noDescription: "No description",
        unstarredRepos: "Repositories without stars",
        loadError: "Loading failed, please try again later",
        noRepos: "No repositories found or user does not exist",
        invalidPage: "Please visit a GitHub user or repository page",
        notGitHub: "Please visit GitHub to use this extension",
        loadFailed: "Failed to load repositories"
    },
    ja: {
        searchPlaceholder: "リポジトリを検索...",
        noDescription: "説明なし",
        unstarredRepos: "スターのないリポジトリ",
        loadError: "読み込みに失敗しました。後でもう一度お試しください",
        noRepos: "リポジトリが見つからないか、ユーザーが存在しません",
        invalidPage: "GitHubのユーザーページまたはリポジトリページにアクセスしてください",
        notGitHub: "この拡張機能を使用するにはGitHubにアクセスしてください",
        loadFailed: "リポジトリの読み込みに失敗しました"
    },
    ko: {
        searchPlaceholder: "저장소 검색...",
        noDescription: "설명 없음",
        unstarredRepos: "스타가 없는 저장소",
        loadError: "로딩 실패, 나중에 다시 시도해주세요",
        noRepos: "저장소를 찾을 수 없거나 사용자가 존재하지 않습니다",
        invalidPage: "GitHub 사용자 또는 저장소 페이지를 방문해주세요",
        notGitHub: "이 확장 프로그램을 사용하려면 GitHub을 방문하세요",
        loadFailed: "저장소를 불러올 수 없습니다"
    },
    fr: {
        searchPlaceholder: "Rechercher des dépôts...",
        noDescription: "Pas de description",
        unstarredRepos: "Dépôts sans étoiles",
        loadError: "Échec du chargement, veuillez réessayer plus tard",
        noRepos: "Aucun dépôt trouvé ou l'utilisateur n'existe pas",
        invalidPage: "Veuillez visiter une page utilisateur ou dépôt GitHub",
        notGitHub: "Veuillez visiter GitHub pour utiliser cette extension",
        loadFailed: "Impossible de charger les dépôts"
    },
    de: {
        searchPlaceholder: "Repositories durchsuchen...",
        noDescription: "Keine Beschreibung",
        unstarredRepos: "Repositories ohne Sterne",
        loadError: "Laden fehlgeschlagen, bitte später erneut versuchen",
        noRepos: "Keine Repositories gefunden oder Benutzer existiert nicht",
        invalidPage: "Bitte besuchen Sie eine GitHub-Benutzer- oder Repository-Seite",
        notGitHub: "Bitte besuchen Sie GitHub, um diese Erweiterung zu nutzen",
        loadFailed: "Repositories konnten nicht geladen werden"
    },
    es: {
        searchPlaceholder: "Buscar repositorios...",
        noDescription: "Sin descripción",
        unstarredRepos: "Repositorios sin estrellas",
        loadError: "Error de carga, por favor intente más tarde",
        noRepos: "No se encontraron repositorios o el usuario no existe",
        invalidPage: "Por favor visite una página de usuario o repositorio de GitHub",
        notGitHub: "Por favor visite GitHub para usar esta extensión",
        loadFailed: "No se pudieron cargar los repositorios"
    },
    pt: {
        searchPlaceholder: "Pesquisar repositórios...",
        noDescription: "Sem descrição",
        unstarredRepos: "Repositórios sem estrelas",
        loadError: "Falha no carregamento, tente novamente mais tarde",
        noRepos: "Nenhum repositório encontrado ou usuário não existe",
        invalidPage: "Por favor, visite uma página de usuário ou repositório do GitHub",
        notGitHub: "Por favor, visite o GitHub para usar esta extensão",
        loadFailed: "Não foi possível carregar os repositórios"
    },
    ru: {
        searchPlaceholder: "Поиск репозиториев...",
        noDescription: "Нет описания",
        unstarredRepos: "Репозитории без звёзд",
        loadError: "Ошибка загрузки, попробуйте позже",
        noRepos: "Репозитории не найдены или пользователь не существует",
        invalidPage: "Пожалуйста, посетите страницу пользователя или репозитория GitHub",
        notGitHub: "Пожалуйста, посетите GitHub для использования этого расширения",
        loadFailed: "Не удалось загрузить репозитории"
    },
    it: {
        searchPlaceholder: "Cerca repository...",
        noDescription: "Nessuna descrizione",
        unstarredRepos: "Repository senza stelle",
        loadError: "Caricamento fallito, riprova più tardi",
        noRepos: "Nessun repository trovato o utente non esistente",
        invalidPage: "Visita una pagina utente o repository di GitHub",
        notGitHub: "Visita GitHub per utilizzare questa estensione",
        loadFailed: "Impossibile caricare i repository"
    },
    nl: {
        searchPlaceholder: "Zoek repositories...",
        noDescription: "Geen beschrijving",
        unstarredRepos: "Repositories zonder sterren",
        loadError: "Laden mislukt, probeer het later opnieuw",
        noRepos: "Geen repositories gevonden of gebruiker bestaat niet",
        invalidPage: "Bezoek een GitHub gebruikers- of repository-pagina",
        notGitHub: "Bezoek GitHub om deze extensie te gebruiken",
        loadFailed: "Kon repositories niet laden"
    },
    pl: {
        searchPlaceholder: "Szukaj repozytoriów...",
        noDescription: "Brak opisu",
        unstarredRepos: "Repozytoria bez gwiazdek",
        loadError: "Błąd ładowania, spróbuj ponownie później",
        noRepos: "Nie znaleziono repozytoriów lub użytkownik nie istnieje",
        invalidPage: "Odwiedź stronę użytkownika lub repozytorium GitHub",
        notGitHub: "Odwiedź GitHub, aby użyć tego rozszerzenia",
        loadFailed: "Nie można załadować repozytoriów"
    }
};

// 获取浏览器语言设置的前两个字符（语言代码）
const browserLang = navigator.language.split('-')[0];

// 检查是否支持当前语言，如果不支持则使用英语
const currentLang = Object.keys(i18n).includes(browserLang) ? browserLang : 'en';

function t(key) {
    return i18n[currentLang][key] || i18n.en[key];
}

export { t, currentLang }; 