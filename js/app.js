// Get DOM elements
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-link');
const getStartedBtn = document.getElementById('getStartedBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const closeLoginBtn = document.getElementById('closeLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const pages = document.querySelectorAll('.page');

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close hamburger menu when clicking a link
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        if (item.id !== 'logoutBtn') {
            e.preventDefault();
        }
        navLinks.classList.remove('active');
        handleNavigation(e);
    });
});

// Get Started button - show login modal
getStartedBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
});

// Close login modal
closeLoginBtn.addEventListener('click', () => {
    loginModal.classList.remove('active');
    loginForm.reset();
    document.getElementById('loginError').style.display = 'none';
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;
    const errorMsg = document.getElementById('loginError');
    
    // Validate form fields
    if (!email || !password || !role) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'Invalid login credentials!';
        return;
    }
    
    // Simple validation (any email and password works for this demo)
    if (email && password && role) {
        // Extract name from email (before @)
        const userName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
        
        // Store user data in localStorage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', userName);
        localStorage.setItem('userRole', role);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Clear form
        loginForm.reset();
        errorMsg.style.display = 'none';
        
        // Redirect to dashboard
        loginModal.classList.remove('active');
        loadDashboard();
    } else {
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'Invalid login credentials!';
    }
});

// Navigation handler
function handleNavigation(e) {
    const target = e.target.getAttribute('data-page');
    
    if (target === 'home' || target === 'features' || target === 'about' || target === 'contact') {
        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));
        
        // Show selected page
        document.getElementById(target).classList.add('active');
        
        // Update active nav link
        navItems.forEach(item => item.classList.remove('active'));
        e.target.classList.add('active');
    }
}

// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn === 'true') {
        loadDashboard();
    }
}

// Load dashboard
function loadDashboard() {
    // Hide all pages
    pages.forEach(page => page.classList.remove('active'));
    
    // Hide home and show dashboard
    document.body.innerHTML = '';
    
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    // Create dashboard HTML
    const dashboardHTML = `
        <link rel="stylesheet" href="css/dashboard.css">
        <div class="dashboard-wrapper">
            <!-- Header -->
            <div class="dashboard-header" style="grid-column: 1 / -1;">
                <div class="header-left">
                    <div class="logo">LifeCare</div>
                </div>
                <div class="header-right">
                    <div class="user-info">
                        <div>
                            <div class="user-name">Hi, ${userName}</div>
                            <div class="user-role">${userRole}</div>
                        </div>
                    </div>
                    <a href="#" class="profile-link" id="profileLink">Profile</a>
                    <button class="logout-btn" id="logoutDashboardBtn">Logout</button>
                </div>
            </div>

            <!-- Sidebar -->
            <aside class="sidebar">
                <ul class="sidebar-menu">
                    <li><a href="#" class="sidebar-link active" data-feature="dashboard">Dashboard</a></li>
                    <li><a href="#" class="sidebar-link" data-feature="academic">Smart Academic Planner</a></li>
                    <li><a href="#" class="sidebar-link" data-feature="health">Health & Wellness</a></li>
                    <li><a href="#" class="sidebar-link" data-feature="mental">Mental Health Support</a></li>
                    <li><a href="#" class="sidebar-link" data-feature="daily">Daily Life Tools</a></li>
                    <li><a href="#" class="sidebar-link" data-feature="support">Student Support</a></li>
                </ul>
            </aside>

            <!-- Main Content -->
            <main class="dashboard-content">
                <div id="dashboardView">
                    <h1>Dashboard Overview</h1>
                    <div class="dashboard-grid">
                        <div class="card" data-feature="academic">
                            <h3>Smart Academic Planner</h3>
                            <div class="card-value">0</div>
                            <div class="card-label">Tasks Pending</div>
                        </div>
                        <div class="card" data-feature="health">
                            <h3>Health & Wellness</h3>
                            <div class="card-value">0</div>
                            <div class="card-label">Health Logs</div>
                        </div>
                        <div class="card" data-feature="mental">
                            <h3>Mental Health</h3>
                            <div class="card-value">0</div>
                            <div class="card-label">Mood Entries</div>
                        </div>
                        <div class="card" data-feature="daily">
                            <h3>Daily Life</h3>
                            <div class="card-value">0</div>
                            <div class="card-label">Tasks Completed</div>
                        </div>
                    </div>
                </div>
                
                <div id="academicView" style="display: none;"></div>
                <div id="healthView" style="display: none;"></div>
                <div id="mentalView" style="display: none;"></div>
                <div id="dailyView" style="display: none;"></div>
                <div id="supportView" style="display: none;"></div>
                <div id="profileView" style="display: none;"></div>
            </main>
        </div>

        <!-- Modals -->
        <div id="detailModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalTitle">Feature</h2>
                    <button class="close-modal" id="closeModalBtn">&times;</button>
                </div>
                <div id="modalBody"></div>
            </div>
        </div>
    `;
    
    document.body.innerHTML = dashboardHTML;
    
    // Re-attach event listeners
    setupDashboardListeners();
}

