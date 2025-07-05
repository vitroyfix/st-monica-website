// Load schedule data
async function loadSchedule() {
  try {
    const response = await fetch('data/schedule.json');
    const scheduleData = await response.json();
    const container = document.getElementById('mass-schedule');
    
    scheduleData.forEach(item => {
      const card = document.createElement('div');
      card.className = 'schedule-card';
      
      card.innerHTML = `
        <h3>${item.day}</h3>
        ${item.times.map(time => `<div class="time">${time}</div>`).join('')}
        ${item.type ? `<div class="type">${item.type}</div>` : ''}
      `;
      
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading schedule:', error);
  }
}

// Load carousel data
async function loadCarousel() {
  try {
    const response = await fetch('data/carousel.json');
    const carouselData = await response.json();
    const container = document.getElementById('carousel-slider');
    
    // Create slides
    carouselData.forEach(item => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      
      const link = document.createElement('a');
      link.href = item.link || '#';
      
      link.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
      `;
      
      slide.appendChild(link);
      container.appendChild(slide);
    });
    
    // Auto-scroll carousel
    let currentIndex = 0;
    const slides = container.querySelectorAll('.carousel-slide');
    
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      const slideWidth = slides[0].offsetWidth + 20; // slide width + gap
      container.scrollTo({
        left: currentIndex * slideWidth,
        behavior: 'smooth'
      });
    }, 5000);
    
  } catch (error) {
    console.error('Error loading carousel:', error);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  loadSchedule();
  loadCarousel();
});