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

// Load recent videos from admin videoGallery
function loadRecentVideos() {
  try {
    const videoGallery = JSON.parse(localStorage.getItem('videoGallery') || '[]');
    const videosTrack = document.getElementById('videos-track');
    
    if (!videosTrack) return;
    
    if (videoGallery.length > 0) {
      videosTrack.innerHTML = '';
      
      videoGallery.forEach((video) => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
          ${createVideoEmbed(video.url)}
          <div class="video-info">
            <h4>${video.title}</h4>
            <p>${video.description || 'Watch this amazing video from our parish.'}</p>
          </div>
        `;
        videosTrack.appendChild(videoCard);
      });
    } else {
      videosTrack.innerHTML = `
        <div class="video-card">
          <iframe class="video-embed" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>
          <div class="video-info">
            <h4>Sunday Mass Celebration</h4>
            <p>Join us for our weekly Sunday Mass with inspiring hymns and fellowship.</p>
          </div>
        </div>
        <div class="video-card">
          <iframe class="video-embed" src="https://www.youtube.com/embed/9bZkp7q19f0" allowfullscreen></iframe>
          <div class="video-info">
            <h4>Christmas Eve Service</h4>
            <p>Experience the joy and wonder of our Christmas Eve candlelight service.</p>
          </div>
        </div>
        <div class="video-card">
          <iframe class="video-embed" src="https://www.youtube.com/embed/kJQP7kiw5Fk" allowfullscreen></iframe>
          <div class="video-info">
            <h4>Youth Ministry Gathering</h4>
            <p>Our young adults come together for faith sharing and community building.</p>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading recent videos:', error);
  }
}

// Create video embed from URL
function createVideoEmbed(url) {
  // Handle YouTube URLs
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }
    
    if (videoId) {
      return `<iframe class="video-embed" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
    }
  }
  
  // Handle direct video URLs
  if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')) {
    return `<video class="video-embed" controls><source src="${url}" type="video/mp4"></video>`;
  }
  
  // Handle iframe embeds
  if (url.includes('<iframe')) {
    return url;
  }
  
  // Fallback
  return `<iframe class="video-embed" src="${url}" allowfullscreen></iframe>`;
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

// Hamburger Menu Functions
function toggleMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('mobileNavOverlay');
  const menu = document.getElementById('mobileNavMenu');
  
  if (hamburger && overlay && menu) {
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    menu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (menu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('mobileNavOverlay');
  const menu = document.getElementById('mobileNavMenu');
  
  if (hamburger && overlay && menu) {
    hamburger.classList.remove('active');
    overlay.classList.remove('active');
    menu.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Setup mobile menu event listeners
function setupMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('mobileNavOverlay');
  const closeBtn = document.getElementById('mobileNavClose');
  const menu = document.getElementById('mobileNavMenu');
  
  // Hamburger button click
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }
  
  // Overlay click to close
  if (overlay) {
    overlay.addEventListener('click', closeMobileMenu);
  }
  
  // Close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileMenu);
  }
  
  // Close menu when clicking on nav links
  if (menu) {
    menu.addEventListener('click', function(e) {
      if (e.target.classList.contains('nav-link')) {
        closeMobileMenu();
      }
    });
  }
  
  // Close menu on window resize if screen becomes large
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
  
  // Handle escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });
}

// Scroll videos function for both desktop and mobile
function scrollVideos(direction) {
  if (direction === 'left') {
    moveVideoCarousel(-1);
  } else {
    moveVideoCarousel(1);
  }
}

// Scroll news function
function scrollNews(direction) {
  const newsGrid = document.querySelector('.news-cards-grid');
  if (!newsGrid) return;
  
  const cards = newsGrid.querySelectorAll('.news-card');
  if (cards.length === 0) return;
  
  const cardWidth = cards[0].offsetWidth;
  const gap = 32;
  const scrollAmount = cardWidth + gap;
  
  if (direction === 'left') {
    newsGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    newsGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

// Video Carousel Auto-scroll
let videoIndex = 0;
let videoTimer;

function getVideoSlidesVisible() {
  return 3; // Always show 3 videos
}

function updateVideoCarousel() {
  const track = document.getElementById('videos-track');
  if (!track) return;
  
  const cards = track.querySelectorAll('.video-card');
  if (cards.length === 0) return;
  
  const visible = getVideoSlidesVisible();
  const slideWidth = 100 / visible;
  track.style.transform = `translateX(-${videoIndex * slideWidth}%)`;
}

function moveVideoCarousel(direction) {
  const track = document.getElementById('videos-track');
  if (!track) return;
  
  const cards = track.querySelectorAll('.video-card');
  if (cards.length === 0) return;
  
  const visible = getVideoSlidesVisible();
  const maxIndex = cards.length - visible;
  
  if (direction === 1) {
    videoIndex = videoIndex >= maxIndex ? 0 : videoIndex + visible;
  } else {
    videoIndex = videoIndex <= 0 ? maxIndex : videoIndex - visible;
  }
  
  updateVideoCarousel();
}

function startVideoTimer() {
  if (videoTimer) clearInterval(videoTimer);
  videoTimer = setInterval(() => moveVideoCarousel(1), 3000); // 3 seconds
}

function stopVideoTimer() {
  if (videoTimer) clearInterval(videoTimer);
}

// News Carousel
let newsIndex = 0;
let newsTimer;

function getSlidesVisible() {
  return window.innerWidth <= 480 ? 1 : window.innerWidth <= 768 ? 2 : 3;
}

function updateNewsCarousel() {
  const track = document.getElementById('newsCarouselTrack');
  if (!track) return;
  
  const visible = getSlidesVisible();
  const slideWidth = 100 / visible;
  
  // Stop animation and apply manual transform
  track.classList.add('manual-control');
  track.style.transform = `translateX(-${newsIndex * slideWidth}%)`;
  
  // Resume animation after 5 seconds
  setTimeout(() => {
    track.classList.remove('manual-control');
    track.style.transform = '';
  }, 5000);
}

function moveNewsCarousel(direction) {
  const visible = getSlidesVisible();
  const maxIndex = 5 - visible;
  
  if (direction === 1) {
    newsIndex = newsIndex >= maxIndex ? 0 : newsIndex + 1;
  } else {
    newsIndex = newsIndex <= 0 ? maxIndex : newsIndex - 1;
  }
  
  updateNewsCarousel();
}

function startNewsTimer() {
  if (newsTimer) clearInterval(newsTimer);
  newsTimer = setInterval(() => moveNewsCarousel(1), 3000);
}

function stopNewsTimer() {
  if (newsTimer) clearInterval(newsTimer);
}

window.moveNewsCarousel = moveNewsCarousel;

// Global functions for backward compatibility
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.scrollVideos = scrollVideos;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadMainVideo();
  loadRecentVideos();
  loadMassSchedule();
  loadNewsCarousel();
  loadPriestMessage();
  setupStorageListener();
  setupMobileMenu();
  
  // Add scroll event listener to update arrow visibility
  const videoStrip = document.getElementById('video-strip');
  if (videoStrip) {
    videoStrip.addEventListener('scroll', updateArrowVisibility);
  }
  
  // Add video navigation button listeners
  const leftBtn = document.querySelector('.video-nav-left');
  const rightBtn = document.querySelector('.video-nav-right');
  
  if (leftBtn) {
    leftBtn.addEventListener('click', () => scrollVideos('left'));
  }
  
  if (rightBtn) {
    rightBtn.addEventListener('click', () => scrollVideos('right'));
  }
  
  // Initialize video carousel auto-scroll
  setTimeout(() => {
    updateVideoCarousel();
    startVideoTimer();
    
    const videoContainer = document.querySelector('.videos-carousel-container');
    if (videoContainer) {
      videoContainer.addEventListener('mouseenter', stopVideoTimer);
      videoContainer.addEventListener('mouseleave', startVideoTimer);
    }
  }, 500);
  
  // Initialize news carousel
  setTimeout(() => {
    updateNewsCarousel();
    startNewsTimer();
    
    const container = document.querySelector('.news-carousel-container');
    if (container) {
      container.addEventListener('mouseenter', stopNewsTimer);
      container.addEventListener('mouseleave', startNewsTimer);
    }
    
    window.addEventListener('resize', () => {
      newsIndex = 0;
      updateNewsCarousel();
    });
  }, 500);
});