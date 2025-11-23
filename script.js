// Список мов з тегами (EN на першому місці, решта A-Z)
const languageTags = [
    { tag: '&lang=en', name: 'EN' },
    { tag: '&lang=bg', name: 'BG' },
    { tag: '&lang=cs', name: 'CS' },
    { tag: '&lang=da', name: 'DA' },
    { tag: '&lang=de', name: 'DE' },
    { tag: '&lang=el', name: 'EL' },
    { tag: '&lang=es', name: 'ES' },
    { tag: '&lang=et', name: 'ET' },
    { tag: '&lang=fi', name: 'FI' },
    { tag: '&lang=fr', name: 'FR' },
    { tag: '&lang=hr', name: 'HR' },
    { tag: '&lang=hu', name: 'HU' },
    { tag: '&lang=id', name: 'ID' },
    { tag: '&lang=it', name: 'IT' },
    { tag: '&lang=ja', name: 'JA' },
    { tag: '&lang=ko', name: 'KO' },
    { tag: '&lang=nl', name: 'NL' },
    { tag: '&lang=no', name: 'NO' },
    { tag: '&lang=pl', name: 'PL' },
    { tag: '&lang=pt-br', name: 'PT-BR' },
    { tag: '&lang=re-en', name: 'RE-EN' },
    { tag: '&lang=ro', name: 'RO' },
    { tag: '&lang=ru', name: 'RU' },
    { tag: '&lang=sk', name: 'SK' },
    { tag: '&lang=sv', name: 'SW' },
    { tag: '&lang=th', name: 'TH' },
    { tag: '&lang=tr', name: 'TR' },
    { tag: '&lang=vi', name: 'VI' },
    { tag: '&lang=zh', name: 'ZH' }
];

// Preset теги (відсортовано A-Z)
const presetTags = [
    { tag: '&debugger=true', name: 'Debugger' },
    { tag: '&musicMuted=true', name: 'Disable Music' },
    { tag: '&ftueQuickPickShown=false', name: 'FTUE Demo mode' },
    { tag: '&ftueShown=false', name: 'FTUE QuickPick' },
    { tag: '&homeUrl=https://www.google.com', name: 'Home button' },
    { tag: '&mode=fun', name: 'Mode Fun' },
    { tag: '&showOddsUpfront=true', name: 'Odds Pop-up' }
];

// Tutorial steps
const tutorialSteps = [
    {
        title: 'Step 1: Enter Your URL',
        text: 'To create URLs, paste your offline URL or White Label URL here.',
        targetId: 'url-input'
    },
    {
        title: 'Step 2: Select Languages',
        text: 'Choose the languages you need (or select all if required).',
        targetId: 'step-2'
    }
];

// Клас для управління генератором URL
class URLGenerator {
    constructor() {
        this.urlInput = document.getElementById('url-input');
        this.checkboxesContainer = document.getElementById('checkboxes-container');
        this.presetTagsContainer = document.getElementById('preset-tags-container');
        this.customTagsInput = document.getElementById('custom-tags');
        this.operatorInput = document.getElementById('operator-input');
        this.resultsContainer = document.getElementById('results');
        this.selectAllBtn = document.getElementById('select-all');
        this.deselectAllBtn = document.getElementById('deselect-all');
        this.selectAllPresetBtn = document.getElementById('select-all-preset');
        this.deselectAllPresetBtn = document.getElementById('deselect-all-preset');
        this.openUrlsBtn = document.getElementById('open-urls');
        this.shareStateBtn = document.getElementById('share-state');
        this.generatedUrls = [];
        
        this.init();
    }

    init() {
        this.renderCheckboxes();
        this.renderPresetTags();
        this.attachEventListeners();
        this.loadStateFromURL();
    }

