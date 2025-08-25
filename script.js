// A simple function to get all student records from local storage.
function getStudents() {
    return JSON.parse(localStorage.getItem('students')) || [];
}

// A simple function to save student records to local storage.
function saveStudents(students) {
    localStorage.setItem('students', JSON.stringify(students));
}

// Function to validate form inputs.
function validateForm(studentName, studentId, emailId, contactNumber) {
    // Check if any field is empty.
    if (!studentName || !studentId || !emailId || !contactNumber) {
        alert("Please fill in all fields.");
        return false;
    }

    // Validate student name (only characters).
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(studentName)) {
        alert("Student name must contain only characters.");
        return false;
    }

    // Validate student ID (only numbers).
    const idRegex = /^\d+$/;
    if (!idRegex.test(studentId)) {
        alert("Student ID must contain only numbers.");
        return false;
    }

    // Validate email format.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
        alert("Please enter a valid email address.");
        return false;
    }

    // Validate contact number (at least 10 digits and only numbers).
    const contactRegex = /^\d{10,}$/;
    if (!contactRegex.test(contactNumber)) {
        alert("Contact number must contain only digits and be at least 10 digits long.");
        return false;
    }

    return true;
}

// Function to display student records in the table.
function displayStudents() {
    const studentTableBody = document.getElementById('studentTableBody');
    const noRecordsMessage = document.getElementById('noRecordsMessage');
    const students = getStudents();

    // Clear existing table rows.
    studentTableBody.innerHTML = '';

    if (students.length === 0) {
        // Show the "no records" message if the array is empty.
        noRecordsMessage.style.display = 'block';
    } else {
        noRecordsMessage.style.display = 'none';

        // Iterate through each student and create a table row.
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.studentName}</td>
                <td>${student.studentId}</td>
                <td>${student.emailId}</td>
                <td>${student.contactNumber}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            studentTableBody.appendChild(row);
        });
    }

    // Dynamically add vertical scrollbar if needed.
    const displaySection = document.querySelector('.display-section');
    if (studentTableBody.clientHeight > displaySection.clientHeight) {
        displaySection.style.overflowY = 'scroll';
    } else {
        displaySection.style.overflowY = 'visible';
    }
}

// Function to add a new student record.
function addStudent(event) {
    event.preventDefault(); // Prevent form from submitting and reloading the page.

    // Get input values.
    const studentName = document.getElementById('studentName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const emailId = document.getElementById('emailId').value.trim();
    const contactNumber = document.getElementById('contactNumber').value.trim();

    // Validate inputs.
    if (!validateForm(studentName, studentId, emailId, contactNumber)) {
        return; // Stop if validation fails.
    }

    const students = getStudents();

    // Check for duplicate Student ID.
    const isDuplicate = students.some(student => student.studentId === studentId);
    if (isDuplicate) {
        alert("A student with this ID already exists.");
        return;
    }

    // Create a new student object.
    const newStudent = { studentName, studentId, emailId, contactNumber };
    students.push(newStudent);

    // Save the updated list and re-display the table.
    saveStudents(students);
    displayStudents();

    // Clear the form fields.
    document.getElementById('registrationForm').reset();
}

// Function to edit a student record.
function editStudent(index) {
    const students = getStudents();
    const studentToEdit = students[index];

    // Populate the form with the student's details.
    document.getElementById('studentName').value = studentToEdit.studentName;
    document.getElementById('studentId').value = studentToEdit.studentId;
    document.getElementById('emailId').value = studentToEdit.emailId;
    document.getElementById('contactNumber').value = studentToEdit.contactNumber;

    // Change the form button to "Save Changes".
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = 'Save Changes';

    // Store the index of the student being edited in a data attribute.
    document.getElementById('registrationForm').dataset.editIndex = index;
}

// Function to save edited student details.
function saveEditedStudent(event) {
    event.preventDefault();

    const studentName = document.getElementById('studentName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const emailId = document.getElementById('emailId').value.trim();
    const contactNumber = document.getElementById('contactNumber').value.trim();

    if (!validateForm(studentName, studentId, emailId, contactNumber)) {
        return;
    }

    const students = getStudents();
    const editIndex = document.getElementById('registrationForm').dataset.editIndex;

    // Update the student object at the specified index.
    students[editIndex] = { studentName, studentId, emailId, contactNumber };

    saveStudents(students);
    displayStudents();

    // Reset the form and button text.
    document.getElementById('registrationForm').reset();
    document.querySelector('.submit-btn').textContent = 'Add Student';
    delete document.getElementById('registrationForm').dataset.editIndex;
}

// Function to delete a student record.
function deleteStudent(index) {
    if (confirm("Are you sure you want to delete this student's record?")) {
        const students = getStudents();
        students.splice(index, 1); // Remove one element at the specified index.
        saveStudents(students);
        displayStudents();
    }
}

// Event listeners to handle form submission and table button clicks.
document.addEventListener('DOMContentLoaded', () => {
    // Display any existing students when the page loads.
    displayStudents();

    // Handle form submission for both adding and editing.
    document.getElementById('registrationForm').addEventListener('submit', (event) => {
        if (document.getElementById('registrationForm').dataset.editIndex) {
            saveEditedStudent(event);
        } else {
            addStudent(event);
        }
    });

    // Handle clicks on the "Edit" and "Delete" buttons in the table.
    document.getElementById('studentTableBody').addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('delete-btn')) {
            const index = target.getAttribute('data-index');
            deleteStudent(index);
        } else if (target.classList.contains('edit-btn')) {
            const index = target.getAttribute('data-index');
            editStudent(index);
        }
    });
});