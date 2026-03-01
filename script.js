// Student data storage
let students = [];
let editingStudentId = null;

// Test students data - fallback defaults
const DEFAULT_STUDENTS = [
    { id: 'STU001', name: 'John Smith', course: 'Computer Science', year: '1st Year', age: 20 },
    { id: 'STU002', name: 'Sarah Johnson', course: 'Business Administration', year: '2nd Year', age: 21 },
    { id: 'STU003', name: 'Michael Brown', course: 'Engineering', year: '3rd Year', age: 22 }
];

// Initialize application
function initializeApp() {
    console.log('=== Initializing app ===');
    
    // Load data from storage
    loadData();
    console.log('After loadData, students count:', students.length);
    
    // If no students, use defaults
    if (students.length === 0) {
        console.log('No data found, using default students');
        students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS)); // Deep copy
        saveData();
    }
    
    console.log('Total students:', students.length);
    updateStats();
    
    // Setup form listeners
    const addForm = document.getElementById('addForm');
    const editForm = document.getElementById('editForm');
    if (addForm) addForm.addEventListener('submit', addStudent);
    if (editForm) editForm.addEventListener('submit', updateStudent);
    
    // Show the View section with students
    showViewSection();
    console.log('=== App initialization complete ===');
}

function showViewSection() {
    console.log('Switching to view section...');
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Deactivate all buttons
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show view section
    const viewSection = document.getElementById('view');
    if (viewSection) {
        viewSection.classList.add('active');
    } else {
        console.error('View section not found!');
    }
    
    // Activate View All button
    const buttons = document.querySelectorAll('.menu-btn');
    if (buttons.length > 2) {
        buttons[2].classList.add('active');
    }
    
    // Display the students
    console.log('Calling displayAllStudents from showViewSection');
    displayAllStudents();
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Ready Event');
    initializeApp();
});

// Fallback on full page load
window.addEventListener('load', function() {
    console.log('Full Page Load Event');
    setTimeout(function() {
        // Verify display is working
        const container = document.getElementById('studentsContainer');
        if (container && !container.innerHTML.trim()) {
            console.log('Container is empty, triggering display...');
            if (students.length > 0) {
                displayAllStudents();
            } else {
                initializeApp();
            }
        }
    }, 100);
});

// Load data from localStorage
function loadData() {
    const stored = localStorage.getItem('students');
    console.log('Loading data from localStorage...');
    console.log('Raw stored data:', stored);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                students = parsed;
                console.log('Successfully loaded', students.length, 'students from storage');
            }
        } catch (e) {
            console.error('Error parsing students:', e);
            students = [];
        }
    } else {
        console.log('No stored data found');
        students = [];
    }
}

