// Інтерфейс для тегу мови
interface LanguageTag {
    tag: string;
    name: string;
}

// Список мов з тегами
const languageTags: LanguageTag[] = [
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
    { tag: '&lang=sv', name: 'SV' },
    { tag: '&lang=th', name: 'TH' },
    { tag: '&lang=tr', name: 'TR' },
    { tag: '&lang=vi', name: 'VI' }
];

// Клас для управління генератором URL
class URLGenerator {
    private urlInput: HTMLInputElement;
    private checkboxesContainer: HTMLElement;
    private resultsContainer: HTMLElement;
    private selectAllBtn: HTMLButtonElement;
    private deselectAllBtn: HTMLButtonElement;

    constructor() {
        this.urlInput = document.getElementById('url-input') as HTMLInputElement;
        this.checkboxesContainer = document.getElementById('checkboxes-container') as HTMLElement;
        this.resultsContainer = document.getElementById('results') as HTMLElement;
        this.selectAllBtn = document.getElementById('select-all') as HTMLButtonElement;
        this.deselectAllBtn = document.getElementById('deselect-all') as HTMLButtonElement;

        this.init();
    }

    private init(): void {
        this.renderCheckboxes();
        this.attachEventListeners();
    }

    private renderCheckboxes(): void {
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

    private attachEventListeners(): void {
        this.urlInput.addEventListener('input', () => this.updateResults());

        this.selectAllBtn.addEventListener('click', () => {
            this.setAllCheckboxes(true);
            this.updateResults();
        });

        this.deselectAllBtn.addEventListener('click', () => {
            this.setAllCheckboxes(false);
            this.updateResults();
        });
    }

    private setAllCheckboxes(checked: boolean): void {
        const checkboxes = this.checkboxesContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            (checkbox as HTMLInputElement).checked = checked;
        });
    }

    private getSelectedTags(): string[] {
        const checkboxes = this.checkboxesContainer.querySelectorAll('input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => (cb as HTMLInputElement).value);
    }

    private updateResults(): void {
        const baseURL = this.urlInput.value.trim();
        const selectedTags = this.getSelectedTags();

        // Очистити результати
        this.resultsContainer.innerHTML = '';

        if (!baseURL || selectedTags.length === 0) {
            const noResults = document.createElement('p');
            noResults.className = 'no-results';
            noResults.textContent = baseURL 
                ? 'Оберіть чекбокси для генерації URL' 
                : 'Введіть URL та оберіть чекбокси';
            this.resultsContainer.appendChild(noResults);
            return;
        }

        // Генерувати URL для кожного вибраного тегу
        selectedTags.forEach(tag => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.textContent = baseURL + tag;
            this.resultsContainer.appendChild(resultItem);
        });
    }
}

// Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    new URLGenerator();
    console.log('URL Generator успішно завантажено!');
});