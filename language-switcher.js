// language-switcher.js
// Save this file in your project root directory

// Wait for Google Translate to fully load
let translateLoaded = false;
let loadCheckInterval;

// Initialize Google Translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'id',
    includedLanguages: 'en,id',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
}

// Check if Google Translate has loaded
function checkTranslateLoaded() {
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    translateLoaded = true;
    clearInterval(loadCheckInterval);
    console.log('✅ Google Translate loaded successfully');
  }
}

// Main language change function
function changeLanguage(lang) {
  console.log('🌍 Attempting to change language to:', lang);
  
  // Update active button state
  document.querySelectorAll('.lang-btn, .mobile-lang-switcher button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  if (window.event && window.event.target) {
    window.event.target.classList.add('active');
  }

  // Function to trigger the translation
  function triggerTranslation() {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      console.log('✅ Google Translate found, changing to:', lang);
      select.value = lang;
      select.dispatchEvent(new Event('change'));
      return true;
    }
    return false;
  }

  // Try to trigger translation immediately
  if (!triggerTranslation()) {
    console.log('⏳ Google Translate not ready, waiting...');
    // If not available, wait and retry
    let retryCount = 0;
    const maxRetries = 10;
    
    const retryInterval = setInterval(() => {
      retryCount++;
      if (triggerTranslation() || retryCount >= maxRetries) {
        clearInterval(retryInterval);
        if (retryCount >= maxRetries) {
          console.error('❌ Google Translate failed to load after multiple attempts');
          alert('Translation service is loading. Please try again in a moment.');
        }
      }
    }, 500);
  }
}

// Test function to check if Google Translate is working
function testTranslate() {
  const select = document.querySelector('.goog-te-combo');
  console.log('Google Translate element:', select);
  if (select) {
    alert('✅ Google Translate is loaded! Available languages: ' + select.options.length);
    console.log('Available options:', select.options);
  } else {
    alert('❌ Google Translate NOT loaded yet. Check console for errors.');
    console.log('Google Translate widget not found. Check if script is loaded.');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Language switcher initialized');
  
  // Start checking for Google Translate
  loadCheckInterval = setInterval(checkTranslateLoaded, 500);
  
  // Stop checking after 30 seconds
  setTimeout(() => {
    if (!translateLoaded) {
      clearInterval(loadCheckInterval);
      console.warn('⚠️ Google Translate did not load within 30 seconds');
    }
  }, 30000);
});

// Make functions globally available
window.googleTranslateElementInit = googleTranslateElementInit;
window.changeLanguage = changeLanguage;
window.testTranslate = testTranslate;