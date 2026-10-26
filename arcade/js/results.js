// Results Controller: розрахунок, збереження запису та посилання на напрями
function showResults() {
    const categoryResults = resultsCalculator.calculatePercentages(state.swipes);

    jsonBucket.addNew({
        gender: state.gender,
        age: state.age,
        swipes: state.swipes.slice(),
        suggestion: categoryResults,
        source: RECORD_SOURCE
    });

    const results = categoryResults
        .map(cat => {
            const d = educationDirections.find(x => x.id === cat.id);
            return { name: d.name, url: d.url, percentage: cat.percentage };
        })
        .sort((a, b) => b.percentage - a.percentage);

    const list = $('resultsList');
    list.innerHTML = '';
    results.forEach(r => {
        // справжнє посилання: браузер сам відкриває сторінку при кліку чи тапі
        const a = document.createElement('a');
        a.className = 'nav result-item';
        a.href = r.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = `<span class="bar" data-w="${r.percentage}"></span><span class="nm"></span>` +
            `<span class="right"><span class="pc">${r.percentage}%</span><span class="go">▶</span></span>`;
        a.querySelector('.nm').textContent = r.name;
        list.appendChild(a);
    });

    showScreen('results');
    list.querySelectorAll('.bar').forEach((b, i) => setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 120 * (i + 1)));
}

// відкриття з клавіатури чи геймпада: нова вкладка, а якщо браузер її заблокував — та сама вкладка
function openLink(a) {
    let w = null;
    try { w = window.open(a.href, '_blank'); } catch (e) {}
    if (w) {
        try { w.opener = null; } catch (e) {}
    } else {
        location.href = a.href;
    }
}
