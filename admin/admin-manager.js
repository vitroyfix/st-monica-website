// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadDashboard();
  loadMassSchedule();
  loadNewsItems();
  loadVideoData();
  loadPriestMessage();
  loadActivityLog();
  loadVideoGallery();
  
  // Set default uploader name
  const uploaderNameField = document.getElementById('uploader-name');
  if (uploaderNameField) {
    uploaderNameField.value = getAdminUsername();
  }
  
  // Setup navigation
  setupNavigation();
  
  // Setup video form
  setupVideoForm();
});

// Navigation setup
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      showSection(section);
      
      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// Show section
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  const targetSection = document.getElementById(sectionId + '-section');
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Load section-specific data
  if (sectionId === 'video-gallery') {
    loadVideoGallery();
  }
}

// Toggle sidebar for mobile
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('active');
}

// Logout
function logout() {
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('adminUsername');
  window.location.href = 'login.html';
}

// Get admin username
function getAdminUsername() {
  return localStorage.getItem('adminUsername') || 'Admin';
}

// Activity Log Functions
function addActivityLog(action, details) {
  try {
    const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
    const adminName = getAdminUsername();
    const now = new Date();
    
    const logEntry = {
      admin: adminName,
      action: action,
      details: details,
      timestamp: now.toISOString(),
      formattedDate: now.toLocaleDateString(),
      formattedTime: now.toLocaleTimeString()
    };
    
    logs.unshift(logEntry);
    const trimmedLogs = logs.slice(0, 50);
    localStorage.setItem('activityLogs', JSON.stringify(trimmedLogs));
    
    return true;
  } catch (error) {
    console.error('Error adding activity log:', error);
    return false;
  }
}

function loadActivityLog() {
  try {
    const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
    const container = document.getElementById('activity-log');
    
    if (container) {
      if (logs.length > 0) {
        let html = '<h3>Recent Activity</h3>';
        logs.forEach(log => {
          html += `
            <div class="activity-log-item ${log.action.toLowerCase()}">
              <div class="activity-message">
                <span class="activity-admin">${log.admin}</span> ${log.details} on ${log.formattedDate} at ${log.formattedTime}
              </div>
            </div>
          `;
        });
        container.innerHTML = html;
      } else {
        container.innerHTML = '<p>No activity recorded yet.</p>';
      }
    }
  } catch (error) {
    console.error('Error loading activity log:', error);
  }
}

// Dashboard
function loadDashboard() {
  try {
    const massSchedule = JSON.parse(localStorage.getItem('massSchedule') || '[]');
    const newsCarousel = JSON.parse(localStorage.getItem('newsCarousel') || '[]');
    const videoGallery = JSON.parse(localStorage.getItem('videoGallery') || '[]');
    
    const massCountEl = document.getElementById('mass-count');
    const newsCountEl = document.getElementById('news-count');
    const videoCountEl = document.getElementById('video-count');
    
    if (massCountEl) massCountEl.textContent = massSchedule.length;
    if (newsCountEl) newsCountEl.textContent = newsCarousel.length;
    if (videoCountEl) videoCountEl.textContent = videoGallery.length;
  } catch (error) {
    console.error('Dashboard error:', error);
  }
}

// Video Gallery Functions
function setupVideoForm() {
  const videoForm = document.getElementById('video-form');
  if (videoForm) {
    videoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      uploadVideo();
    });
  }
}

function showVideoUploadForm() {
  const form = document.getElementById('video-upload-form');
  if (form) {
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
  }
}

function hideVideoUploadForm() {
  const form = document.getElementById('video-upload-form');
  if (form) {
    form.style.display = 'none';
    document.getElementById('video-form').reset();
  }
}

function uploadVideo() {
  const title = document.getElementById('video-title').value.trim();
  const iframe = document.getElementById('video-iframe').value.trim();
  const description = document.getElementById('video-description').value.trim() || 'Watch this amazing content from our parish community.';
  
  if (!title || !iframe) {
    alert('Please fill in all required fields');
    return;
  }
  
  if (!iframe.includes('<iframe')) {
    alert('Please enter a valid iframe embed code');
    return;
  }
  
  try {
    // Store video data for home page
    const homeVideos = JSON.parse(localStorage.getItem('homeVideos') || '[]');
    const videoData = {
      id: Date.now(),
      title: title,
      iframe: iframe,
      description: description,
      dateAdded: new Date().toISOString()
    };
    
    homeVideos.unshift(videoData);
    localStorage.setItem('homeVideos', JSON.stringify(homeVideos));
    
    // Keep existing videoGallery for admin display (without admin info)
    const videoGallery = JSON.parse(localStorage.getItem('videoGallery') || '[]');
    videoGallery.unshift(videoData);
    localStorage.setItem('videoGallery', JSON.stringify(videoGallery));
    
    // Log the action
    addActivityLog('create', `added video '${title}'`);
    
    // Refresh the gallery and dashboard
    loadVideoGallery();
    loadDashboard();
    hideVideoUploadForm();
    
    alert('Video added successfully!');
  } catch (error) {
    console.error('Error adding video:', error);
    alert('Error adding video. Please try again.');
  }
}

