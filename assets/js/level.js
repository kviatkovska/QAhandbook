(() => {
    const BASE = '../qa-handbook/';
    const LEVELS = { junior: '01-junior', middle: '02-middle', senior: '03-senior' };
    const DOCS = [
        { id: 'istqb', label: '📖 ISTQB', file: 'istqb.md' },
        { id: 'client-server', label: '🌐 Client-Server', file: 'client-server.md' },
        { id: 'api', label: '🔌 API Testing', file: 'api-testing.md' },
        { id: 'interview', label: '💬 Співбесіда', file: 'interview-questions.md' },
    ];

    const level = document.body.dataset.level;
    const content = document.getElementById('content');
    const tabsEl = document.getElementById('tabs');
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const isGlossary = level === 'glossary';
    const dir = LEVELS[level];

    function pathFor(doc) {
        return isGlossary ? BASE + 'glossary.md' : `${BASE}${dir}/${doc.file}`;
    }

    // Rewrite links to .md files so they open inside the site.
    function fixLinks(currentUrl) {
        content.querySelectorAll('a[href]').forEach((a) => {
            const href = a.getAttribute('href');
            if (/^(https?:|#|mailto:)/.test(href)) {
                if (/^https?:/.test(href)) a.target = '_blank', a.rel = 'noopener';
                return;
            }
            const url = new URL(href, currentUrl);
            if (/\/glossary\.md$/.test(url.pathname)) { a.href = 'glossary.html'; return; }
            const m = url.pathname.match(/\/qa-handbook\/(0\d-(\w+))\/([\w-]+)\.md$/);
            if (m) {
                const doc = DOCS.find((d) => d.file === m[3] + '.md');
                if (doc) a.href = `${m[2]}.html#${doc.id}`;
            }
        });
    }

    async function render(doc) {
        const path = pathFor(doc);
        content.textContent = 'Завантаження…';
        try {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`HTTP ${res.status} для ${path}`);
            content.innerHTML = marked.parse(await res.text());
            content.querySelectorAll('pre > code.language-mermaid').forEach((code) => {
                const div = document.createElement('div');
                div.className = 'mermaid';
                div.textContent = code.textContent;
                code.parentElement.replaceWith(div);
            });
            fixLinks(new URL(path, location.href));
            if (window.mermaid) {
                mermaid.initialize({ startOnLoad: false,
                    theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default' });
                mermaid.run({ querySelector: '.mermaid' });
            }
        } catch (err) {
            content.innerHTML = `<div class="error-box">Не вдалося завантажити матеріал: ${err.message}.<br>
                Відкривайте сайт через http-сервер (GitHub Pages або <code>npx serve</code>), а не через file://.</div>`;
        }
    }

    function select(id) {
        const doc = DOCS.find((d) => d.id === id) || DOCS[0];
        tabsEl.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.doc === doc.id));
        render(doc);
    }

    if (isGlossary) {
        tabsEl.remove();
        render({ file: 'glossary.md' });
        return;
    }

    DOCS.forEach((d) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.dataset.doc = d.id;
        b.dataset.testid = `tab-${d.id}`;
        b.textContent = d.label;
        b.addEventListener('click', () => { location.hash = d.id; });
        tabsEl.appendChild(b);
    });
    window.addEventListener('hashchange', () => select(location.hash.slice(1)));
    select(location.hash.slice(1));
})();
