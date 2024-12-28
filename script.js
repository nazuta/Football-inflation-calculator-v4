const transferData = [
    { year: "1996-97", value: 0.16, percentage: -68 },
    { year: "1997-98", value: 0.15, percentage: -70 },
    { year: "1998-99", value: 0.22, percentage: -56 },
    { year: "1999-00", value: 0.22, percentage: -56 },
    { year: "2000-01", value: 0.42, percentage: -16 },
    { year: "2001-02", value: 0.39, percentage: -22 },
    { year: "2002-03", value: 0.32, percentage: -36 },
    { year: "2003-04", value: 0.27, percentage: -46 },
    { year: "2004-05", value: 0.26, percentage: -48 },
    { year: "2005-06", value: 0.29, percentage: -42 },
    { year: "2006-07", value: 0.27, percentage: -46 },
    { year: "2007-08", value: 0.38, percentage: -24 },
    { year: "2008-09", value: 0.41, percentage: -18 },
    { year: "2009-10", value: 0.36, percentage: -28 },
    { year: "2010-11", value: 0.39, percentage: -22 },
    { year: "2011-12", value: 0.36, percentage: -28 },
    { year: "2012-13", value: 0.40, percentage: -20 },
    { year: "2013-14", value: 0.50, percentage: 0 },
    { year: "2014-15", value: 0.58, percentage: 16 },
    { year: "2015-16", value: 0.65, percentage: 30 },
    { year: "2016-17", value: 0.83, percentage: 66 },
    { year: "2017-18", value: 0.99, percentage: 98 },
    { year: "2018-19", value: 0.97, percentage: 94 },
    { year: "2019-20", value: 1.08, percentage: 116 },
    { year: "2020-21", value: 1.30, percentage: 160 },
    { year: "2021-22", value: 0.99, percentage: 98 },
    { year: "2022-23", value: 1.07, percentage: 114 },
    { year: "2023-24", value: 1.16, percentage: 132 },
    { year: "2024-25", value: 1.25, percentage: 150 }
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

function updateResults() {
    const price = parseFloat(transferPriceInput.value.replace(/[^0-9.-]+/g,""));
    const fromYear = fromSeasonSelect.value;
    const toYear = toSeasonSelect.value;

    if (isNaN(price) || !fromYear || !toYear) return;

    const fromIndex = transferData.findIndex(data => data.year === fromYear);
    const toIndex = transferData.findIndex(data => data.year === toYear);
    const adjustedPrice = price * (transferData[toIndex].value / transferData[fromIndex].value);

    adjustedValueDiv.textContent = `Adjusted Value: €${adjustedPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;

    priceTable.innerHTML = '';
    transferData.forEach((data, index) => {
        const row = priceTable.insertRow();
        row.insertCell(0).textContent = data.year;
        const adjustedValue = price * (data.value / transferData[fromIndex].value);
        row.insertCell(1).textContent = `€${adjustedValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
        
        if (index === fromIndex) {
            row.insertCell(2).textContent = '-';
        } else {
            const growthPercentage = ((data.value / transferData[fromIndex].value) - 1) * 100;
            row.insertCell(2).textContent = `${growthPercentage.toFixed(2)}%`;
        }
        
        if (index >= Math.min(fromIndex, toIndex) && index <= Math.max(fromIndex, toIndex)) {
            row.classList.add('highlighted');
        }
    });

    updateChart(price, fromIndex, toIndex);
}

function updateChart(initialPrice, fromIndex, toIndex) {
    const labels = transferData.map(data => data.year);
    const data = transferData.map((data, index) => initialPrice * (data.value / transferData[fromIndex].value));

    if (window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Transfer Price',
                data: data,
                borderColor: getComputedStyle(document.body).getPropertyValue('--accent-color'),
                backgroundColor: `${getComputedStyle(document.body).getPropertyValue('--accent-color')}33`,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, values) {
                            return '€' + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                        },
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    },
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--border-color')
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    },
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--border-color')
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += '€' + context.parsed.y.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-color')
                    }
                }
            }
        }
    });
}

function updateChartTheme() {
    if (window.myChart) {
        window.myChart.options.scales.y.ticks.color = getComputedStyle(document.body).getPropertyValue('--text-color');
        window.myChart.options.scales.x.ticks.color = getComputedStyle(document.body).getPropertyValue('--text-color');
        window.myChart.options.scales.y.grid.color = getComputedStyle(document.body).getPropertyValue('--border-color');
        window.myChart.options.scales.x.grid.color = getComputedStyle(document.body).getPropertyValue('--border-color');
        window.myChart.options.plugins.legend.labels.color = getComputedStyle(document.body).getPropertyValue('--text-color');
        window.myChart.data.datasets[0].borderColor = getComputedStyle(document.body).getPropertyValue('--accent-color');
        window.myChart.data.datasets[0].backgroundColor = `${getComputedStyle(document.body).getPropertyValue('--accent-color')}33`;
        window.myChart.update();
    }
}

transferPriceInput.addEventListener('input', updateResults);
fromSeasonSelect.addEventListener('change', updateResults);
toSeasonSelect.addEventListener('change', updateResults);

// Set initial values and calculate on load
window.addEventListener('load', () => {
    fromSeasonSelect.value = "2013-14";  // Base year
    toSeasonSelect.value = transferData[transferData.length - 1].year;  // Last year in the array
    updateResults();

    // Animation for fading in elements
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });
    }, 100);
});
