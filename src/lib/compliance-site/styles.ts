export const COMPLIANCE_CSS = `
  /* Reset */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --color-text: #1a1a1a;
    --color-text-secondary: #6b7280;
    --color-bg: #ffffff;
    --color-bg-subtle: #f9fafb;
    --color-border: #e5e7eb;
    --color-link: #2563eb;
    --color-link-hover: #1d4ed8;
    --color-button: #111827;
    --color-button-text: #ffffff;
    --color-button-disabled: #9ca3af;
    --color-error: #dc2626;
    --color-success: #059669;
    --max-width: 720px;
  }

  body {
    font-family: var(--font-family);
    font-size: 16px;
    line-height: 1.6;
    color: var(--color-text);
    background: var(--color-bg);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Nav */
  nav {
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .nav-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav-brand {
    font-weight: 600;
    font-size: 18px;
    color: var(--color-text);
    text-decoration: none;
  }
  .nav-links { display: flex; gap: 24px; }
  .nav-links a {
    font-size: 14px;
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color 0.15s;
  }
  .nav-links a:hover { color: var(--color-text); }
  .nav-links a.active { color: var(--color-text); font-weight: 500; }

  /* Main */
  main {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 48px 24px 64px;
    flex: 1;
  }

  /* Typography */
  h1 { font-size: 32px; font-weight: 700; line-height: 1.2; margin-bottom: 16px; }
  h2 { font-size: 24px; font-weight: 600; line-height: 1.3; margin-top: 32px; margin-bottom: 12px; }
  h3 { font-size: 20px; font-weight: 600; line-height: 1.3; margin-top: 24px; margin-bottom: 8px; }
  p { margin-bottom: 16px; }
  .subtitle { font-size: 18px; color: var(--color-text-secondary); margin-bottom: 32px; }
  .meta { font-size: 14px; color: var(--color-text-secondary); margin-bottom: 32px; }

  /* Links */
  a { color: var(--color-link); }
  a:hover { color: var(--color-link-hover); }

  /* Lists */
  ul, ol { margin-bottom: 16px; padding-left: 24px; }
  li { margin-bottom: 8px; }

  /* Contact section */
  .contact { margin-top: 48px; }
  .contact p { margin-bottom: 8px; }

  /* Form (sms page) */
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; }
  .form-group input[type="tel"] {
    width: 100%;
    padding: 10px 14px;
    font-size: 16px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.15s;
  }
  .form-group input[type="tel"]:focus { border-color: var(--color-link); }
  .checkbox-group label {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-weight: 400;
    cursor: pointer;
  }
  .checkbox-group input[type="checkbox"] {
    margin-top: 4px;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  .checkbox-group span { font-size: 14px; color: var(--color-text-secondary); line-height: 1.5; }
  .checkbox-group span a { color: var(--color-link); text-decoration: underline; }

  button[type="submit"] {
    display: inline-flex;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 500;
    color: var(--color-button-text);
    background: var(--color-button);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  button[type="submit"]:hover { opacity: 0.9; }
  button[type="submit"]:disabled {
    background: var(--color-button-disabled);
    cursor: not-allowed;
  }

  .fine-print { font-size: 12px; color: var(--color-text-secondary); margin-top: 16px; }

  #success-message {
    padding: 24px;
    background: var(--color-bg-subtle);
    border-radius: 8px;
    text-align: center;
  }
  #success-message p { color: var(--color-success); font-weight: 500; }

  /* Footer */
  footer {
    border-top: 1px solid var(--color-border);
    margin-top: auto;
  }
  .footer-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--color-text-secondary);
  }
  .powered-by a { color: var(--color-text-secondary); text-decoration: none; }
  .powered-by a:hover { color: var(--color-text); }

  /* Responsive */
  @media (max-width: 640px) {
    .nav-inner { padding: 0 16px; }
    .nav-links { gap: 16px; }
    .nav-links a { font-size: 13px; }
    main { padding: 32px 16px 48px; }
    h1 { font-size: 26px; }
    h2 { font-size: 20px; }
    .footer-inner { flex-direction: column; gap: 8px; text-align: center; }
  }
`;
