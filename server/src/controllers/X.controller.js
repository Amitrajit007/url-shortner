const easterEgg = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Surprise!</title>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            background: black;
          }
          iframe {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            border: 0;
          }
          #overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <iframe id="video"
          src="https://www.youtube.com/embed/xvFZjo5PgG0?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0"
          allow="autoplay; fullscreen; encrypted-media"
          allowfullscreen>
        </iframe>
        <div id="overlay" onclick="unmute()"></div>

        <script>
          function unmute() {
            const iframe = document.getElementById('video');
            // Reload the iframe with sound on
            iframe.src = "https://www.youtube.com/embed/xvFZjo5PgG0?autoplay=1&mute=0&controls=0&modestbranding=1&showinfo=0&rel=0";
            document.getElementById('overlay').style.display = 'none';
          }
        </script>
      </body>
    </html>
  `);
};

export default easterEgg;
