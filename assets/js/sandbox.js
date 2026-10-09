(() => {
    const $ = (id) => document.getElementById(id);
    const els = {
        level: $('level'), section: $('section'), language: $('language'),
        tool: $('tool'), experience: $('experience'),
        button: $('generate-question'), block: $('question-block'),
        question: $('generated-question'), empty: $('empty-state'),
    };
    $('current-year').textContent = new Date().getFullYear();

    let questions = [];
    let loaded = false;
    let lastId = null;

    const loading = fetch('../data/questions.json')
        .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then((d) => { questions = d.questions || []; loaded = true; })
        .catch((e) => { showEmpty(`Не вдалося завантажити data/questions.json (${e.message}).`); });

    function showEmpty(text) {
        els.block.hidden = true;
        els.empty.hidden = false;
        if (text) els.empty.textContent = text;
    }

    // Level and section must match exactly. For language/tool/experience, "All" on either side matches anything.
    const loose = (qValue, selected) => qValue === 'All' || selected === 'All' || qValue === selected;

    function matches(q, f) {
        return q.level === f.level && q.section === f.section
            && loose(q.language, f.language) && loose(q.tool, f.tool) && loose(q.experience, f.experience);
    }

    async function generate() {
        if (!loaded) await loading;
        if (!loaded) return;
        const f = Object.fromEntries(['level', 'section', 'language', 'tool', 'experience'].map((k) => [k, els[k].value]));
        let pool = questions.filter((q) => matches(q, f));
        if (pool.length > 1) pool = pool.filter((q) => q.id !== lastId); // avoid repeating the same question
        if (!pool.length) return showEmpty('Немає питань за такими критеріями. Спробуйте змінити фільтри.');

        const q = pool[Math.floor(Math.random() * pool.length)];
        lastId = q.id;
        els.empty.hidden = true;
        els.block.hidden = false;
        els.question.textContent = q.text;
    }

    els.button.addEventListener('click', generate);
})();