// Setup dashboard event listeners
function setupDashboardListeners() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const cards = document.querySelectorAll('.card');
    const logoutDashboardBtn = document.getElementById('logoutDashboardBtn');
    const profileLink = document.getElementById('profileLink');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const detailModal = document.getElementById('detailModal');

    // Card click handlers
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const feature = card.getAttribute('data-feature');
            showFeatureModal(feature);
        });
    });

    // Sidebar link handlers
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const feature = link.getAttribute('data-feature');
            
            // Update active link
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show feature or dashboard
            if (feature === 'dashboard') {
                document.getElementById('dashboardView').style.display = 'block';
                document.getElementById('academicView').style.display = 'none';
                document.getElementById('healthView').style.display = 'none';
                document.getElementById('mentalView').style.display = 'none';
                document.getElementById('dailyView').style.display = 'none';
                document.getElementById('supportView').style.display = 'none';
                document.getElementById('profileView').style.display = 'none';
            } else if (feature === 'academic') {
                showAcademicPlanner();
            } else if (feature === 'health') {
                showHealthWellness();
            } else if (feature === 'mental') {
                showMentalHealth();
            } else if (feature === 'daily') {
                showDailyLife();
            } else if (feature === 'support') {
                showStudentSupport();
            }
        });
    });

    // Logout handler
    logoutDashboardBtn.addEventListener('click', () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isLoggedIn');
        location.reload();
    });

    // Profile handler
    profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        showProfile();
    });

    // Close modal
    closeModalBtn.addEventListener('click', () => {
        detailModal.classList.remove('active');
    });

    // Close modal when clicking outside
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            detailModal.classList.remove('active');
        }
    });
}

// Show feature modal
function showFeatureModal(feature) {
    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (feature === 'academic') {
        showAcademicPlanner();
    } else if (feature === 'health') {
        showHealthWellness();
    } else if (feature === 'mental') {
        showMentalHealth();
    } else if (feature === 'daily') {
        showDailyLife();
    }
}