    renderCheckboxes() {
        languageTags.forEach((lang, index) => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `lang-${index}`;
            checkbox.value = lang.tag;
            checkbox.dataset.name = lang.name;

            const label = document.createElement('label');
            label.htmlFor = `lang-${index}`;
            label.textContent = lang.name;

            checkboxDiv.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                this.updateResults();
            });

            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            this.checkboxesContainer.appendChild(checkboxDiv);
        });
    }

    renderPresetTags() {
        presetTags.forEach((tag, index) => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `preset-${index}`;
            checkbox.value = tag.tag;

            const label = document.createElement('label');
            label.htmlFor = `preset-${index}`;
            label.textContent = tag.name;

            checkboxDiv.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                this.updateResults();
            });

            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            this.presetTagsContainer.appendChild(checkboxDiv);
        });
    }

    attachEventListeners() {
        this.urlInput.addEventListener('input', () => this.updateResults());
        this.customTagsInput.addEventListener('input', () => this.updateResults());
        this.operatorInput.addEventListener('input', () => this.updateResults());

        this.selectAllBtn.addEventListener('click', () => {
            this.setAllCheckboxes(this.checkboxesContainer, true);
            this.updateResults();
        });

        this.deselectAllBtn.addEventListener('click', () => {
            this.setAllCheckboxes(this.checkboxesContainer, false);
            this.updateResults();
        });

        this.selectAllPresetBtn.addEventListener('click', () => {
            this.setAllCheckboxes(this.presetTagsContainer, true);
            this.updateResults();
        });

        this.deselectAllPresetBtn.addEventListener('click', () => {
            this.setAllCheckboxes(this.presetTagsContainer, false);
            this.updateResults();
        });

        this.openUrlsBtn.addEventListener('click', () => {
            this.openAllUrls();
        });

        this.shareStateBtn.addEventListener('click', () => {
            this.shareState();
        });
    }

    setAllCheckboxes(container, checked) {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = checked;
        });
    }

    getSelectedTags() {
        const languageCheckboxes = this.checkboxesContainer.querySelectorAll('input[type="checkbox"]:checked');
        const presetCheckboxes = this.presetTagsContainer.querySelectorAll('input[type="checkbox"]:checked');
        
        const selectedLanguageTags = Array.from(languageCheckboxes).map(cb => ({
            tag: cb.value,
            name: cb.dataset.name
        }));
        
        let additionalTags = Array.from(presetCheckboxes).map(cb => cb.value).join('');
        
        // Додати custom tags (підтримка коми та нових рядків)
        const customTags = this.customTagsInput.value.trim();
        if (customTags) {
            const tags = customTags
                .split(/[,\n]/)
                .map(t => t.trim())
                .filter(t => t);
            additionalTags += tags.join('');
        }
        
        return { selectedLanguageTags, additionalTags };
    }

    updateResults() {
        const baseURL = this.urlInput.value.trim();
        const { selectedLanguageTags, additionalTags } = this.getSelectedTags();
        const operatorValue = this.operatorInput.value.trim();

        this.resultsContainer.innerHTML = '';
        this.generatedUrls = [];

        if (!baseURL) {
            const noResults = document.createElement('p');
            noResults.className = 'no-results';
            noResults.textContent = 'Enter URL to generate URLs';
            this.resultsContainer.appendChild(noResults);
            this.openUrlsBtn.disabled = true;
            return;
        }

        // Якщо вибрані мови - створюємо URL для кожної мови
        if (selectedLanguageTags.length > 0) {
            selectedLanguageTags.forEach(langObj => {
                let fullUrl = baseURL + langObj.tag + additionalTags;
                
                if (operatorValue && fullUrl.includes('&operator=')) {
                    fullUrl = fullUrl.replace(/&operator=[^&]*/g, operatorValue);
                }
                
                this.generatedUrls.push(fullUrl);
                
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                
                const langLabel = document.createElement('span');
                langLabel.className = 'lang-label';
                langLabel.textContent = langObj.name;
                
                const urlLink = document.createElement('a');
                urlLink.href = fullUrl;
                urlLink.target = '_blank';
                urlLink.className = 'url-link';
                urlLink.textContent = fullUrl;
                urlLink.title = fullUrl;
                
                resultItem.appendChild(langLabel);
                resultItem.appendChild(urlLink);
                this.resultsContainer.appendChild(resultItem);
            });
        } 
        // Якщо мови не вибрані, але є додаткові параметри - створюємо один URL
        else if (additionalTags || operatorValue) {
            let fullUrl = baseURL + additionalTags;
            
            if (operatorValue && fullUrl.includes('&operator=')) {
                fullUrl = fullUrl.replace(/&operator=[^&]*/g, operatorValue);
            }
            
            this.generatedUrls.push(fullUrl);
            
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            const langLabel = document.createElement('span');
            langLabel.className = 'lang-label';
            langLabel.textContent = 'URL';
            
            const urlLink = document.createElement('a');
            urlLink.href = fullUrl;
            urlLink.target = '_blank';
            urlLink.className = 'url-link';
            urlLink.textContent = fullUrl;
            urlLink.title = fullUrl;
            
            resultItem.appendChild(langLabel);
            resultItem.appendChild(urlLink);
            this.resultsContainer.appendChild(resultItem);
        } else {
            const noResults = document.createElement('p');
            noResults.className = 'no-results';
            noResults.textContent = 'Choose languages or add parameters to generate URLs';
            this.resultsContainer.appendChild(noResults);
            this.openUrlsBtn.disabled = true;
            return;
        }

        this.openUrlsBtn.disabled = false;
    }

    openAllUrls() {
        if (this.generatedUrls.length === 0) return;

        this.generatedUrls.forEach((url, index) => {
            setTimeout(() => {
                window.open(url, '_blank');
            }, index * 100);
        });
    }

    copyState() {
        const state = {
            url: this.urlInput.value,
            languages: Array.from(this.checkboxesContainer.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.id),
            presetTags: Array.from(this.presetTagsContainer.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.id),
            customTags: this.customTagsInput.value,
            operator: this.operatorInput.value
        };
        
        const stateJson = JSON.stringify(state, null, 2);
        
        navigator.clipboard.writeText(stateJson).then(() => {
            const originalText = this.copyStateBtn.textContent;
            this.copyStateBtn.textContent = '✓ Copied!';
            setTimeout(() => {
                this.copyStateBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy state');
        });
    }

    shareState() {
        const params = new URLSearchParams();
        
        if (this.urlInput.value) {
            params.set('url', this.urlInput.value);
        }
        
        const selectedLanguages = Array.from(this.checkboxesContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.id.replace('lang-', ''));
        if (selectedLanguages.length > 0) {
            params.set('langs', selectedLanguages.join(','));
        }
        
        const selectedPresets = Array.from(this.presetTagsContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.id.replace('preset-', ''));
        if (selectedPresets.length > 0) {
            params.set('presets', selectedPresets.join(','));
        }
        
        if (this.customTagsInput.value) {
            params.set('custom', encodeURIComponent(this.customTagsInput.value));
        }
        
        if (this.operatorInput.value) {
            params.set('operator', encodeURIComponent(this.operatorInput.value));
        }
        
        const shareUrl = window.location.origin + window.location.pathname + '?' + params.toString();
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            const originalText = this.shareStateBtn.textContent;
            this.shareStateBtn.textContent = '✓ Copied!';
            setTimeout(() => {
                this.shareStateBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy URL');
        });
    }

    loadStateFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('url')) {
            this.urlInput.value = params.get('url');
        }
        
        if (params.has('langs')) {
            const langIndices = params.get('langs').split(',');
            langIndices.forEach(index => {
                const checkbox = document.getElementById(`lang-${index}`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        if (params.has('presets')) {
            const presetIndices = params.get('presets').split(',');
            presetIndices.forEach(index => {
                const checkbox = document.getElementById(`preset-${index}`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        if (params.has('custom')) {
            this.customTagsInput.value = decodeURIComponent(params.get('custom'));
        }
        
        if (params.has('operator')) {
            this.operatorInput.value = decodeURIComponent(params.get('operator'));
        }
        
        this.updateResults();
    }
}

// Клас для управління темою
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }
}

// Клас для управління туторіалом (FTUE)
class TutorialManager {
    constructor() {
        this.overlay = document.getElementById('tutorial-overlay');
        this.popup = document.getElementById('tutorial-popup');
        this.title = document.getElementById('tutorial-title');
        this.text = document.getElementById('tutorial-text');
        this.nextBtn = document.getElementById('tutorial-next');
        this.skipBtn = document.getElementById('tutorial-skip');
        this.showTutorialBtn = document.getElementById('show-tutorial');
        this.currentStep = 0;
        this.hasSeenTutorial = localStorage.getItem('hasSeenTutorial') === 'true';
        
        this.init();
    }

    init() {
        this.nextBtn.addEventListener('click', () => this.nextStep());
        this.skipBtn.addEventListener('click', () => this.skipTutorial());
        this.showTutorialBtn.addEventListener('click', () => this.startTutorial());

        if (!this.hasSeenTutorial) {
            setTimeout(() => this.startTutorial(), 500);
        }
    }

    startTutorial() {
        this.currentStep = 0;
        this.showStep();
    }

    showStep() {
        if (this.currentStep >= tutorialSteps.length) {
            this.endTutorial();
            return;
        }

        const step = tutorialSteps[this.currentStep];
        this.title.textContent = step.title;
        this.text.textContent = step.text;

        // Показати overlay та popup
        this.overlay.classList.add('active');
        this.popup.classList.add('active');

        // Видалити попереднє виділення
        document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));

        // Виділити потрібний елемент
        const targetElement = document.getElementById(step.targetId);
        if (targetElement) {
            targetElement.classList.add('highlight');
            
            // Прокрутити до елемента
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Позиціювати popup після невеликої затримки (щоб прокрутка встигла відбутись)
            setTimeout(() => {
                const rect = targetElement.getBoundingClientRect();
                const popupHeight = this.popup.offsetHeight || 200;
                
                if (this.currentStep === 0) {
                    // Крок 1: popup під полем URL
                    this.popup.style.top = `${rect.bottom + 10}px`;
                    this.popup.style.left = `${Math.max(20, rect.left)}px`;
                } else if (this.currentStep === 1) {
                    // Крок 2: popup НАД секцією Languages
                    this.popup.style.top = `${rect.top - popupHeight - 10}px`;
                    this.popup.style.left = `${Math.max(20, rect.left)}px`;
                }
            }, 100);
        }

        // Підсвітити сам popup
        this.popup.classList.add('highlight');

        // Показати/сховати кнопки
        if (this.currentStep === tutorialSteps.length - 1) {
            this.nextBtn.textContent = 'Done';
            this.skipBtn.style.display = 'none';
        } else {
            this.nextBtn.textContent = 'Next';
            this.skipBtn.style.display = 'block';
        }
    }

    nextStep() {
        this.currentStep++;
        this.showStep();
    }

    skipTutorial() {
        localStorage.setItem('hasSeenTutorial', 'true');
        this.hasSeenTutorial = true;
        this.endTutorial();
    }

    endTutorial() {
        localStorage.setItem('hasSeenTutorial', 'true');
        this.overlay.classList.remove('active');
        this.popup.classList.remove('active');
        document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
    }
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    new URLGenerator();
    new ThemeManager();
    new TutorialManager();
    new NavigationManager();
    console.log('URL Generator успішно завантажено!');
});

// Клас для управління навігацією
class NavigationManager {
    constructor() {
        this.hamburgerBtn = document.getElementById('hamburger-btn');
        this.sideMenu = document.getElementById('side-menu');
        this.menuOverlay = document.getElementById('menu-overlay');
        this.closeMenuBtn = document.getElementById('close-menu');
        this.menuLinks = document.querySelectorAll('.menu-link');
        this.pages = document.querySelectorAll('.page');
        
        this.init();
    }

    init() {
        this.hamburgerBtn.addEventListener('click', () => this.openMenu());
        this.closeMenuBtn.addEventListener('click', () => this.closeMenu());
        this.menuOverlay.addEventListener('click', () => this.closeMenu());
        
        this.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.switchPage(page);
                this.updateURL(page);
                this.closeMenu();
                window.scrollTo(0, 0);
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = this.getPageFromPath();
            this.switchPage(page, false);
            window.scrollTo(0, 0);
        });

        // Load page on initial load
        const initialPage = this.getPageFromPath();
        this.switchPage(initialPage, false);
        window.scrollTo(0, 0);
    }

    getPageFromPath() {
        const path = window.location.pathname;
        if (path.includes('/operators')) {
            return 'operators';
        }
        return 'home';
    }

    updateURL(page) {
        const newPath = page === 'home' ? '/' : `/${page}`;
        const fullPath = window.location.pathname.includes('Link-Generator') 
            ? `/Link-Generator${page === 'home' ? '' : `/${page}`}`
            : newPath;
        window.history.pushState({ page }, '', fullPath);
    }

    openMenu() {
        this.sideMenu.classList.add('active');
        this.menuOverlay.classList.add('active');
    }

    closeMenu() {
        this.sideMenu.classList.remove('active');
        this.menuOverlay.classList.remove('active');
    }

    switchPage(pageName, updateHistory = true) {
        // Сховати всі сторінки
        this.pages.forEach(page => page.classList.remove('active'));
        
        // Показати вибрану сторінку
        const targetPage = document.getElementById(`page-${pageName}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // Оновити активне посилання в меню
        this.menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });

        if (updateHistory) {
            this.updateURL(pageName);
        }
    }
}