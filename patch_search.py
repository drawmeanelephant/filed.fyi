import re

with open('src/pages/search.astro', 'r') as f:
    content = f.read()

new_script = r"""  <script>
    // Safe, lightweight markdown formatter to avoid raw syntax displays
    function parseBasicMarkdown(text) {
      // 1. Escape HTML first to prevent XSS
      let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

      // 2. Format Headers (### or ##)
      html = html.replace(/^### (.*$)/gim, '<h4 style="margin-top: 1rem; font-weight: 700;">$1</h4>');
      html = html.replace(/^## (.*$)/gim, '<h3 style="margin-top: 1.25rem; font-weight: 700; border-bottom: 1px solid var(--sl-color-gray-5); padding-bottom: 0.25rem;">$1</h3>');

      // 3. Format Bold (**text**)
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // 4. Format Bullet Points
      html = html.replace(/^\s*\-\s+(.*$)/gim, '<li style="margin-left: 1.5rem; list-style-type: disc;">$1</li>');

      // 5. Convert Newlines to Breaks
      html = html.replace(/\n/g, '<br />');

      return html;
    }

    document.getElementById('rag-search-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const queryInput = document.getElementById('rag-query');
      const query = queryInput.value;

      const loading = document.getElementById('search-loading');
      const errorDiv = document.getElementById('search-error');
      const resultsDiv = document.getElementById('search-results');

      if(loading) loading.style.display = 'block';
      if(errorDiv) errorDiv.style.display = 'none';
      if(resultsDiv) resultsDiv.style.display = 'none';

      try {
        const res = await fetch('/api/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'API Error');
        }

        // Render LLM response with formatting
        const llmContainer = document.getElementById('llm-response');
        if (llmContainer) {
          llmContainer.innerHTML = parseBasicMarkdown(data.result);
        }

        // Helper to render bins
        const renderBin = (binItems, containerId) => {
          const container = document.getElementById(containerId);
          if (!container) return;
          container.innerHTML = '';
          if (!binItems || binItems.length === 0) {
            container.innerHTML = '<div class="result-item">No retrieved records.</div>';
            return;
          }
          binItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `
              <div class="result-title">${item.title || item.id}</div>
              <div>${(item.content || '').substring(0, 300)}...</div>
            `;
            container.appendChild(div);
          });
        };

        if (data.bins) {
          renderBin(data.bins.lorelog, 'soma-results');
          renderBin(data.bins.reference, 'coma-results');
          renderBin(data.bins.mascots, 'mascot-results');
          renderBin(data.bins.poetry_results || data.bins.poetry_posts, 'poetry-results');
        }

        if(loading) loading.style.display = 'none';
        if(resultsDiv) resultsDiv.style.display = 'block';

      } catch (err) {
        if(loading) loading.style.display = 'none';
        if(errorDiv) {
          errorDiv.textContent = err.message;
          errorDiv.style.display = 'block';
        }
      }
    });
  </script>"""

# Replace the script block
# Avoid regex parsing issues with replacement string
content = content.split('<script>')[0] + new_script + '\n</StarlightPage>\n'

with open('src/pages/search.astro', 'w') as f:
    f.write(content)
