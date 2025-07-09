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
  const url = document.getElementById('video-url').value.trim();
  const description = document.getElementById('video-description').value.trim();
  
  if (!title || !url) {
    alert('Please fill in all required fields');
    return;
  }
  
  try {
    const videoGallery = JSON.parse(localStorage.getItem('videoGallery') || '[]');
    
    const newVideo = {
      id: Date.now(),
      title: title,
      url: url,
      description: description,
      dateAdded: new Date().toISOString(),
      addedBy: getAdminUsername()
    };
    
    videoGallery.unshift(newVideo);
    localStorage.setItem('videoGallery', JSON.stringify(videoGallery));
    
    // Log the action
    addActivityLog('create', `uploaded video '${title}'`);
    
    // Refresh the gallery and dashboard
    loadVideoGallery();
    loadDashboard();
    hideVideoUploadForm();
    
    alert('Video uploaded successfully!');
  } catch (error) {
    console.error('Error uploading video:', error);
    alert('Error uploading video. Please try again.');
  }
}

function loadVideoGallery() {
  try {
    const videoGallery = JSON.parse(localStorage.getItem('videoGallery') || '[]');
    const container = document.getElementById('video-gallery-grid');
    
    if (!container) return;
    
    if (videoGallery.length === 0) {
      container.innerHTML = '<div class="no-videos"><p>No videos uploaded yet. Click "Upload Video" to add your first video.</p></div>';
      return;
    }
    
    container.innerHTML = '';
    
    videoGallery.forEach(video => {
      const videoCard = createVideoCard(video);
      container.appendChild(videoCard);
    });
  } catch (error) {
    console.error('Error loading video gallery:', error);
  }
}

function createVideoCard(video) {
  const card = document.createElement('div');
  card.className = 'video-card';
  
  const videoEmbed = createVideoEmbed(video.url);
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
  
  // Handle iframe embeds
  if (url.includes('<iframe')) {
    return url;
  }
  
  // Fallback
  return `<div class="video-placeholder">Video: <a href="${url}" target="_blank">${url}</a></div>`;
}

function editVideo(videoId) {
  // Simple edit functionality - could be expanded
  const newTitle = prompt('Enter new title:');
  if (!newTitle) return;
  
  try {
    const videoGallery = JSON.parse(localStorage.getItem('videoGallery') || '[]');
    const videoIndex = videoGallery.findIndex(v => v.id === videoId);
    
    if (videoIndex !== -1) {
      const oldTitle = videoGallery[videoIndex].title;
      videoGallery[videoIndex].title = newTitle;
      localStorage.setItem('videoGallery', JSON.stringify(videoGallery));
      
      addActivityLog('update', `edited video title from '${oldTitle}' to '${newTitle}'`);
      loadVideoGallery();
    }
  } catch (error) {
    console.error('Error editing video:', error);
  }
}

function deleteVideo(videoId, videoTitle) {
  if (!confirm(`Are you sure you want to delete the video "${videoTitle}"?`)) {
    return;
  }
  
  try {
    const videoGallery = JSON.parse(localStorage.getItem('videoGallery') || '[]');
    const filteredGallery = videoGallery.filter(v => v.id !== videoId);
    
    localStorage.setItem('videoGallery', JSON.stringify(filteredGallery));
    
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