// Save data to localStorage
function saveData() {
    console.log('Saving data to localStorage...');
    console.log('Students to save:', students);
    try {
        localStorage.setItem('students', JSON.stringify(students));
        console.log('Successfully saved to localStorage');
        // Verify it was saved
        const verify = localStorage.getItem('students');
        console.log('Verification - Retrieved from localStorage:', verify);
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

// Update statistics
function updateStats() {
    document.getElementById('totalCount').textContent = students.length;
}

// Show/Hide sections
function showSection(event, sectionId) {
    // Prevent default behavior
    if (event) {
        event.preventDefault();
    }
    
    console.log('=== showSection called with:', sectionId);
    console.log('Current students in memory:', students);
    console.log('Students count:', students.length);
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all menu buttons
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    const activeSection = document.getElementById(sectionId);
    if (!activeSection) {
        console.error('ERROR: Section not found:', sectionId);
        return;
    }
    console.log('Setting active section:', sectionId, activeSection);
    activeSection.classList.add('active');
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
        console.log('Added active class to button');
    }
    
    // Load content based on section
    if (sectionId === 'view') {
        console.log('View section selected - calling displayAllStudents');
        // Reload data before displaying
        loadData();
        // Display students immediately
        displayAllStudents();
    }
}

// Add new student
function addStudent(e) {
    e.preventDefault();
    
    const id = document.getElementById('studentId').value.trim();
    const name = document.getElementById('fullName').value.trim();
    const course = document.getElementById('course').value.trim();
    const year = document.getElementById('yearLevel').value;
    const age = parseInt(document.getElementById('age').value);
    
    console.log('Adding student:', { id, name, course, year, age });
    
    // Validation
    if (!id || !name || !course || !year || !age) {
        showMessage('addMessage', 'Please fill all fields', 'error');
        return;
    }
    
    // Check if student ID already exists
    if (students.some(s => s.id === id)) {
        showMessage('addMessage', 'Student ID already exists', 'error');
        return;
    }
    
    // Validate age
    if (age < 15 || age > 50) {
        showMessage('addMessage', 'Age must be between 15 and 50', 'error');
        return;
    }
    
    // Create student object
    const newStudent = {
        id: id,
        name: name,
        course: course,
        year: year,
        age: age
    };
    
    // Add to array
    students.push(newStudent);
    console.log('Added student:', newStudent);
    console.log('Total students now:', students.length);
    console.log('Full students array:', students);
    
    // Save to storage
    saveData();
    console.log('Saved to localStorage');
    
    // Show success message
    showMessage('addMessage', 'Student added successfully!', 'success');
    
    // Reset form
    document.getElementById('addForm').reset();
    
    // Update stats
    updateStats();
    
    // Reload data to ensure it's current
    loadData();
    
    // Switch to view section programmatically
    console.log('Switching to view section...');
    
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Hide all menu buttons highlight
    const menuBtns = document.querySelectorAll('.menu-btn');
    menuBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show view section
    const viewSection = document.getElementById('view');
    if (viewSection) {
        viewSection.classList.add('active');
        console.log('Activated view section');
    }
    
    // Highlight 3rd menu button (View All)
    if (menuBtns[2]) {
        menuBtns[2].classList.add('active');
        console.log('Activated View All button');
    }
    
    // Display students immediately
    console.log('Calling displayAllStudents...');
    displayAllStudents();
    console.log('displayAllStudents completed');
    
    // Clear message after 2 seconds
    setTimeout(() => {
        document.getElementById('addMessage').classList.remove('success', 'error');
    }, 2000);
}

// Refresh display - manual trigger for debugging
function refreshDisplay() {
    console.log('=== Manual Refresh Triggered ===');
    console.log('Students in memory:', students);
    console.log('Students count:', students.length);
    displayAllStudents();
}

// Display all students
function displayAllStudents() {
    const container = document.getElementById('studentsContainer');
    
    console.log('=== displayAllStudents called ===');
    console.log('Container element found:', !!container);
    console.log('Students array:', students);
    console.log('Students count:', students.length);
    
    if (!container) {
        console.error('ERROR: studentsContainer not found!');
        return;
    }
    
    if (students.length === 0) {
        console.log('No students - showing empty message');
        container.innerHTML = '<p class="no-data">No students registered yet</p>';
        return;
    }
    
    // Build HTML for each student
    let html = '';
    students.forEach((student, index) => {
        console.log(`Building card for student ${index}:`, student);
        html += `
        <div class="student-card">
            <div class="student-header">
                <h3>${escapeHtml(student.name)}</h3>
                <span class="student-id">ID: ${escapeHtml(student.id)}</span>
            </div>
            <div class="student-info">
                <p><strong>Course:</strong> ${escapeHtml(student.course)}</p>
                <p><strong>Year Level:</strong> ${escapeHtml(student.year)}</p>
                <p><strong>Age:</strong> ${student.age}</p>
            </div>
            <div class="student-actions">
                <button onclick="displayStudentDetails('${student.id}')" class="btn-view">View Details</button>
                <button onclick="openEditModal('${student.id}')" class="btn-edit">Edit</button>
                <button onclick="deleteStudent('${student.id}')" class="btn-delete">Delete</button>
            </div>
        </div>
        `;
    });
    
    console.log('Setting container innerHTML...');
    container.innerHTML = html;
    console.log('Container updated with', students.length, 'students');
}

// Search student
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    
    if (!searchTerm) {
        document.getElementById('searchResults').innerHTML = '<p class="error">Please enter a search term</p>';
        return;
    }
    
    const results = students.filter(student =>
        student.id.toLowerCase().includes(searchTerm) ||
        student.name.toLowerCase().includes(searchTerm)
    );
    
    const resultsDiv = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p class="no-data">No students found</p>';
        return;
    }
    
    resultsDiv.innerHTML = results.map(student => `
        <div class="student-card">
            <div class="student-header">
                <h3>${escapeHtml(student.name)}</h3>
                <span class="student-id">ID: ${escapeHtml(student.id)}</span>
            </div>
            <div class="student-info">
                <p><strong>Course:</strong> ${escapeHtml(student.course)}</p>
                <p><strong>Year Level:</strong> ${escapeHtml(student.year)}</p>
                <p><strong>Age:</strong> ${student.age}</p>
            </div>
            <div class="student-actions">
                <button onclick="displayStudentDetails('${student.id}')" class="btn-view">View Details</button>
                <button onclick="openEditModal('${student.id}')" class="btn-edit">Edit</button>
                <button onclick="deleteStudent('${student.id}')" class="btn-delete">Delete</button>
            </div>
        </div>
    `).join('');
}

// Clear search
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