// Smart Academic Planner
function showAcademicPlanner() {
    const view = document.getElementById('academicView');
    view.style.display = 'block';
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('healthView').style.display = 'none';
    document.getElementById('mentalView').style.display = 'none';
    document.getElementById('dailyView').style.display = 'none';
    document.getElementById('supportView').style.display = 'none';
    document.getElementById('profileView').style.display = 'none';

    view.innerHTML = `
        <h1>Smart Academic Planner</h1>
        
        <div class="feature-section">
            <h3>Create New Task</h3>
            <div class="form-group">
                <label>Task Title</label>
                <input type="text" id="taskTitle" placeholder="Enter task title">
            </div>
            <div class="form-group">
                <label>Due Date</label>
                <input type="date" id="taskDate">
            </div>
            <div class="form-group">
                <label>Priority</label>
                <select id="taskPriority">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                </select>
            </div>
            <button class="btn btn-primary" id="addTaskBtn">Add Task</button>
        </div>

        <div class="feature-section">
            <h3>Your Tasks</h3>
            <ul class="feature-list" id="taskList">
                <li>No tasks yet. Create one above!</li>
            </ul>
        </div>

        <div class="feature-section">
            <h3>Class Schedule</h3>
            <p>Calendar view of your classes and clinical schedules (Coming Soon)</p>
        </div>

        <div class="feature-section">
            <h3>Exam Countdown</h3>
            <div class="form-group">
                <label>Exam Name</label>
                <input type="text" id="examName" placeholder="Enter exam name">
            </div>
            <div class="form-group">
                <label>Exam Date</label>
                <input type="date" id="examDate">
            </div>
            <button class="btn btn-primary" id="addExamBtn">Add Exam</button>
            <div id="examCountdown" style="margin-top: 1rem;"></div>
        </div>
    `;

    // Add task button
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        const title = document.getElementById('taskTitle').value;
        const date = document.getElementById('taskDate').value;
        const priority = document.getElementById('taskPriority').value;

        if (title && date) {
            const taskList = document.getElementById('taskList');
            if (taskList.innerHTML.includes('No tasks yet')) {
                taskList.innerHTML = '';
            }
            taskList.innerHTML += `<li>[${priority}] ${title} - Due: ${date}</li>`;
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDate').value = '';
        }
    });

    // Add exam button
    document.getElementById('addExamBtn').addEventListener('click', () => {
        const examName = document.getElementById('examName').value;
        const examDate = document.getElementById('examDate').value;

        if (examName && examDate) {
            const exam = new Date(examDate);
            const today = new Date();
            const daysLeft = Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
            const countdown = document.getElementById('examCountdown');
            countdown.innerHTML = `<strong>${examName}</strong>: ${daysLeft} days remaining`;
        }
    });
}

// Health and Wellness
function showHealthWellness() {
    const view = document.getElementById('healthView');
    view.style.display = 'block';
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('academicView').style.display = 'none';
    document.getElementById('mentalView').style.display = 'none';
    document.getElementById('dailyView').style.display = 'none';
    document.getElementById('supportView').style.display = 'none';
    document.getElementById('profileView').style.display = 'none';

    view.innerHTML = `
        <h1>Health and Wellness Monitoring</h1>

        <div class="feature-section">
            <h3>Water Intake Tracker</h3>
            <div class="form-group">
                <label>Water Intake (ml)</label>
                <input type="number" id="waterIntake" placeholder="Enter amount in ml">
            </div>
            <button class="btn btn-primary" id="addWaterBtn">Log Water</button>
            <p id="waterTotal" style="margin-top: 1rem;">Total: 0 ml</p>
        </div>

        <div class="feature-section">
            <h3>Sleep Monitoring</h3>
            <div class="form-group">
                <label>Sleep Duration (hours)</label>
                <input type="number" id="sleepHours" placeholder="Enter hours of sleep">
            </div>
            <button class="btn btn-primary" id="addSleepBtn">Log Sleep</button>
            <p id="sleepTotal" style="margin-top: 1rem;">Average Sleep: 0 hrs</p>
        </div>

        <div class="feature-section">
            <h3>Medication Reminders</h3>
            <div class="form-group">
                <label>Medication Name</label>
                <input type="text" id="medName" placeholder="Enter medication name">
            </div>
            <div class="form-group">
                <label>Dose</label>
                <input type="text" id="medDose" placeholder="Enter dose">
            </div>
            <div class="form-group">
                <label>Time</label>
                <input type="time" id="medTime">
            </div>
            <button class="btn btn-primary" id="addMedBtn">Set Reminder</button>
            <ul class="feature-list" id="medList"></ul>
        </div>

        <div class="feature-section">
            <h3>Meal and Nutrition Logs</h3>
            <div class="form-group">
                <label>Meal Description</label>
                <textarea id="mealDesc" placeholder="Describe your meal"></textarea>
            </div>
            <div class="form-group">
                <label>Calories (optional)</label>
                <input type="number" id="mealCalories" placeholder="Enter calories">
            </div>
            <button class="btn btn-primary" id="addMealBtn">Log Meal</button>
            <ul class="feature-list" id="mealList"></ul>
        </div>

        <div class="feature-section">
            <h3>Physical Activity Tracking</h3>
            <div class="form-group">
                <label>Activity Type</label>
                <input type="text" id="activityType" placeholder="e.g., Jogging, Swimming">
            </div>
            <div class="form-group">
                <label>Duration (minutes)</label>
                <input type="number" id="activityDuration" placeholder="Enter minutes">
            </div>
            <button class="btn btn-primary" id="addActivityBtn">Log Activity</button>
            <ul class="feature-list" id="activityList"></ul>
        </div>
    `;

    // Water tracking
    let waterTotal = 0;
    document.getElementById('addWaterBtn').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('waterIntake').value);
        if (amount > 0) {
            waterTotal += amount;
            document.getElementById('waterTotal').textContent = `Total: ${waterTotal} ml`;
            document.getElementById('waterIntake').value = '';
        }
    });

    // Sleep tracking
    let sleepEntries = [];
    document.getElementById('addSleepBtn').addEventListener('click', () => {
        const hours = parseFloat(document.getElementById('sleepHours').value);
        if (hours > 0) {
            sleepEntries.push(hours);
            const avg = (sleepEntries.reduce((a, b) => a + b, 0) / sleepEntries.length).toFixed(1);
            document.getElementById('sleepTotal').textContent = `Average Sleep: ${avg} hrs`;
            document.getElementById('sleepHours').value = '';
        }
    });

    // Medication reminders
    document.getElementById('addMedBtn').addEventListener('click', () => {
        const name = document.getElementById('medName').value;
        const dose = document.getElementById('medDose').value;
        const time = document.getElementById('medTime').value;
        if (name && dose && time) {
            document.getElementById('medList').innerHTML += `<li>${name} - ${dose} at ${time}</li>`;
            document.getElementById('medName').value = '';
            document.getElementById('medDose').value = '';
            document.getElementById('medTime').value = '';
        }
    });

    // Meal logging
    document.getElementById('addMealBtn').addEventListener('click', () => {
        const desc = document.getElementById('mealDesc').value;
        const cal = document.getElementById('mealCalories').value;
        if (desc) {
            const calText = cal ? ` (${cal} cal)` : '';
            document.getElementById('mealList').innerHTML += `<li>${desc}${calText}</li>`;
            document.getElementById('mealDesc').value = '';
            document.getElementById('mealCalories').value = '';
        }
    });

    // Activity tracking
    document.getElementById('addActivityBtn').addEventListener('click', () => {
        const type = document.getElementById('activityType').value;
        const duration = document.getElementById('activityDuration').value;
        if (type && duration) {
            document.getElementById('activityList').innerHTML += `<li>${type} - ${duration} minutes</li>`;
            document.getElementById('activityType').value = '';
            document.getElementById('activityDuration').value = '';
        }
    });
}

