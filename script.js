// Список мов з тегами (відсортовано A-Z)
const languageTags = [
    { tag: '&lang=bg', name: 'BG' },
    { tag: '&lang=cs', name: 'CS' },
    { tag: '&lang=da', name: 'DA' },
    { tag: '&lang=de', name: 'DE' },
    { tag: '&lang=el', name: 'EL' },
    { tag: '&lang=en', name: 'EN' },
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
        targetId: 'step-1'
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
        this.generatedUrls = [];
        
        this.init();
    }

    init() {
        this.renderCheckboxes();
        this.renderPresetTags();
        this.attachEventListeners();
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

            checkboxDiv.addEventListener('click', (e) => {
                checkbox.checked = !checkbox.checked;
                this.updateResults();
            });

            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            checkbox.addEventListener('change', () => this.updateResults());

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

            checkboxDiv.addEventListener('click', (e) => {
                checkbox.checked = !checkbox.checked;
                this.updateResults();
            });

            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            checkbox.addEventListener('change', () => this.updateResults());

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
        
        // Додати custom tags
        const customTags = this.customTagsInput.value.trim();
        if (customTags) {
            const tags = customTags.split(',').map(t => t.trim()).filter(t => t);
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

        if (!baseURL || selectedLanguageTags.length === 0) {
            const noResults = document.createElement('p');
            noResults.className = 'no-results';
            noResults.textContent = baseURL 
                ? 'Choose languages to generate URLs' 
                : 'Enter URL and choose languages';
            this.resultsContainer.appendChild(noResults);
            this.openUrlsBtn.disabled = true;
            return;
        }

        selectedLanguageTags.forEach(langObj => {
            let fullUrl = baseURL + langObj.tag + additionalTags;
            
            // Замінити operator якщо вказано
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
            
            // Позиціювати popup
            const rect = targetElement.getBoundingClientRect();
            this.popup.style.top = `${rect.bottom + 20}px`;
            this.popup.style.left = `${Math.max(20, rect.left)}px`;
        }

        // Змінити текст кнопки Next на Done для останнього кроку
        if (this.currentStep === tutorialSteps.length - 1) {
            this.nextBtn.textContent = 'Done';
        } else {
            this.nextBtn.textContent = 'Next';
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
    console.log('URL Generator успішно завантажено!');
});