// Display individual student details
function displayStudentDetails(studentId) {
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        alert('Student not found');
        return;
    }
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Hide menu buttons highlighting
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show details section
    document.getElementById('details').classList.add('active');
    
    // Build and display student details
    const detailsHtml = `
        <div class="student-details-card">
            <div class="details-header">
                <h2>${escapeHtml(student.name)}</h2>
                <span class="details-id">Student ID: ${escapeHtml(student.id)}</span>
            </div>
            
            <div class="details-body">
                <div class="detail-item">
                    <label>Full Name:</label>
                    <p>${escapeHtml(student.name)}</p>
                </div>
                
                <div class="detail-item">
                    <label>Student ID:</label>
                    <p>${escapeHtml(student.id)}</p>
                </div>
                
                <div class="detail-item">
                    <label>Course:</label>
                    <p>${escapeHtml(student.course)}</p>
                </div>
                
                <div class="detail-item">
                    <label>Year Level:</label>
                    <p>${escapeHtml(student.year)}</p>
                </div>
                
                <div class="detail-item">
                    <label>Age:</label>
                    <p>${student.age} years old</p>
                </div>
            </div>
            
            <div class="details-actions">
                <button onclick="openEditModal('${student.id}')" class="btn-edit">Edit Student</button>
                <button onclick="deleteStudent('${student.id}')" class="btn-delete">Delete Student</button>
                <button onclick="backToView()" class="btn-secondary">Back to List</button>
            </div>
        </div>
    `;
    
    document.getElementById('studentDetails').innerHTML = detailsHtml;
}

// Go back to view all students
function backToView() {
    loadData();
    displayAllStudents();
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Hide menu buttons highlighting
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show view section
    document.getElementById('view').classList.add('active');
    document.querySelectorAll('.menu-btn')[2].classList.add('active');
}

// Open edit modal
function openEditModal(studentId) {
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        alert('Student not found');
        return;
    }
    
    editingStudentId = studentId;
    document.getElementById('editId').value = student.id;
    document.getElementById('editName').value = student.name;
    document.getElementById('editCourse').value = student.course;
    document.getElementById('editYear').value = student.year;
    document.getElementById('editAge').value = student.age;
    
    document.getElementById('editModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('editForm').reset();
    editingStudentId = null;
}

// Update student
function updateStudent(e) {
    e.preventDefault();
    
    if (!editingStudentId) return;
    
    const course = document.getElementById('editCourse').value.trim();
    const year = document.getElementById('editYear').value;
    const age = parseInt(document.getElementById('editAge').value);
    
    // Validation
    if (!course || !year || !age) {
        alert('Please fill all fields');
        return;
    }
    
    if (age < 15 || age > 50) {
        alert('Age must be between 15 and 50');
        return;
    }
    
    // Find and update student
    const studentIndex = students.findIndex(s => s.id === editingStudentId);
    
    if (studentIndex !== -1) {
        students[studentIndex].course = course;
        students[studentIndex].year = year;
        students[studentIndex].age = age;
        
        saveData();
        alert('Student updated successfully!');
        closeModal();
        loadData();
        displayAllStudents();
    }
}

// Delete student
function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }
    
    students = students.filter(s => s.id !== studentId);
    saveData();
    loadData();
    updateStats();
    alert('Student deleted successfully!');
    displayAllStudents();
}

// Show message
function showMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    messageEl.textContent = message;
    messageEl.className = 'message ' + type;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Diagnostic function
function diagnose() {
    console.log('=== DIAGNOSTIC CHECK ===');
    console.log('Students array:', students);
    console.log('Students count:', students.length);
    console.log('Container element:', document.getElementById('studentsContainer'));
    console.log('View section:', document.getElementById('view'));
    console.log('Total count element:', document.getElementById('totalCount'));
    console.log('Total count text:', document.getElementById('totalCount')?.textContent);
    console.log('Stored in localStorage:', localStorage.getItem('students'));
    console.log('===========================');
}

// Test function - add sample data
function testAddStudent() {
    console.log('=== TEST: Adding sample student ===');
    const testStudent = {
        id: 'TEST001',
        name: 'John Doe',
        course: 'Computer Science',
        year: '1st Year',
        age: 20
    };
    
    students.push(testStudent);
    console.log('Test student added:', testStudent);
    console.log('Students array now:', students);
    
    saveData();
    console.log('Saved to localStorage');
    
    loadData();
    console.log('Reloaded from localStorage:', students);
    
    updateStats();
    displayAllStudents();
    console.log('Display updated');
}

// Clear all data function
function clearAllData() {
    if (confirm('WARNING: This will delete all student data. Are you sure?')) {
        students = [];
        localStorage.removeItem('students');
        updateStats();
        displayAllStudents();
        console.log('All data cleared');
    }
}

// Call diagnose when page fully loads
window.addEventListener('load', function() {
    console.log('Window load event fired');
    console.log('Loading data on page load...');
    loadData();
    updateStats();
    console.log('Initial load complete. Students:', students);
    diagnose();
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
});
