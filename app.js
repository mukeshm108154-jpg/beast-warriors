/* -------------------------------------------------------------
   Beast Warrior Fitness - Interactive JS Engine
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Navigation Sticky Header & Active Links
  // ==========================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Sticky header appearance
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scrollspy: Highlight active link based on viewport scroll
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150; // offset header height
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // ==========================================
  // 2. Mobile Drawer Navigation
  // ==========================================
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent main page scrolling
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = ''; // Restore page scrolling
  }

  mobileNavToggle.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // ==========================================
  // 3. Scroll Reveal & Animated Stats Counter
  // ==========================================
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        
        // Trigger stats animation if entry is the stats grid
        if (entry.target.classList.contains('hero-stats-grid')) {
          animateStats();
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  scrollRevealElements.forEach(elem => {
    revealObserver.observe(elem);
  });

  // Numbers count-up function
  function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const countTo = target;
      let current = 0;
      let duration = 1500; // ms
      let stepTime = Math.abs(Math.floor(duration / countTo));
      
      // Safety limit for high numbers to prevent performance lag
      if (stepTime < 5) stepTime = 5;
      const increment = Math.ceil(countTo / (duration / stepTime));

      let timer = setInterval(() => {
        current += increment;
        if (current >= countTo) {
          stat.textContent = countTo === 49 ? '4.9' : countTo.toLocaleString() + '+';
          clearInterval(timer);
        } else {
          stat.textContent = countTo === 49 ? (current / 10).toFixed(1) : current.toLocaleString();
        }
      }, stepTime);
    });
  }

  // ==========================================
  // 4. Features/Services Filtering
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const featureCards = document.querySelectorAll('.feature-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active class
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      featureCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Custom card animations on filter
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          // Wait for fadeout animation before hiding completely
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ==========================================
  // 5. Interactive BMI & Transformation Planner
  // ==========================================
  const calculatorForm = document.getElementById('calculator-form');
  const resultsPlaceholder = document.getElementById('results-placeholder');
  const resultsActive = document.getElementById('results-active');
  
  // DOM Results Hooks
  const resBmiVal = document.getElementById('res-bmi-val');
  const resBmiCategory = document.getElementById('res-bmi-category');
  const resBmiPointer = document.getElementById('res-bmi-pointer');
  const resCalories = document.getElementById('res-calories');
  const resProtein = document.getElementById('res-protein');
  const resCarbs = document.getElementById('res-carbs');
  const resFats = document.getElementById('res-fats');
  const resRoutineDesc = document.getElementById('res-routine-desc');
  const resFreq = document.getElementById('res-freq');
  const resFocus = document.getElementById('res-focus');

  // Lock In Action hooks
  const resEmailInput = document.getElementById('res-email');
  const resEmailBtn = document.getElementById('res-email-btn');
  const resEmailFeedback = document.getElementById('res-email-feedback');

  calculatorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const weight = parseFloat(document.getElementById('calc-weight').value);
    const height = parseFloat(document.getElementById('calc-height').value);
    const age = parseInt(document.getElementById('calc-age').value, 10);
    const gender = document.getElementById('calc-gender').value;
    const goal = document.getElementById('calc-goal').value;
    const activityMultiplier = parseFloat(document.getElementById('calc-activity').value);

    // 1. BMI Calculation
    const heightInM = height / 100;
    const bmi = weight / (heightInM * heightInM);
    resBmiVal.textContent = bmi.toFixed(1);

    // 2. BMI Category Diagnostics & Slider Pointer mapping
    // Map BMI range (15 to 35) to pointer left percentage (0 to 100%)
    let pointerPercent = ((bmi - 15) / (35 - 15)) * 100;
    if (pointerPercent < 0) pointerPercent = 0;
    if (pointerPercent > 100) pointerPercent = 100;
    resBmiPointer.style.left = `${pointerPercent}%`;

    resBmiCategory.className = ''; // Reset class
    if (bmi < 18.5) {
      resBmiCategory.textContent = 'Underweight';
      resBmiCategory.classList.add('bmi-catUnder');
    } else if (bmi >= 18.5 && bmi < 25) {
      resBmiCategory.textContent = 'Normal';
      resBmiCategory.classList.add('bmi-catNormal');
    } else if (bmi >= 25 && bmi < 30) {
      resBmiCategory.textContent = 'Overweight';
      resBmiCategory.classList.add('bmi-catOver');
    } else {
      resBmiCategory.textContent = 'Obese';
      resBmiCategory.classList.add('bmi-catObese');
    }

    // 3. Mifflin-St Jeor TDEE Calories Target
    let bmr = 0;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const tdee = bmr * activityMultiplier;
    let calorieTarget = Math.round(tdee);

    // Caloric adjustment based on goals
    if (goal === 'loss') {
      calorieTarget = Math.round(tdee - 500); // 500 kcal deficit
      if (calorieTarget < 1200) calorieTarget = 1200; // Safe threshold limit
    } else if (goal === 'gain') {
      calorieTarget = Math.round(tdee + 300); // 300 kcal surplus
    }
    resCalories.textContent = `${calorieTarget.toLocaleString()} kcal`;

    // 4. Macro Splits Breakdown calculations
    let proteinPct = 0.30, carbPct = 0.40, fatPct = 0.30;
    
    if (goal === 'loss') {
      proteinPct = 0.40; // High protein to preserve muscle mass
      carbPct = 0.35;
      fatPct = 0.25;
    } else if (goal === 'gain') {
      proteinPct = 0.30;
      carbPct = 0.50; // High carbs for workout glycogen fueling
      fatPct = 0.20;
    } else { // General
      proteinPct = 0.25;
      carbPct = 0.55;
      fatPct = 0.20;
    }

    const pGrams = Math.round((calorieTarget * proteinPct) / 4);
    const cGrams = Math.round((calorieTarget * carbPct) / 4);
    const fGrams = Math.round((calorieTarget * fatPct) / 9);

    resProtein.textContent = `${pGrams}g`;
    resCarbs.textContent = `${cGrams}g`;
    resFats.textContent = `${fGrams}g`;

    // 5. Custom Workout Routine recommendations
    if (goal === 'loss') {
      resRoutineDesc.textContent = "To strip body fat efficiently while building definition, we recommend a 5-day cycle: 3 days of High-Intensity CrossFit routines mixed with 2 days of Cardio Interval workouts. Clean nutrition and trainer tracking are key to keeping you disciplined.";
      resFreq.textContent = "5 Days / Week";
      resFocus.textContent = "CrossFit & Fat Burn";
    } else if (goal === 'gain') {
      resRoutineDesc.textContent = "To pack on dense athletic muscle, we advise a 4-day Weight Training split focusing on compound barbell routines (squats, bench, deadlifts). Keep cardio light and prioritize high-protein meals. We highly recommend a trainer to correct posture and increase intensity.";
      resFreq.textContent = "4 Days / Week";
      resFocus.textContent = "Strength & Powerlifting";
    } else {
      resRoutineDesc.textContent = "To boost general stamina, cardiovascular endurance, and flexibility, we recommend a balanced 3-day schedule: 2 days of functional weight training and 1 day of group classes (HIIT/Yoga) combined with steam recovery therapies.";
      resFreq.textContent = "3 Days / Week";
      resFocus.textContent = "Endurance & Recovery";
    }

    // Toggle widgets states view
    resultsPlaceholder.classList.add('hide');
    resultsActive.classList.remove('hide');
    
    // Smooth scroll user focus to view the generated results
    resultsActive.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Lock plan email submit
  resEmailBtn.addEventListener('click', () => {
    const emailVal = resEmailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    resEmailFeedback.className = 'feedback-msg'; // Reset

    if (!emailVal || !emailRegex.test(emailVal)) {
      resEmailFeedback.textContent = "Please enter a valid email address.";
      resEmailFeedback.classList.add('error');
    } else {
      resEmailFeedback.textContent = "Warrior Plan Locked! Check your email inbox in 5 minutes.";
      resEmailFeedback.classList.add('success');
      resEmailInput.value = '';
    }
    
    setTimeout(() => {
      resEmailFeedback.classList.add('hide');
    }, 4000);
  });


  // ==========================================
  // 6. Weekly Class Schedule Engine
  // ==========================================
  const scheduleData = {
    monday: [
      { time: '05:30 AM - 07:00 AM', name: 'Strength & Conditioning', intensity: 'high', trainer: 'John Miller', focus: 'Barbell lifts, squats, compound strength' },
      { time: '08:00 AM - 09:00 AM', name: 'HIIT Burnout', intensity: 'high', trainer: 'Sarah Connor', focus: 'Cardio, circuits, core conditioning' },
      { time: '10:00 AM - 11:30 AM', name: 'Steam Detox Therapy', intensity: 'low', trainer: 'Self-Guided', focus: 'Post-workout muscle recovery, steam' },
      { time: '05:30 PM - 07:00 PM', name: 'Beginner CrossFit Rigs', intensity: 'medium', trainer: 'Dev Anand', focus: 'Battle ropes, kettlebell swings, form' },
      { time: '07:30 PM - 09:00 PM', name: 'Warrior Powerlifting', intensity: 'high', trainer: 'John Miller', focus: 'Heavy squats, deadlifts, bench press' },
      { time: '09:00 PM - 10:00 PM', name: 'Group Conditioning', intensity: 'medium', trainer: 'Sarah Connor', focus: 'Functional bodyweight drills, group energy' }
    ],
    tuesday: [
      { time: '06:00 AM - 07:00 AM', name: 'HIIT Burnout', intensity: 'high', trainer: 'Sarah Connor', focus: 'High intensity cardio intervals, stamina' },
      { time: '08:30 AM - 09:30 AM', name: 'Functional Core Rigs', intensity: 'medium', trainer: 'Dev Anand', focus: 'Planks, twists, suspension bands' },
      { time: '05:30 PM - 07:00 PM', name: 'Strength & Power', intensity: 'high', trainer: 'John Miller', focus: 'Upper body push/pull routine, isolation' },
      { time: '07:30 PM - 09:00 PM', name: 'Elite CrossFit', intensity: 'high', trainer: 'Dev Anand', focus: 'Complex Olympic movements, clean & jerk' },
      { time: '09:00 PM - 10:00 PM', name: 'Steam Detox Therapy', intensity: 'low', trainer: 'Self-Guided', focus: 'Muscle relaxation, circulation recovery' }
    ],
    wednesday: [
      { time: '05:30 AM - 07:00 AM', name: 'Warrior Powerlifting', intensity: 'high', trainer: 'John Miller', focus: 'Deadlifts progression, posture control' },
      { time: '08:00 AM - 09:00 AM', name: 'Cardio Intervals', intensity: 'medium', trainer: 'Sarah Connor', focus: 'Treadmill zones, rowing tempo' },
      { time: '10:00 AM - 11:30 AM', name: 'Steam Detox Therapy', intensity: 'low', trainer: 'Self-Guided', focus: 'Skin cleansing, deep muscle soothing' },
      { time: '05:30 PM - 07:00 PM', name: 'Beginner CrossFit Rigs', intensity: 'medium', trainer: 'Dev Anand', focus: 'Functional gymnastics, pullups' },
      { time: '07:30 PM - 09:00 PM', name: 'Strength & Conditioning', intensity: 'high', trainer: 'John Miller', focus: 'Kettlebell snatch, clean, endurance' },
      { time: '09:00 PM - 10:00 PM', name: 'Group Yoga & Flex', intensity: 'low', trainer: 'Anjali Shah', focus: 'Deep flexibility, joint mobility, breathing' }
    ],
    thursday: [
      { time: '06:00 AM - 07:00 AM', name: 'HIIT Burnout', intensity: 'high', trainer: 'Sarah Connor', focus: 'Cardio core blast, calorie burn' },
      { time: '08:30 AM - 09:30 AM', name: 'Strength & Power', intensity: 'high', trainer: 'John Miller', focus: 'Leg hypertrophy focus, squats, lunges' },
      { time: '05:30 PM - 07:00 PM', name: 'Functional Core Rigs', intensity: 'medium', trainer: 'Dev Anand', focus: 'Athletic endurance, agility ladders' },
      { time: '07:30 PM - 09:00 PM', name: 'Elite CrossFit', intensity: 'high', trainer: 'Dev Anand', focus: 'AMRAP routines, thrusters, rope climbs' },
      { time: '09:00 PM - 10:00 PM', name: 'Steam Detox Therapy', intensity: 'low', trainer: 'Self-Guided', focus: 'De-stress, circulation release' }
    ],
    friday: [
      { time: '05:30 AM - 07:00 AM', name: 'Strength & Conditioning', intensity: 'high', trainer: 'John Miller', focus: 'Full body circuit, high volume load' },
      { time: '08:00 AM - 09:00 AM', name: 'HIIT Burnout', intensity: 'high', trainer: 'Sarah Connor', focus: 'Tabata rounds, calorie shredding' },
      { time: '10:00 AM - 11:30 AM', name: 'Steam Detox Therapy', intensity: 'low', trainer: 'Self-Guided', focus: 'End of week recovery focus' },
      { time: '05:30 PM - 07:00 PM', name: 'Beginner CrossFit Rigs', intensity: 'medium', trainer: 'Dev Anand', focus: 'Functional basics, box jumps, scaling' },
      { time: '07:30 PM - 09:00 PM', name: 'Warrior Powerlifting', intensity: 'high', trainer: 'John Miller', focus: 'Bench press maxout, safety spotters' },
      { time: '09:00 PM - 10:00 PM', name: 'Group Conditioning', intensity: 'medium', trainer: 'Sarah Connor', focus: 'Fun team workouts, partner drills' }
    ],
    saturday: [
      { time: '06:00 AM - 07:30 AM', name: 'Elite CrossFit', intensity: 'high', trainer: 'Dev Anand', focus: 'Saturday Warrior WOD challenges' },
      { time: '08:30 AM - 10:00 AM', name: 'Strength & Power', intensity: 'high', trainer: 'John Miller', focus: 'SBD workout, compound benchmarks' },
      { time: '10:30 AM - 12:00 PM', name: 'Steam Detox Therapy', intensity: 'low', trainer: 'Self-Guided', focus: 'General detox, mental stress relief' },
      { time: '05:00 PM - 06:30 PM', name: 'Group Conditioning', intensity: 'medium', trainer: 'Sarah Connor', focus: 'Circuit sweep, metabolic conditioning' },
      { time: '07:00 PM - 08:30 PM', name: 'Stretch & Recovery Yoga', intensity: 'low', trainer: 'Anjali Shah', focus: 'Therapeutic mobility, joint safety checks' }
    ]
  };

  const scheduleTabs = document.querySelectorAll('#schedule-tabs .tab-item');
  const scheduleTbody = document.getElementById('schedule-tbody');
  const scheduleSearch = document.getElementById('schedule-search');
  
  let currentActiveDay = 'monday';
  let activeClassesList = [];

  function loadDaySchedule(dayName) {
    currentActiveDay = dayName;
    activeClassesList = scheduleData[dayName] || [];
    renderScheduleTable(activeClassesList);
  }

  function renderScheduleTable(classes) {
    if (classes.length === 0) {
      scheduleTbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center" style="color: var(--text-muted); padding: 2.5rem;">No classes found matching search criteria.</td>
        </tr>
      `;
      return;
    }

    scheduleTbody.innerHTML = classes.map(cls => {
      let intensityClass = 'medium';
      if (cls.intensity === 'high') intensityClass = 'high';
      if (cls.intensity === 'low') intensityClass = 'low';

      return `
        <tr>
          <td class="schedule-time">${cls.time}</td>
          <td class="schedule-class">${cls.name}</td>
          <td>
            <span class="schedule-intensity ${intensityClass}">${cls.intensity}</span>
          </td>
          <td class="schedule-trainer">${cls.trainer}</td>
          <td class="schedule-focus">${cls.focus}</td>
          <td>
            <a href="#contact" class="btn btn-outline btn-sm">Book Trial</a>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Click handler on tabs
  scheduleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      scheduleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const day = tab.getAttribute('data-day');
      loadDaySchedule(day);

      // Clear search on tab switch for better UX
      scheduleSearch.value = '';
    });
  });

  // Filter Search handler
  scheduleSearch.addEventListener('input', () => {
    const query = scheduleSearch.value.trim().toLowerCase();
    
    if (!query) {
      renderScheduleTable(activeClassesList);
      return;
    }

    const filtered = activeClassesList.filter(cls => {
      return cls.name.toLowerCase().includes(query) || 
             cls.trainer.toLowerCase().includes(query) || 
             cls.focus.toLowerCase().includes(query);
    });

    renderScheduleTable(filtered);
  });

  // Initialize schedule on page load
  loadDaySchedule('monday');


  // ==========================================
  // 7. Testimonial Review Carousel/Slider
  // ==========================================
  const testimonials = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('#slider-dots .dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  let currentReviewIndex = 0;
  let autoSlideTimer;

  function showReview(index) {
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentReviewIndex = index;
  }

  function nextReview() {
    let nextIndex = currentReviewIndex + 1;
    if (nextIndex >= testimonials.length) nextIndex = 0;
    showReview(nextIndex);
    resetAutoSlide();
  }

  function prevReview() {
    let prevIndex = currentReviewIndex - 1;
    if (prevIndex < 0) prevIndex = testimonials.length - 1;
    showReview(prevIndex);
    resetAutoSlide();
  }

  nextBtn.addEventListener('click', nextReview);
  prevBtn.addEventListener('click', prevReview);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      showReview(idx);
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    autoSlideTimer = setInterval(nextReview, 8000); // cycle review every 8 seconds
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  // Initialize slider auto rotation
  startAutoSlide();


  // ==========================================
  // 8. FAQ Accordion Mechanism
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other accordion items for clean accordion UX
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-content').style.maxHeight = null;
          otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        content.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        // dynamically set max height based on scroll height
        content.style.maxHeight = content.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // ==========================================
  // 9. Contact / Booking Form Validator
  // ==========================================
  const bookingForm = document.getElementById('booking-form');
  const successModal = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close');
  const modalCloseBtn = document.getElementById('success-modal-btn');
  
  // Successful Modal Display hooks
  const successUserName = document.getElementById('success-user-name');
  const successUserPhone = document.getElementById('success-user-phone');

  // Fields hooks
  const fields = {
    name: {
      input: document.getElementById('user-name'),
      error: document.getElementById('name-error'),
      validate: (val) => val.trim().length >= 3
    },
    phone: {
      input: document.getElementById('user-phone'),
      error: document.getElementById('phone-error'),
      // validates Indian mobile format (10 digits starting with 6-9)
      validate: (val) => /^[6-9]\d{9}$/.test(val.trim())
    },
    email: {
      input: document.getElementById('user-email'),
      error: document.getElementById('email-error'),
      // Optional check, only validate if user enters something
      validate: (val) => {
        if (!val.trim()) return true; 
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
      }
    }
  };

  // Real-time visual feedback on typing/blur
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    
    const checkValidation = () => {
      const isValid = field.validate(field.input.value);
      if (isValid) {
        field.input.classList.remove('invalid');
        field.input.classList.add('valid');
        field.error.style.display = 'none';
      } else {
        field.input.classList.remove('valid');
        field.input.classList.add('invalid');
        // only show error message if input has content (prevent aggressive default errors)
        if (field.input.value.trim() !== '') {
          field.error.style.display = 'block';
        }
      }
      return isValid;
    };

    field.input.addEventListener('blur', checkValidation);
    field.input.addEventListener('input', () => {
      // remove invalid highlighting when user corrects values
      if (field.validate(field.input.value)) {
        field.input.classList.remove('invalid');
        field.input.classList.add('valid');
        field.error.style.display = 'none';
      }
    });
  });

  // Submit Handler
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;

    // Validate all fields
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      const isValid = field.validate(field.input.value);
      
      if (!isValid) {
        isFormValid = false;
        field.input.classList.add('invalid');
        field.error.style.display = 'block';
      }
    });

    if (isFormValid) {
      // Form values gather
      const nameValue = fields.name.input.value.trim();
      const phoneValue = fields.phone.input.value.trim();

      // Show success modal & inject fields values
      successUserName.textContent = nameValue;
      successUserPhone.textContent = phoneValue;
      
      successModal.classList.add('open');
      document.body.style.overflow = 'hidden'; // lock page scroll

      // Reset form
      bookingForm.reset();
      Object.keys(fields).forEach(key => {
        fields[key].input.classList.remove('valid', 'invalid');
      });
    }
  });

  // Close Modal mechanisms
  function closeModal() {
    successModal.classList.remove('open');
    document.body.style.overflow = ''; // unlock scroll
  }

  modalClose.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      closeModal();
    }
  });


  // ==========================================
  // 9.5. Pricing Toggle & Confetti Switcher
  // ==========================================
  const toggleMonthly = document.getElementById('toggle-monthly');
  const toggleAnnual = document.getElementById('toggle-annual');
  const togglePill = document.getElementById('toggle-pill');
  
  const priceStarter = document.getElementById('price-starter');
  const priceProfessional = document.getElementById('price-professional');
  const priceEnterprise = document.getElementById('price-enterprise');

  const billingStarter = document.getElementById('billing-starter');
  const billingProfessional = document.getElementById('billing-professional');
  const billingEnterprise = document.getElementById('billing-enterprise');

  let currentPricingMode = 'monthly'; // 'monthly' or 'annual'

  function animatePrice(el, endVal) {
    const startVal = parseInt(el.textContent, 10);
    if (startVal === endVal) return;
    
    let current = startVal;
    const steps = 8;
    const stepDuration = 20; // total 160ms animation
    const increment = (endVal - startVal) / steps;
    let stepCount = 0;

    let priceTimer = setInterval(() => {
      current += increment;
      stepCount++;
      if (stepCount >= steps) {
        el.textContent = endVal;
        clearInterval(priceTimer);
      } else {
        el.textContent = Math.round(current);
      }
    }, stepDuration);
  }

  function updatePricing(mode) {
    if (currentPricingMode === mode) return;
    currentPricingMode = mode;

    if (mode === 'monthly') {
      toggleMonthly.classList.add('active');
      toggleAnnual.classList.remove('active');
      
      // Move toggle pill
      togglePill.style.transform = 'translateX(0px)';
      togglePill.style.width = '110px';

      // Update pricing values
      animatePrice(priceStarter, parseInt(priceStarter.getAttribute('data-monthly'), 10));
      animatePrice(priceProfessional, parseInt(priceProfessional.getAttribute('data-monthly'), 10));
      animatePrice(priceEnterprise, parseInt(priceEnterprise.getAttribute('data-monthly'), 10));

      // Update subtexts
      billingStarter.textContent = 'Billed Monthly';
      billingProfessional.textContent = 'Billed Monthly';
      billingEnterprise.textContent = 'Billed Monthly';

    } else {
      toggleMonthly.classList.remove('active');
      toggleAnnual.classList.add('active');

      // Move toggle pill
      togglePill.style.transform = 'translateX(110px)';
      togglePill.style.width = '180px';

      // Update pricing values
      animatePrice(priceStarter, parseInt(priceStarter.getAttribute('data-annual'), 10));
      animatePrice(priceProfessional, parseInt(priceProfessional.getAttribute('data-annual'), 10));
      animatePrice(priceEnterprise, parseInt(priceEnterprise.getAttribute('data-annual'), 10));

      // Update subtexts
      billingStarter.textContent = 'Billed Annually';
      billingProfessional.textContent = 'Billed Annually';
      billingEnterprise.textContent = 'Billed Annually';

      // Confetti Explosion
      if (typeof confetti === 'function') {
        const rect = toggleAnnual.getBoundingClientRect();
        const originX = (rect.left + rect.width / 2) / window.innerWidth;
        const originY = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 80,
          spread: 80,
          origin: { x: originX, y: originY },
          colors: ['#ff6f00', '#ffffff', '#ff3d00'],
          ticks: 300,
          gravity: 1.2,
          decay: 0.94,
          startVelocity: 30
        });
      }
    }
  }

  toggleMonthly.addEventListener('click', () => updatePricing('monthly'));
  toggleAnnual.addEventListener('click', () => updatePricing('annual'));

  // ==========================================
  // 9.75. AI Gym Trainer Chatbot
  // ==========================================
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotPanel = document.getElementById('chatbot-panel');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotForm = document.getElementById('chatbot-form');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const openChatbotBtn = document.getElementById('open-chatbot-btn');

  const aiReplies = [
    {
      test: /warm[- ]?up|stretch|mobility/i,
      reply: 'Start with dynamic stretches, bodyweight lunges and jump rope. Bolt recommends 5–7 minutes of movement prep before heavy lifts.'
    },
    {
      test: /lose|fat|shred|weight/i,
      reply: 'For fat loss, Bolt suggests high-intensity interval training combined with strength circuits and a protein-forward meal plan.'
    },
    {
      test: /gain|muscle|bulk/i,
      reply: 'To build muscle, focus on compound lifts, progressive overload, and a calorie surplus. Bolt also recommends 1-on-1 coaching for best results.'
    },
    {
      test: /steam|recovery|relax/i,
      reply: 'Use the steam room after heavy sessions to relax muscles and support recovery. Hydrate well and avoid harsh heat if you have any injuries.'
    },
    {
      test: /class|schedule|timetable/i,
      reply: 'Check the weekly schedule for High-Intensity sessions, CrossFit rigs, and strength classes. Bolt recommends booking the evening warrior slots early.'
    },
    {
      test: /timings|hours|open/i,
      reply: 'We are open daily from 5:00 AM to 11:00 PM. Bolt suggests training during off-peak hours if you want the most focused gym experience.'
    },
    {
      test: /membership|plan|price/i,
      reply: 'Our Professional plan offers the best value for committed warriors, with unlimited sessions, diagnostics, and priority trainer access.'
    }
  ];

  function toggleChatPanel(open) {
    if (open) {
      chatbotPanel.classList.add('open');
      chatbotPanel.setAttribute('aria-hidden', 'false');
    } else {
      chatbotPanel.classList.remove('open');
      chatbotPanel.setAttribute('aria-hidden', 'true');
    }
  }

  function appendChatMessage(message, sender = 'bot') {
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${sender}-message`;
    messageEl.innerHTML = `<p>${message}</p>`;
    chatbotMessages.appendChild(messageEl);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function getChatReply(userText) {
    const normalized = userText.trim();
    if (!normalized) {
      return 'Ask me anything about workouts, classes, membership plans or recovery tips.';
    }

    for (const item of aiReplies) {
      if (item.test.test(normalized)) {
        return item.reply;
      }
    }

    return 'Bolt is analyzing your question... Try asking about goal planning, recovery, class times, or membership guidance.';
  }

  chatbotToggle.addEventListener('click', () => toggleChatPanel(!chatbotPanel.classList.contains('open')));
  chatbotClose.addEventListener('click', () => toggleChatPanel(false));
  openChatbotBtn.addEventListener('click', (event) => {
    event.preventDefault();
    toggleChatPanel(true);
    chatbotInput.focus();
  });

  chatbotForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userText = chatbotInput.value.trim();
    if (!userText) return;

    appendChatMessage(userText, 'user');
    chatbotInput.value = '';

    const reply = getChatReply(userText);
    setTimeout(() => appendChatMessage(reply, 'bot'), 450);
  });


  // ==========================================
  // 10. Scroll to Top Button
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

});
