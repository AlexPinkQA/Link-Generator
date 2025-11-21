// List of languages with tags (sorted A-Z)
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

// Additional tags (sorted A-Z)
const additionalTags = [
    { tag: '&musicMuted=true', name: 'Disable Music' },
    { tag: '&ftueQuickPickShown=false', name: 'FTUE Demo mode' },
    { tag: '&ftueShown=false', name: 'FTUE QuickPick' },
    { tag: '&homeUrl=https://www.google.com', name: 'Home button' },
    { tag: '&mode=fun', name: 'Mode Fun' },
    { tag: '&showOddsUpfront=true', name: 'Odds Pop-up' }
];

// URL Generator Class
class URLGenerator {
    constructor() {
        this.urlInput = document.getElementById('url-input');
        this.checkboxesContainer = document.getElementById('checkboxes-container');
        this.additionalCheckboxesContainer = document.getElementById('additional-checkboxes-container');
        this.customTagsInput = document.getElementById('custom-tags');
        this.operatorInput = document.getElementById('operator-input');
        this.resultsContainer = document.getElementById('results');
        this.selectAllBtn = document.getElementById('select-all');
        this.deselectAllBtn = document.getElementById('deselect-all');
        this.selectAllAdditionalBtn = document.getElementById('select-all-additional');
        this.deselectAllAdditionalBtn = document.getElementById('deselect-all-additional');
        this.openUrlsBtn = document.getElementById('open-urls');
        this.copyShareLinkBtn = document.getElementById('copy-share-link');
        this.generatedUrls = [];
        
        this.init();
    }

    init() {
        this.renderCheckboxes();
        this.renderAdditionalCheckboxes();
        this.attachEventListeners();
        this.loadFromURL();
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
        this.customTagsInput.addEventListener('input', () => this.updateResults());
        this.operatorInput.addEventListener('input', () => this.updateResults());

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

        this.copyShareLinkBtn.addEventListener('click', () => {
            this.copyShareLink();
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

    parseCustomTags() {
        const customTagsText = this.customTagsInput.value.trim();
        if (!customTagsText) return '';

        // Split by comma or newline
        const tags = customTagsText.split(/[\n,]+/).map(tag => tag.trim()).filter(tag => tag);
        
        // Ensure each tag starts with &
        return tags.map(tag => {
            if (!tag.startsWith('&')) {
                return '&' + tag;
            }
            return tag;
        }).join('');
    }

    replaceOperator(url) {
        const operatorValue = this.operatorInput.value.trim();
        if (!operatorValue) return url;

        // Clean operator value (remove & or operator= if present)
        let cleanOperator = operatorValue
            .replace(/^&/, '')
            .replace(/^operator=/, '');

        // Replace &operator=... with new value
        return url.replace(/&operator=[^&]*/, `&operator=${cleanOperator}`);
    }

    updateResults() {
        const baseURL = this.urlInput.value.trim();
        const { selectedLanguageTags, selectedAdditionalTags } = this.getSelectedTags();
        const customTags = this.parseCustomTags();

        this.resultsContainer.innerHTML = '';
        this.generatedUrls = [];

        if (!baseURL || selectedLanguageTags.length === 0) {
            const noResults = document.createElement('p');
            noResults.className = 'no-results';
            noResults.textContent = baseURL 
                ? 'Select languages to generate URLs' 
                : 'Enter URL and select languages';
            this.resultsContainer.appendChild(noResults);
            this.openUrlsBtn.disabled = true;
            return;
        }

        // Generate URL for each language with all parameters
        selectedLanguageTags.forEach(langObj => {
            let fullUrl = baseURL + langObj.tag + selectedAdditionalTags + customTags;
            
            // Replace operator if present
            fullUrl = this.replaceOperator(fullUrl);
            
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

        this.generatedUrls.forEach(url => {
            window.open(url, '_blank');
        });
    }

    getStateAsURLParams() {
        const params = new URLSearchParams();
        
        // Base URL
        if (this.urlInput.value.trim()) {
            params.set('url', this.urlInput.value.trim());
        }

        // Selected languages
        const languageCheckboxes = this.checkboxesContainer.querySelectorAll('input[type="checkbox"]:checked');
        const selectedLangs = Array.from(languageCheckboxes).map(cb => cb.dataset.name).join(',');
        if (selectedLangs) {
            params.set('langs', selectedLangs);
        }

        // Selected additional tags
        const additionalCheckboxes = this.additionalCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked');
        const selectedAdditional = Array.from(additionalCheckboxes).map(cb => {
            const tag = additionalTags.find(t => t.tag === cb.value);
            return tag ? tag.name : '';
        }).filter(Boolean).join(',');
        if (selectedAdditional) {
            params.set('presets', selectedAdditional);
        }

        // Custom tags
        if (this.customTagsInput.value.trim()) {
            params.set('custom', this.customTagsInput.value.trim());
        }

        // Operator
        if (this.operatorInput.value.trim()) {
            params.set('operator', this.operatorInput.value.trim());
        }

        return params.toString();
    }

    copyShareLink() {
        const params = this.getStateAsURLParams();
        const shareUrl = window.location.origin + window.location.pathname + '?' + params;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            const originalText = this.copyShareLinkBtn.textContent;
            this.copyShareLinkBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyShareLinkBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy link. Please copy manually:\n\n' + shareUrl);
        });
    }

    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        // Load base URL
        const url = params.get('url');
        if (url) {
            this.urlInput.value = url;
        }

        // Load selected languages
        const langs = params.get('langs');
        if (langs) {
            const langNames = langs.split(',');
            langNames.forEach(name => {
                const checkbox = this.checkboxesContainer.querySelector(`input[data-name="${name}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }

        // Load preset tags
        const presets = params.get('presets');
        if (presets) {
            const presetNames = presets.split(',');
            presetNames.forEach(name => {
                const tag = additionalTags.find(t => t.name === name);
                if (tag) {
                    const checkbox = this.additionalCheckboxesContainer.querySelector(`input[value="${tag.tag}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                }
            });
        }

        // Load custom tags
        const custom = params.get('custom');
        if (custom) {
            this.customTagsInput.value = custom;
        }

        // Load operator
        const operator = params.get('operator');
        if (operator) {
            this.operatorInput.value = operator;
        }

        // Update results after loading
        this.updateResults();
    }
}

// Initialize after DOM load
document.addEventListener('DOMContentLoaded', () => {
    new URLGenerator();
    console.log('URL Generator loaded successfully!');
});