
// toggle settting
const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');
  const icon = menuBtn.querySelector('i');

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('hidden');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
  });

  // click sound
  //document.addEventListener('DOMContentLoaded', () => {
  const link = document.getElementById('clk');
  const audio = document.getElementById('clickSound');

  link.addEventListener('click', function(event) {
  event.preventDefault(); // Stop default instant navigation
  audio.currentTime = 0;  // Restart sound from beginning
  audio.play();

  // Wait for a tiny bit, then redirect
  setTimeout(() => {
    window.location.href = link.href;
  }, 300); // 200ms delay for the sound to play
});
//});
  

  // backround music

  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');

  let isPlaying = false;

  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      musicToggle.textContent = '🎵 Play Music';
    } else {
      bgMusic.play();
      musicToggle.textContent = '⏸️ Pause Music';
    }
    isPlaying = !isPlaying;
  });

  // Optional: Try to autoplay muted on load
  window.addEventListener('load', () => {
    bgMusic.volume = 0.5; // softer
    // Autoplay might be blocked by browsers, so we leave it to the button
  });


  // NEWS API FETCH
  const newsContainer = document.getElementById("newsContainer");
fetch("https://newsapi.org/v2/top-headlines?country=us&apiKey=b21289122ab249118ff6d3ef1f7f0514")
  .then(response => response.json())
  .then(data => {
    data.articles.slice(0, 5).forEach(article => {
      const newsItem = document.createElement("div");
      newsItem.className = "p-4 bg-blue-100 rounded-lg shadow";

      newsItem.innerHTML = `
        <h3 class="text-xl font-semibold mb-2">${article.title}</h3>
        <p class="mb-2">${article.description || ''}</p>
        <a href="${article.url}" target="_blank" class="text-blue-600 underline">Read more</a>
      `;
      newsContainer.appendChild(newsItem);
    });
   // newsContainer.classList.add("animate-scroll");
  })
  .catch(error => {
    console.error("Error fetching news:", error);
    newsContainer.innerHTML = "<p>Could not load news. Please try again later.</p>";
  });

