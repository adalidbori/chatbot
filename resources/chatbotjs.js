fetch('resources/chatbot.html')
  .then(response => response.text())
  .then(data => {
    const div = document.createElement('div');
    div.innerHTML = data;
    document.body.appendChild(div);
    const script = document.createElement('script');
    script.src = 'resources/app.js';
    script.type = 'text/javascript';
    document.body.appendChild(script);
    const css = document.createElement('link');
    css.href = 'resources/style.css';
    css.rel = 'stylesheet';
    document.head.appendChild(css);
  });