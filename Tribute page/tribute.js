// Play button functionality
const playButton = document.getElementById('playButton');

playButton.addEventListener('click', function() {
    // Add animation effect
    playButton.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        playButton.style.transform = 'scale(1)';
    }, 200);
    
    // Alert message (you can replace this with actual video functionality)
    alert('This would play a video tribute to Steve Jobs. You can link this to a YouTube video or any video player.');
    
    // Example: Redirect to a YouTube video
    // window.open('https://www.youtube.com/watch?v=your-video-id', '_blank');
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations for sections
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
const sections = document.querySelectorAll('.quote-section, .biography, .achievements');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Timeline items animation
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-50px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    
    observer.observe(item);
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effect to quote image
const quoteImage = document.querySelector('.quote-image img');
if (quoteImage) {
    quoteImage.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) rotate(2deg)';
    });
    
    quoteImage.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
}

// Dynamic year counter animation
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown') {
        window.scrollBy({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    } else if (e.key === 'ArrowUp') {
        window.scrollBy({
            top: -window.innerHeight,
            behavior: 'smooth'
        });
    }
});

// Loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('Tribute page loaded successfully!');