const text = "### MOCKED HEADER\n**Mocked bold**\n- Mocked list";
let html = text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

html = html.replace(/^### (.*$)/gim, '<h4 style="margin-top: 1rem; font-weight: 700;">$1</h4>');
html = html.replace(/^## (.*$)/gim, '<h3 style="margin-top: 1.25rem; font-weight: 700; border-bottom: 1px solid var(--sl-color-gray-5); padding-bottom: 0.25rem;">$1</h3>');
html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
html = html.replace(/^\s*\-\s+(.*$)/gim, '<li style="margin-left: 1.5rem; list-style-type: disc;">$1</li>');
html = html.replace(/\n/g, '<br />');

console.log(html);
