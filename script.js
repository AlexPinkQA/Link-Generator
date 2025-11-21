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

// Додаткові теги (відсортовано A-Z)
const additionalTags = [
    { tag: '&musicMuted=true', name: 'Disable Music' },
    { tag: '&ftueQuickPickShown=false', name: 'FTUE Demo mode' },
    { tag: '&ftueShown=false', name: 'FTUE QuickPick' },
    { tag: '&homeUrl=https://www.google.com', name: 'Home button' },
    { tag: '&mode=fun', name: 'Mode Fun' },
    { tag: '&showOddsUpfront=true', name: 'Odds Pop-up' }
];

// Клас для управління генератором URL
class URLGenerator {
    constructor() {
        this.urlInput = document.getElementById('url-input');
        this.checkboxesContainer = document.getElementById('checkboxes-container');
        this.additionalCheckboxesContainer = document.getElementById('additional-checkboxes-container');
        this.resultsContainer = document.getElementById('results');
        this.selectAllBtn = document.getElementById('select-all');
        this.deselectAllBtn = document.getElementById('deselect-all');
        this.selectAllAdditionalBtn = document.getElementById('select-all-additional');
        this.deselectAllAdditionalBtn = document.getElementById('deselect-all-additional');
        this.openUrlsBtn = document.getElementById('open-urls');
        this.generatedUrls = [];
        
        this.init();
    }

    init() {
        this.renderCheckboxes();
        this.renderAdditionalCheckboxes();
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

            // Клік по всьому блоку
            checkboxDiv.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    this.updateResults();
                }
            });

            checkbox.addEventListener('change', () => this.updateResults());

            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            this.checkboxesContainer.appendChild(checkboxDiv);
        });
    }

    renderAdditionalCheckboxes() {
        additionalTags.forEach((tag, index) => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `additional-${index}`;
            checkbox.value = tag.tag;

            const label = document.createElement('label');
            label.htmlFor = `additional-${index}`;
            label.textContent = tag.name;

            // Клік по всьому блоку
            checkboxDiv.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    this.updateResults();
                }
            });

            checkbox.addEventListener('change', () => this.updateResults());

            checkboxDiv.appendChild(checkbox);
            checkboxDiv.appendChild(label);
            this.additionalCheckboxesContainer.appendChild(checkboxDiv);
        });
    }

    attachEventListeners() {
        this.urlInput.addEventListener('input', () => this.updateResults());

        this.selectAllBtn.addEventListener('click', () => {
            this.setAllCheckboxes(true);
            this.updateResults();
        });

        this.deselectAllBtn.addEventListener('click', () => {
            this.setAllCheckboxes(false);
            this.updateResults();
        });

        this.selectAllAdditionalBtn.addEventListener('click', () => {
            this.setAllAdditionalCheckboxes(true);
            this.updateResults();
        });

        this.deselectAllAdditionalBtn.addEventListener('click', () => {
            this.setAllAdditionalCheckboxes(false);
            this.updateResults();
        });

        this.openUrlsBtn.addEventListener('click', () => {
            this.openAllUrls();
        });
    }

    setAllCheckboxes(checked) {
        const checkboxes = this.checkboxesContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = checked;
        });
    }

    setAllAdditionalCheckboxes(checked) {
        const checkboxes = this.additionalCheckboxesContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = checked;
        });
    }

    getSelectedTags() {
        const languageCheckboxes = this.checkboxesContainer.querySelectorAll('input[type="checkbox"]:checked');
        const additionalCheckboxes = this.additionalCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked');
        
        const selectedLanguageTags = Array.from(languageCheckboxes).map(cb => ({
            tag: cb.value,
            name: cb.dataset.name
        }));
        const selectedAdditionalTags = Array.from(additionalCheckboxes).map(cb => cb.value).join('');
        
        return { selectedLanguageTags, selectedAdditionalTags };
    }

    updateResults() {
        const baseURL = this.urlInput.value.trim();
        const { selectedLanguageTags, selectedAdditionalTags } = this.getSelectedTags();

        // Очистити результати
        this.resultsContainer.innerHTML = '';
        this.generatedUrls = [];

        if (!baseURL || selectedLanguageTags.length === 0) {
            const noResults = document.createElement('p');
            noResults.className = 'no-results';
            noResults.textContent = baseURL 
                ? 'Оберіть мови для генерації URL' 
                : 'Введіть URL та оберіть мови';
            this.resultsContainer.appendChild(noResults);
            this.openUrlsBtn.disabled = true;
            return;
        }

        // Генерувати URL для кожної мови з усіма додатковими параметрами
        selectedLanguageTags.forEach(langObj => {
            const fullUrl = baseURL + langObj.tag + selectedAdditionalTags;
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

        // Відкриваємо всі URL одночасно (без setTimeout)
        // Це дозволяє браузеру обробити всі вкладки в одному обробнику події
        this.generatedUrls.forEach(url => {
            window.open(url, '_blank');
        });
    }
}

// Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    new URLGenerator();
    console.log('URL Generator успішно завантажено!');
});