// Mental Health and Stress Support
function showMentalHealth() {
    const view = document.getElementById('mentalView');
    view.style.display = 'block';
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('academicView').style.display = 'none';
    document.getElementById('healthView').style.display = 'none';
    document.getElementById('dailyView').style.display = 'none';
    document.getElementById('supportView').style.display = 'none';
    document.getElementById('profileView').style.display = 'none';

    view.innerHTML = `
        <h1>Mental Health and Stress Support</h1>

        <div class="feature-section">
            <h3>Mood Tracker</h3>
            <div class="form-group">
                <label>How are you feeling today?</label>
                <select id="moodSelect">
                    <option value="">Select mood</option>
                    <option value="Happy">Happy</option>
                    <option value="Sad">Sad</option>
                    <option value="Stressed">Stressed</option>
                    <option value="Anxious">Anxious</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Motivated">Motivated</option>
                </select>
            </div>
            <button class="btn btn-primary" id="addMoodBtn">Log Mood</button>
            <ul class="feature-list" id="moodList"></ul>
        </div>

        <div class="feature-section">
            <h3>Stress Level Check-in</h3>
            <div class="form-group">
                <label>Stress Level (1-10)</label>
                <input type="range" id="stressLevel" min="1" max="10" value="5">
                <p>Current Level: <span id="stressValue">5</span>/10</p>
            </div>
            <button class="btn btn-primary" id="addStressBtn">Log Stress</button>
        </div>

        <div class="feature-section">
            <h3>Guided Breathing Exercise</h3>
            <p>Follow the visual guide below for a breathing exercise:</p>
            <div class="breathing-container">
                <p>Breathe In... Hold... Breathe Out...</p>
                <div class="breathing-circle"></div>
                <button class="btn btn-primary" id="startBreathingBtn">Start Breathing Exercise</button>
            </div>
        </div>

        <div class="feature-section">
            <h3>Journaling</h3>
            <div class="form-group">
                <label>Daily Prompt: What made you stressed today? Or one thing you're grateful for?</label>
                <textarea id="journalEntry" placeholder="Write your thoughts here..."></textarea>
            </div>
            <button class="btn btn-primary" id="saveJournalBtn">Save Entry</button>
            <ul class="feature-list" id="journalList"></ul>
        </div>
    `;

    // Stress level slider
    document.getElementById('stressLevel').addEventListener('input', (e) => {
        document.getElementById('stressValue').textContent = e.target.value;
    });

    // Mood tracker
    document.getElementById('addMoodBtn').addEventListener('click', () => {
        const mood = document.getElementById('moodSelect').value;
        if (mood) {
            const today = new Date().toLocaleDateString();
            document.getElementById('moodList').innerHTML += `<li>${today}: ${mood}</li>`;
            document.getElementById('moodSelect').value = '';
        }
    });

    // Stress logging
    document.getElementById('addStressBtn').addEventListener('click', () => {
        const level = document.getElementById('stressLevel').value;
        const today = new Date().toLocaleDateString();
        alert(`Stress level ${level}/10 logged for ${today}`);
    });

    // Breathing exercise
    document.getElementById('startBreathingBtn').addEventListener('click', () => {
        alert('Breathing exercise started. Follow the expanding and contracting circle. Breathe in for 4 counts, hold for 4, and breathe out for 4.');
    });

    // Journaling
    document.getElementById('saveJournalBtn').addEventListener('click', () => {
        const entry = document.getElementById('journalEntry').value;
        if (entry) {
            const today = new Date().toLocaleDateString();
            document.getElementById('journalList').innerHTML += `<li>${today}: ${entry}</li>`;
            document.getElementById('journalEntry').value = '';
        }
    });
}

