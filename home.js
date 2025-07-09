// Load main video from localStorage
function loadMainVideo() {
  try {
    const mainVideo = JSON.parse(localStorage.getItem('mainVideo') || 'null');
    
    if (mainVideo && mainVideo.iframe) {
      const videoWrapper = document.querySelector('.video-wrapper');
      videoWrapper.innerHTML = mainVideo.iframe;
      
      // Removed uploader info for public view
    } else {
      document.querySelector('.video-wrapper').innerHTML = `
        <div class="no-video-message">
          <p>No video available. Please check back later for our livestream.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading main video:', error);
    document.querySelector('.video-wrapper').innerHTML = `
      <div class="no-video-message">
        <p>Error loading video. Please try again later.</p>
      </div>
    `;
  }
}

// Load priest message from localStorage
function loadPriestMessage() {
  try {
    const priestMessage = JSON.parse(localStorage.getItem('priestMessage') || 'null');
    const messageSection = document.getElementById('pastor-message');
    
    if (priestMessage && priestMessage.title && priestMessage.content) {
      // Update the message with content from localStorage
      messageSection.innerHTML = `
        <h2 class="section-title">${priestMessage.title}</h2>
        <p class="message-content">
          ${priestMessage.content} — <strong>${priestMessage.priestName}</strong>
        </p>
      `;
    }
    // If no message in localStorage, keep the default content
  } catch (error) {
    console.error('Error loading priest message:', error);
  }
}

// Load recent videos from localStorage
function loadRecentVideos() {
  try {
    const recentVideos = JSON.parse(localStorage.getItem('recentVideos') || '[]');
    const videoStrip = document.getElementById('video-strip');
    const leftArrow = document.querySelector('.scroll-arrow.scroll-left');
    const rightArrow = document.querySelector('.scroll-arrow.scroll-right');
    
    if (recentVideos.length > 0) {
      videoStrip.innerHTML = '';
      
      recentVideos.forEach((video) => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
          <div class="video-thumbnail">
            ${video.iframe}
          </div>
          <!-- Removed uploader info and date for public view -->
        `;
        videoStrip.appendChild(videoCard);
      });
      
      // Show/hide scroll arrows based on number of videos
      if (recentVideos.length > 3) {
        leftArrow.style.display = 'flex';
        rightArrow.style.display = 'flex';
        
        // Initialize arrow states
        updateArrowVisibility();
      } else {
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
      }
    } else {
      videoStrip.innerHTML = '<p class="no-videos-message">No recent videos available.</p>';
      leftArrow.style.display = 'none';
      rightArrow.style.display = 'none';
    }
  } catch (error) {
    console.error('Error loading recent videos:', error);
    document.getElementById('video-strip').innerHTML = '<p class="error-message">Error loading videos.</p>';
    document.querySelector('.scroll-arrow.scroll-left').style.display = 'none';
    document.querySelector('.scroll-arrow.scroll-right').style.display = 'none';
  }
}

// Update arrow visibility based on scroll position
function updateArrowVisibility() {
  const videoStrip = document.getElementById('video-strip');
  const leftArrow = document.querySelector('.scroll-arrow.scroll-left');
  const rightArrow = document.querySelector('.scroll-arrow.scroll-right');
  
  if (!videoStrip || !leftArrow || !rightArrow) return;
  
  // Check if at the start
  if (videoStrip.scrollLeft <= 10) {
    leftArrow.style.opacity = '0.3';
    leftArrow.style.pointerEvents = 'none';
  } else {
    leftArrow.style.opacity = '1';
    leftArrow.style.pointerEvents = 'auto';
  }
  
  // Check if at the end
  const isAtEnd = videoStrip.scrollLeft >= (videoStrip.scrollWidth - videoStrip.clientWidth - 10);
  if (isAtEnd) {
    rightArrow.style.opacity = '0.3';
    rightArrow.style.pointerEvents = 'none';
  } else {
    rightArrow.style.opacity = '1';
    rightArrow.style.pointerEvents = 'auto';
  }
}