function loadVideoGallery() {
  try {
    const videoGallery = JSON.parse(localStorage.getItem('videoGallery') || '[]');
    const videos = JSON.parse(localStorage.getItem('videos') || '[]');
    const container = document.getElementById('video-gallery-grid');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    // Load from videoGallery first
    videoGallery.forEach(video => {
      const videoCard = createVideoCard(video);
      container.appendChild(videoCard);
    });
    
    // Load standalone videos from videos array
    videos.forEach((iframe, index) => {
      // Check if this iframe is already in videoGallery
      const existsInGallery = videoGallery.some(v => v.iframe === iframe);
      if (!existsInGallery) {
        const standaloneVideo = {
          id: 'standalone_' + index,
          title: `Video ${index + 1}`,
          iframe: iframe,
          description: 'Added via quick upload',
          dateAdded: new Date().toISOString(),
          addedBy: 'Admin',
          isStandalone: true
        };
        const videoCard = createVideoCard(standaloneVideo);
        container.appendChild(videoCard);
      }
    });
    
    if (videoGallery.length === 0 && videos.length === 0) {
      container.innerHTML = '<div class="no-videos"><p>No videos uploaded yet. Click "Add Video" to add your first video.</p></div>';
    }
  } catch (error) {
    console.error('Error loading video gallery:', error);
  }
}

function createVideoCard(video) {
  const card = document.createElement('div');
  card.className = 'video-card';
  
  const videoEmbed = video.iframe || createVideoEmbed(video.url || '');
  const formattedDate = new Date(video.dateAdded).toLocaleDateString();
  
  card.innerHTML = `
    <div class="video-preview">
      ${videoEmbed}
    </div>
    <div class="video-info">
      <h4>${video.title}</h4>
      ${video.description ? `<p class="video-description">${video.description}</p>` : ''}
      <div class="video-meta">
        <span class="video-date">Added: ${formattedDate}</span>
        <span class="video-author">By: ${video.addedBy}</span>
      </div>
      <div class="video-actions">
        <button class="edit-btn" onclick="editVideo(${video.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </button>
        <button class="delete-btn" onclick="deleteVideo(${video.id}, '${video.title}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3,6 5,6 21,6"/>
            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
          </svg>
          Delete
        </button>
      </div>
    </div>
  `;
  
  return card;
}

function createVideoEmbed(url) {
  if (!url) return '<div class="video-placeholder">No video available</div>';
  
  // Handle iframe embeds first
  if (url.includes('<iframe')) {
    return url;
  }
  
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
      return `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    }
  }
  
  // Handle direct video URLs
  if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')) {
    return `<video controls><source src="${url}" type="video/mp4">Your browser does not support the video tag.</video>`;
  }
  
  // Fallback
  return `<div class="video-placeholder">Video: <a href="${url}" target="_blank">${url}</a></div>`;
}

function editVideoDescription(videoId) {
  const newDescription = prompt('Enter new description:');
  if (!newDescription) return;
  
  try {
    // Update in videoGallery
    const videoGallery = JSON.parse(localStorage.getItem('videoGallery') || '[]');
    const videoIndex = videoGallery.findIndex(v => v.id === videoId);
    
    if (videoIndex !== -1) {
      videoGallery[videoIndex].description = newDescription;
      localStorage.setItem('videoGallery', JSON.stringify(videoGallery));
    }
    
    // Update in homeVideos
    const homeVideos = JSON.parse(localStorage.getItem('homeVideos') || '[]');
    const homeIndex = homeVideos.findIndex(v => v.id === videoId);
    
    if (homeIndex !== -1) {
      homeVideos[homeIndex].description = newDescription;
      localStorage.setItem('homeVideos', JSON.stringify(homeVideos));
    }
    
    addActivityLog('update', `updated video description`);
    loadVideoGallery();
    alert('Description updated successfully!');
  } catch (error) {
    console.error('Error editing description:', error);
  }
}

function deleteVideo(videoId, videoTitle) {
  if (!confirm(`Are you sure you want to delete the video "${videoTitle}"?`)) {
    return;
  }
  
  try {
    // Handle standalone videos (from videos array)
    if (videoId.toString().startsWith('standalone_')) {
      const index = parseInt(videoId.replace('standalone_', ''));
      const videos = JSON.parse(localStorage.getItem('videos') || '[]');
      if (videos[index]) {
        videos.splice(index, 1);
        localStorage.setItem('videos', JSON.stringify(videos));
      }
    } else {
      // Handle videoGallery videos
      const videoGallery = JSON.parse(localStorage.getItem('videoGallery') || '[]');
      const videoToDelete = videoGallery.find(v => v.id === videoId);
      const filteredGallery = videoGallery.filter(v => v.id !== videoId);
      
      localStorage.setItem('videoGallery', JSON.stringify(filteredGallery));
      
      // Also remove from videos array if it exists
      if (videoToDelete && videoToDelete.iframe) {
        const videos = JSON.parse(localStorage.getItem('videos') || '[]');
        const filteredVideos = videos.filter(v => v !== videoToDelete.iframe);
        localStorage.setItem('videos', JSON.stringify(filteredVideos));
      }
    }
    
    addActivityLog('delete', `deleted video '${videoTitle}'`);
    loadVideoGallery();
    loadDashboard();
    
    alert('Video deleted successfully!');
  } catch (error) {
    console.error('Error deleting video:', error);
    alert('Error deleting video. Please try again.');
  }
}

// Placeholder functions for other sections
function loadMassSchedule() {
  // Placeholder for mass schedule functionality
}

function loadNewsItems() {
  // Placeholder for news items functionality
}

function loadVideoData() {
  // Placeholder for existing video data functionality
}

function loadPriestMessage() {
  // Placeholder for priest message functionality
}