// Daily Life Management Tools
function showDailyLife() {
    const view = document.getElementById('dailyView');
    view.style.display = 'block';
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('academicView').style.display = 'none';
    document.getElementById('healthView').style.display = 'none';
    document.getElementById('mentalView').style.display = 'none';
    document.getElementById('supportView').style.display = 'none';
    document.getElementById('profileView').style.display = 'none';

    view.innerHTML = `
        <h1>Daily Life Management Tools</h1>

        <div class="feature-section">
            <h3>Habit Tracker</h3>
            <div class="form-group">
                <label>Habit Name</label>
                <input type="text" id="habitName" placeholder="e.g., Exercise for 30 minutes">
            </div>
            <div class="form-group">
                <label>Goal Frequency</label>
                <select id="habitFrequency">
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                </select>
            </div>
            <button class="btn btn-primary" id="addHabitBtn">Add Habit</button>
            <ul class="feature-list" id="habitList"></ul>
        </div>

        <div class="feature-section">
            <h3>Budget and Expense Tracker</h3>
            <div class="form-group">
                <label>Monthly Budget</label>
                <input type="number" id="monthlyBudget" placeholder="Enter monthly budget">
            </div>
            <button class="btn btn-primary" id="setBudgetBtn">Set Budget</button>
            <p id="budgetDisplay"></p>
            
            <h4 style="margin-top: 1.5rem;">Log Expense</h4>
            <div class="form-group">
                <label>Category</label>
                <select id="expenseCategory">
                    <option value="Groceries">Groceries</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Leisure">Leisure</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Amount</label>
                <input type="number" id="expenseAmount" placeholder="Enter amount">
            </div>
            <button class="btn btn-primary" id="addExpenseBtn">Log Expense</button>
            <ul class="feature-list" id="expenseList"></ul>
        </div>

        <div class="feature-section">
            <h3>Personal Notes and Checklist</h3>
            <div class="form-group">
                <label>Note/Item</label>
                <input type="text" id="noteItem" placeholder="e.g., Pick up groceries, Bring stethoscope">
            </div>
            <button class="btn btn-primary" id="addNoteBtn">Add Note</button>
            <ul class="feature-list" id="noteList"></ul>
        </div>

        <div class="feature-section">
            <h3>Emergency Contacts</h3>
            <div class="form-group">
                <label>Contact Name</label>
                <input type="text" id="contactName" placeholder="Enter name">
            </div>
            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" id="contactPhone" placeholder="Enter phone number">
            </div>
            <div class="form-group">
                <label>Relationship</label>
                <input type="text" id="contactRelation" placeholder="e.g., Mother, Doctor">
            </div>
            <button class="btn btn-primary" id="addContactBtn">Add Contact</button>
            <ul class="feature-list" id="contactList"></ul>
        </div>
    `;

    // Habit tracker
    document.getElementById('addHabitBtn').addEventListener('click', () => {
        const habit = document.getElementById('habitName').value;
        const freq = document.getElementById('habitFrequency').value;
        if (habit) {
            document.getElementById('habitList').innerHTML += `<li>${habit} (${freq})</li>`;
            document.getElementById('habitName').value = '';
        }
    });

    // Budget tracking
    let budget = 0;
    let expenses = 0;
    document.getElementById('setBudgetBtn').addEventListener('click', () => {
        budget = parseFloat(document.getElementById('monthlyBudget').value);
        if (budget > 0) {
            const remaining = budget - expenses;
            document.getElementById('budgetDisplay').innerHTML = `<strong>Budget: ${budget}</strong> | Spent: ${expenses} | Remaining: ${remaining}`;
        }
    });

    document.getElementById('addExpenseBtn').addEventListener('click', () => {
        const category = document.getElementById('expenseCategory').value;
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        if (amount > 0) {
            expenses += amount;
            if (budget > 0) {
                const remaining = budget - expenses;
                document.getElementById('budgetDisplay').innerHTML = `<strong>Budget: ${budget}</strong> | Spent: ${expenses} | Remaining: ${remaining}`;
            }
            document.getElementById('expenseList').innerHTML += `<li>${category}: ${amount}</li>`;
            document.getElementById('expenseAmount').value = '';
        }
    });

    // Notes
    document.getElementById('addNoteBtn').addEventListener('click', () => {
        const note = document.getElementById('noteItem').value;
        if (note) {
            document.getElementById('noteList').innerHTML += `<li>${note}</li>`;
            document.getElementById('noteItem').value = '';
        }
    });

    // Emergency contacts
    document.getElementById('addContactBtn').addEventListener('click', () => {
        const name = document.getElementById('contactName').value;
        const phone = document.getElementById('contactPhone').value;
        const relation = document.getElementById('contactRelation').value;
        if (name && phone) {
            document.getElementById('contactList').innerHTML += `<li>${name} (${relation}) - ${phone}</li>`;
            document.getElementById('contactName').value = '';
            document.getElementById('contactPhone').value = '';
            document.getElementById('contactRelation').value = '';
        }
    });
}

