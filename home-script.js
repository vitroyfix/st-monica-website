// Load main video from localStorage
function loadMainVideo() {
  const videoId = localStorage.getItem('mainVideoId');
  
  if (videoId) {
    updateMainVideoIframe(videoId);
  }
}

// Update the main video iframe src
function updateMainVideoIframe(videoId) {
  const mainVideoIframe = document.getElementById('main-video');
  if (mainVideoIframe) {
    mainVideoIframe.src = `https://www.youtube.com/embed/${videoId}`;
    console.log('Updated main video to:', videoId);
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadMainVideo();
});