// Load mass schedule from localStorage
function loadMassSchedule() {
  try {
    const schedule = JSON.parse(localStorage.getItem('massSchedule') || '[]');
    const container = document.getElementById('mass-schedule');
    
    if (schedule.length > 0) {
      container.innerHTML = '';
      
      schedule.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'schedule-card';
        card.innerHTML = `
          <h3>${entry.day}</h3>
          ${entry.times.map(time => `<div class="time">${time}</div>`).join('')}
          ${entry.type ? `<div class="type">${entry.type}</div>` : ''}
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = '<p class="no-schedule">No mass schedule available.</p>';
    }
  } catch (error) {
    console.error('Error loading mass schedule:', error);
  }
}

// Load news carousel from localStorage
function loadNewsCarousel() {
  try {
    const news = JSON.parse(localStorage.getItem('newsCarousel') || '[]');
    const container = document.getElementById('carousel-slider');
    
    if (news.length > 0) {
      container.innerHTML = '';
      
      news.forEach(item => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        const imgSrc = item.imageData || item.image || '';
        
        slide.innerHTML = `
          <img src="${imgSrc}" alt="${item.message}">
          <h3>${item.message}</h3>
        `;
        container.appendChild(slide);
      });
    } else {
      container.innerHTML = '<p class="no-news">No news items available.</p>';
    }
  } catch (error) {
    console.error('Error loading news carousel:', error);
  }
}

// Format date to relative time (kept for admin use)
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
}

// Scroll video strip by one card at a time
function scrollVideoStrip(direction) {
  const strip = document.getElementById('video-strip');
  const cards = strip.querySelectorAll('.video-card');
  
  if (cards.length === 0) return;
  
  // Get the width of a single card including gap
  const cardWidth = cards[0].offsetWidth;
  const gap = 20; // Gap between cards (from CSS)
  const scrollAmount = cardWidth + gap;
  
  if (direction === 'left') {
    strip.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    strip.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
  
  // Update arrow visibility after scrolling
  setTimeout(updateArrowVisibility, 300);
}

// Listen for localStorage changes
function setupStorageListener() {
  window.addEventListener('storage', function(e) {
    if (e.key === 'mainVideo' || e.key === 'recentVideos') {
      loadMainVideo();
      loadRecentVideos();
    }
    if (e.key === 'massSchedule') {
      loadMassSchedule();
    }
    if (e.key === 'newsCarousel') {
      loadNewsCarousel();
    }
    if (e.key === 'priestMessage') {
      loadPriestMessage();
    }
  });
}

// Show live video content
function showLiveVideo() {
  const paragraph = document.querySelector('#default-content .video-description');
  const button = document.querySelector('#default-content .play-button');
  const liveVideoContent = document.getElementById('live-video-content');
  const iframe = document.getElementById('youtube-iframe');
  
  if (paragraph && button && liveVideoContent && iframe) {
    // Hide paragraph and button
    paragraph.style.display = 'none';
    button.style.display = 'none';
    
    // Load live stream URL (replace CHANNEL_ID with actual channel ID)
    const liveStreamUrl = 'https://www.youtube.com/embed/live_stream?channel=CHANNEL_ID&autoplay=1';
    iframe.src = liveStreamUrl;
    
    // Show video content
    liveVideoContent.style.display = 'block';
  }
}

// Show default content
function showDefaultContent() {
  const paragraph = document.querySelector('#default-content .video-description');
  const button = document.querySelector('#default-content .play-button');
  const liveVideoContent = document.getElementById('live-video-content');
  const iframe = document.getElementById('youtube-iframe');
  
  if (paragraph && button && liveVideoContent && iframe) {
    // Hide video content
    liveVideoContent.style.display = 'none';
    
    // Stop video by clearing src
    iframe.src = '';
    
    // Show paragraph and button
    paragraph.style.display = 'block';
    button.style.display = 'inline-flex';
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadMainVideo();
  loadRecentVideos();
  loadMassSchedule();
  loadNewsCarousel();
  loadPriestMessage();
  setupStorageListener();
  
  // Add scroll event listener to update arrow visibility
  const videoStrip = document.getElementById('video-strip');
  if (videoStrip) {
    videoStrip.addEventListener('scroll', updateArrowVisibility);
  }
});