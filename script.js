// Список мов з тегами
const languageTags = [
    { tag: '&lang=en', name: 'EN' },
    { tag: '&lang=bg', name: 'BG' },
    { tag: '&lang=hr', name: 'HR' },
    { tag: '&lang=cs', name: 'CS' },
    { tag: '&lang=da', name: 'DA' },
    { tag: '&lang=nl', name: 'NL' },
    { tag: '&lang=et', name: 'ET' },
    { tag: '&lang=fi', name: 'FI' },
    { tag: '&lang=fr', name: 'FR' },
    { tag: '&lang=de', name: 'DE' },
    { tag: '&lang=el', name: 'EL' },
    { tag: '&lang=hu', name: 'HU' },
    { tag: '&lang=id', name: 'ID' },
    { tag: '&lang=it', name: 'IT' },
    { tag: '&lang=ja', name: 'JA' },
    { tag: '&lang=ko', name: 'KO' },
    { tag: '&lang=no', name: 'NO' },
    { tag: '&lang=pl', name: 'PL' },
    { tag: '&lang=pt-br', name: 'PT-BR' },
    { tag: '&lang=re-en', name: 'RE-EN' },
    { tag: '&lang=ro', name: 'RO' },
    { tag: '&lang=ru', name: 'RU' },
    { tag: '&lang=zh', name: 'ZH' },
    { tag: '&lang=sk', name: 'SK' },
    { tag: '&lang=es', name: 'ES' },
    { tag: '&lang=sv', name: 'SW' },
    { tag: '&lang=th', name: 'TH' },
    { tag: '&lang=tr', name: 'TR' },
    { tag: '&lang=vi', name: 'VI' }
];

// Додаткові теги
const additionalTags = [
    { tag: '&ftueShown=false', name: 'FTUE QuickPick' },
    { tag: '&ftueQuickPickShown=false', name: 'FTUE Demo mode' },
    { tag: '&mode=fun', name: 'Mode Fun' },
    { tag: '&showOddsUpfront=true', name: 'Odds Pop-up' },
    { tag: '&musicMuted=true', name: 'Disable Music' }
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
            checkbox.addEventListener('change', () => this.updateResults());

            const label = document.createElement('label');
            label.htmlFor = `lang-${index}`;
            label.textContent = lang.name;

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
            checkbox.addEventListener('change', () => this.updateResults());

            const label = document.createElement('label');
            label.htmlFor = `additional-${index}`;
            label.textContent = tag.name;

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
        
        const languageTags = Array.from(languageCheckboxes).map(cb => cb.value);
        const additionalTags = Array.from(additionalCheckboxes).map(cb => cb.value);
        
        return [...languageTags, ...additionalTags];
    }

    updateResults() {
        const baseURL = this.urlInput.value.trim();
        const selectedTags = this.getSelectedTags();

        // Очистити результати
        this.resultsContainer.innerHTML = '';
        this.generatedUrls = [];

        if (!baseURL || selectedTags.length === 0) {
            const noResults = document.createElement('p');
            noResults.className = 'no-results';
            noResults.textContent = baseURL 
                ? 'Оберіть чекбокси для генерації URL' 
                : 'Введіть URL та оберіть чекбокси';
            this.resultsContainer.appendChild(noResults);
            this.openUrlsBtn.disabled = true;
            return;
        }

        // Генерувати URL для кожного вибраного тегу
        selectedTags.forEach(tag => {
            const fullUrl = baseURL + tag;
            this.generatedUrls.push(fullUrl);
            
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.textContent = fullUrl;
            this.resultsContainer.appendChild(resultItem);
        });

        this.openUrlsBtn.disabled = false;
    }

    openAllUrls() {
        if (this.generatedUrls.length === 0) return;

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