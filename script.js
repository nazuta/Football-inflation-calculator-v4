const transferData = [
    { year: "1996-97", value: 0.16, percentage: -68 },
    { year: "1997-98", value: 0.15, percentage: -70 },
    // ...
];

const transferPriceInput = document.getElementById('transferPrice');
const fromSeasonSelect = document.getElementById('fromSeason');
const toSeasonSelect = document.getElementById('toSeason');
const adjustedValueDiv = document.getElementById('adjustedValue');
const priceTable = document.getElementById('priceTable').getElementsByTagName('tbody')[0];
const ctx = document.getElementById('transferChart').getContext('2d');
const themeSwitch = document.getElementById('themeSwitch');

// Theme switcher
themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    updateChartTheme();
});

// Initialize Cleave.js for transfer price input
new Cleave(transferPriceInput, {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand',
    prefix: '€',
    numeralPositiveOnly: true,
    numeralDecimalScale: 0
});

// Populate season selectors
transferData.forEach(data => {
    const option = new Option(data.year, data.year);
    fromSeasonSelect.add(option.cloneNode(true));
    toSeasonSelect.add(option);
});

// Решта JavaScript-коду...