// Student Support System
function showStudentSupport() {
    const view = document.getElementById('supportView');
    view.style.display = 'block';
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('academicView').style.display = 'none';
    document.getElementById('healthView').style.display = 'none';
    document.getElementById('mentalView').style.display = 'none';
    document.getElementById('dailyView').style.display = 'none';
    document.getElementById('profileView').style.display = 'none';

    view.innerHTML = `
        <h1>Student Support System</h1>

        <div class="feature-section">
            <h3>Peer Support and Community</h3>
            <p>Connect with peers and join study groups</p>
            <div class="form-group">
                <label>Find Peers By Interest</label>
                <input type="text" id="peerSearch" placeholder="e.g., Nursing, Math">
            </div>
            <button class="btn btn-primary" id="searchPeersBtn">Search Peers</button>
            <ul class="feature-list" id="peerList"></ul>
        </div>

        <div class="feature-section">
            <h3>Academic Encouragement</h3>
            <div class="form-group">
                <label>Set Academic Goal</label>
                <input type="text" id="academicGoal" placeholder="e.g., Complete Chapter 5 reading">
            </div>
            <button class="btn btn-primary" id="setGoalBtn">Set Goal</button>
            <div id="encouragementMsg" style="padding: 1rem; background-color: var(--light-blue); border-radius: 4px; margin-top: 1rem; display: none;"></div>
        </div>

        <div class="feature-section">
            <h3>Self-Care Recommendations</h3>
            <button class="btn btn-primary" id="getRecommendationBtn">Get Self-Care Tips</button>
            <div id="recommendationMsg" style="padding: 1rem; background-color: var(--light-blue); border-radius: 4px; margin-top: 1rem; display: none;"></div>
        </div>

        <div class="feature-section">
            <h3>Personalized Reminders</h3>
            <div class="form-group">
                <label>Reminder</label>
                <input type="text" id="reminderText" placeholder="e.g., Take a break at 2 PM">
            </div>
            <div class="form-group">
                <label>Time</label>
                <input type="time" id="reminderTime">
            </div>
            <button class="btn btn-primary" id="setReminderBtn">Set Reminder</button>
            <ul class="feature-list" id="reminderList"></ul>
        </div>
    `;

    const encouragementMessages = [
        'Keep going! You are making progress!',
        'You got this! Stay focused!',
        'Every step counts. Keep pushing!',
        'You are doing amazing!',
        'Believe in yourself!'
    ];

    const selfCareRecommendations = [
        'Take a 5-minute break',
        'Practice deep breathing',
        'Go for a short walk',
        'Drink some water',
        'Listen to your favorite music',
        'Do some stretching'
    ];

    // Search peers
    document.getElementById('searchPeersBtn').addEventListener('click', () => {
        const interest = document.getElementById('peerSearch').value;
        if (interest) {
            document.getElementById('peerList').innerHTML += `<li>Found 5 peers interested in ${interest}</li>`;
            document.getElementById('peerSearch').value = '';
        }
    });

    // Academic goal
    document.getElementById('setGoalBtn').addEventListener('click', () => {
        const goal = document.getElementById('academicGoal').value;
        if (goal) {
            const randomMsg = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
            const msg = document.getElementById('encouragementMsg');
            msg.innerHTML = `<strong>Goal Set:</strong> ${goal}<br><strong>Encouragement:</strong> ${randomMsg}`;
            msg.style.display = 'block';
            document.getElementById('academicGoal').value = '';
        }
    });

    // Self-care recommendation
    document.getElementById('getRecommendationBtn').addEventListener('click', () => {
        const randomRec = selfCareRecommendations[Math.floor(Math.random() * selfCareRecommendations.length)];
        const msg = document.getElementById('recommendationMsg');
        msg.textContent = `Try this: ${randomRec}`;
        msg.style.display = 'block';
    });

    // Reminders
    document.getElementById('setReminderBtn').addEventListener('click', () => {
        const text = document.getElementById('reminderText').value;
        const time = document.getElementById('reminderTime').value;
        if (text && time) {
            document.getElementById('reminderList').innerHTML += `<li>${text} at ${time}</li>`;
            document.getElementById('reminderText').value = '';
            document.getElementById('reminderTime').value = '';
        }
    });
}

// Profile Page
function showProfile() {
    const view = document.getElementById('profileView');
    view.style.display = 'block';
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('academicView').style.display = 'none';
    document.getElementById('healthView').style.display = 'none';
    document.getElementById('mentalView').style.display = 'none';
    document.getElementById('dailyView').style.display = 'none';
    document.getElementById('supportView').style.display = 'none';

    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');

    view.innerHTML = `
        <div class="profile-container">
            <h1>User Profile</h1>
            
            <div class="feature-section">
                <h3>Personal Information</h3>
                <div class="form-group">
                    <label>Nickname</label>
                    <input type="text" id="nickName" value="${userName}">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="profileEmail" value="${userEmail}" readonly>
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <input type="text" id="profileRole" value="${userRole}" readonly>
                </div>
                <button class="btn btn-primary" id="updateProfileBtn">Update Profile</button>
            </div>
        </div>
    `;

    document.getElementById('updateProfileBtn').addEventListener('click', () => {
        const newNickname = document.getElementById('nickName').value;
        if (newNickname) {
            localStorage.setItem('userName', newNickname);
            alert('Profile updated successfully!');
            location.reload();
        }
    });
}

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});
