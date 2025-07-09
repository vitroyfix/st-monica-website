// Bible verses for random selection
const bibleVerses = [
  {
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    reference: "Jeremiah 29:11"
  },
  {
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9"
  },
  {
    text: "Trust in the Lord with all your heart and lean not on your own understanding.",
    reference: "Proverbs 3:5"
  },
  {
    text: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13"
  },
  {
    text: "The Lord is my shepherd, I lack nothing.",
    reference: "Psalm 23:1"
  },
  {
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    reference: "Matthew 11:28"
  },
  {
    text: "And we know that in all things God works for the good of those who love him.",
    reference: "Romans 8:28"
  }
];

// Form submission handler
document.getElementById('registration-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  const memberData = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    regNumber: formData.get('regNumber'),
    dateJoined: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };
  
  // Generate membership card
  generateMembershipCard(memberData);
});

function generateMembershipCard(memberData) {
  // Hide registration form with animation
  const regSection = document.getElementById('registration-section');
  const cardSection = document.getElementById('membership-card');
  
  regSection.style.opacity = '0';
  regSection.style.transform = 'translateY(-20px)';
  
  setTimeout(() => {
    regSection.classList.add('hidden');
    cardSection.classList.remove('hidden');
    
    // Set member information
    document.getElementById('card-name').textContent = memberData.fullName;
    document.getElementById('join-date').textContent = `Member since ${memberData.dateJoined}`;
    document.getElementById('reg-number').textContent = `Reg: ${memberData.regNumber}`;
    document.getElementById('member-email').textContent = memberData.email;
    document.getElementById('member-phone').textContent = memberData.phone;
    
    // Select random Bible verse from 5 verses
    const randomVerse = bibleVerses[Math.floor(Math.random() * Math.min(5, bibleVerses.length))];
    const verseElement = document.getElementById('bible-verse');
    verseElement.innerHTML = `
      <p>"${randomVerse.text}"</p>
      <span>- ${randomVerse.reference}</span>
    `;
    
    // Generate QR code
    generateQRCode(memberData);
    
    // Store member data
    storeMemberData(memberData);
    
    // Add elegant card entrance animation
    setTimeout(() => {
      const card = document.querySelector('.card');
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px) scale(0.9)';
      card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, 100);
    }, 200);
  }, 300);
}

function generateQRCode(memberData) {
  const qrData = `Name: ${memberData.fullName}\nJoined: ${memberData.dateJoined}\nChurch: St. Monica Catholic Church`;
  const qrContainer = document.getElementById('qr-code');
  
  // Use QR Server API with better quality
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=55x55&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=8B0000`;
  
  qrContainer.innerHTML = `<img src="${qrUrl}" alt="Member QR Code" style="width: 90%; height: 90%; border-radius: 4px;">`;
}

function storeMemberData(memberData) {
  const members = JSON.parse(localStorage.getItem('churchMembers') || '[]');
  const newMember = {
    ...memberData,
    id: 'SM' + Date.now().toString().slice(-6),
    registrationDate: new Date().toISOString(),
    status: 'active'
  };
  
  members.push(newMember);
  localStorage.setItem('churchMembers', JSON.stringify(members));
}

function printCard() {
  window.print();
}

function downloadCard() {
  const card = document.querySelector('.card');
  
  html2canvas(card, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `${document.getElementById('card-name').textContent.replace(/\s+/g, '_')}_membership_card.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
}

function registerAnother() {
  // Hide card with animation
  const regSection = document.getElementById('registration-section');
  const cardSection = document.getElementById('membership-card');
  
  cardSection.style.opacity = '0';
  cardSection.style.transform = 'translateY(-20px)';
  
  setTimeout(() => {
    cardSection.classList.add('hidden');
    regSection.classList.remove('hidden');
    regSection.style.opacity = '1';
    regSection.style.transform = 'translateY(0)';
    
    // Reset form
    document.getElementById('registration-form').reset();
    
    // Reset submit button
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.innerHTML = '<span class="btn-icon">✚</span>Register & Generate Membership Card';
    submitBtn.disabled = false;
  }, 300);
}

// Add smooth animations
document.addEventListener('DOMContentLoaded', function() {
  // Animate form inputs
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'translateY(0)';
    });
  });
  
  // Add loading animation to submit button
  const submitBtn = document.querySelector('.submit-btn');
  const form = document.getElementById('registration-form');
  
  form.addEventListener('submit', function(e) {
    submitBtn.innerHTML = 'Generating Card...';
    submitBtn.disabled = true;
  });
});