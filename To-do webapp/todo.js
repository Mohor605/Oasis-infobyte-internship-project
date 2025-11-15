// Task storage
let tasks = {
    pending: [],
    completed: []
};

// Load tasks from memory on page load
let taskIdCounter = 1;
let editingTaskId = null;

// DOM Elements
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const saveBtn = document.getElementById('saveBtn');
const validationMessage = document.getElementById('validationMessage');
const pendingTasksList = document.getElementById('pendingTasks');
const completedTasksList = document.getElementById('completedTasks');
const tabButtons = document.querySelectorAll('.tab-btn');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
    setupTabSwitching();
});

// Save button click handler
saveBtn.addEventListener('click', function() {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    
    // Validation
    if (!title || !description) {
        validationMessage.classList.add('show');
        if (!description) {
            taskDescription.classList.add('error');
        }
        if (!title) {
            taskTitle.classList.add('error');
        }
        return;
    }
    
    // Hide validation message
    validationMessage.classList.remove('show');
    taskTitle.classList.remove('error');
    taskDescription.classList.remove('error');
    
    // Create task object
    const currentDateTime = new Date();
    const formattedDateTime = formatDateTime(currentDateTime);
    
    if (editingTaskId) {
        // Update existing task
        updateTask(editingTaskId, title, description, formattedDateTime);
        editingTaskId = null;
        saveBtn.textContent = 'Save';
    } else {
        // Add new task
        const task = {
            id: taskIdCounter++,
            title: title,
            description: description,
            dateTime: formattedDateTime,
            timestamp: currentDateTime.getTime()
        };
        
        tasks.pending.push(task);
    }
    
    // Clear form
    taskTitle.value = '';
    taskDescription.value = '';
    
    // Render tasks
    renderTasks();
});

// Format date and time
function formatDateTime(date) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Render all tasks
function renderTasks() {
    renderPendingTasks();
    renderCompletedTasks();
}

// Render pending tasks
function renderPendingTasks() {
    if (tasks.pending.length === 0) {
        pendingTasksList.innerHTML = '<div class="empty-message">No pending tasks. Add a new task to get started!</div>';
        return;
    }
    
    pendingTasksList.innerHTML = '';
    
    tasks.pending.forEach(task => {
        const taskElement = createTaskElement(task, 'pending');
        pendingTasksList.appendChild(taskElement);
    });
}

// Render completed tasks
function renderCompletedTasks() {
    if (tasks.completed.length === 0) {
        completedTasksList.innerHTML = '<div class="empty-message">No completed tasks yet. Complete a task to see it here!</div>';
        return;
    }
    
    completedTasksList.innerHTML = '';
    
    tasks.completed.forEach(task => {
        const taskElement = createTaskElement(task, 'completed');
        completedTasksList.appendChild(taskElement);
    });
}

// Create task element
function createTaskElement(task, type) {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'task-title';
    titleDiv.textContent = task.title;
    
    const descDiv = document.createElement('div');
    descDiv.className = 'task-description';
    descDiv.textContent = task.description;
    
    const dateDiv = document.createElement('div');
    dateDiv.className = 'task-datetime';
    dateDiv.textContent = task.dateTime;
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';
    
    if (type === 'pending') {
        // Complete button
        const completeBtn = document.createElement('button');
        completeBtn.className = 'action-btn complete-btn';
        completeBtn.textContent = '✓';
        completeBtn.onclick = () => completeTask(task.id);
        actionsDiv.appendChild(completeBtn);
        
        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editTask(task.id);
        actionsDiv.appendChild(editBtn);
    }
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = () => deleteTask(task.id, type);
    actionsDiv.appendChild(deleteBtn);
    
    taskItem.appendChild(titleDiv);
    taskItem.appendChild(descDiv);
    taskItem.appendChild(dateDiv);
    taskItem.appendChild(actionsDiv);
    
    return taskItem;
}

// Complete task
function completeTask(taskId) {
    const taskIndex = tasks.pending.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        const task = tasks.pending[taskIndex];
        task.completedDateTime = formatDateTime(new Date());
        tasks.completed.push(task);
        tasks.pending.splice(taskIndex, 1);
        renderTasks();
    }
}

// Edit task
function editTask(taskId) {
    const task = tasks.pending.find(t => t.id === taskId);
    if (task) {
        taskTitle.value = task.title;
        taskDescription.value = task.description;
        editingTaskId = taskId;
        saveBtn.textContent = 'Update';
        taskTitle.focus();
    }
}

// Update task
function updateTask(taskId, title, description, dateTime) {
    const task = tasks.pending.find(t => t.id === taskId);
    if (task) {
        task.title = title;
        task.description = description;
        task.dateTime = dateTime;
        task.timestamp = new Date().getTime();
    }
}

// Delete task
function deleteTask(taskId, type) {
    if (confirm('Are you sure you want to delete this task?')) {
        if (type === 'pending') {
            tasks.pending = tasks.pending.filter(t => t.id !== taskId);
        } else {
            tasks.completed = tasks.completed.filter(t => t.id !== taskId);
        }
        renderTasks();
    }
}

// Setup tab switching
function setupTabSwitching() {
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and lists
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.task-list').forEach(list => list.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding task list
            if (tabName === 'pending') {
                pendingTasksList.classList.add('active');
            } else {
                completedTasksList.classList.add('active');
            }
        });
    });
}

// Remove validation message on input
taskTitle.addEventListener('input', function() {
    validationMessage.classList.remove('show');
    this.classList.remove('error');
});

taskDescription.addEventListener('input', function() {
    validationMessage.classList.remove('show');
    this.classList.remove('error');
});

// Add some demo tasks for testing
function addDemoTasks() {
    const demoTasks = [
        {
            id: taskIdCounter++,
            title: 'Complete project documentation',
            description: 'Write comprehensive documentation for the new feature',
            dateTime: formatDateTime(new Date()),
            timestamp: new Date().getTime()
        },
        {
            id: taskIdCounter++,
            title: 'Review pull requests',
            description: 'Review and merge pending pull requests from team members',
            dateTime: formatDateTime(new Date()),
            timestamp: new Date().getTime()
        }
    ];
    
    tasks.pending.push(...demoTasks);
    renderTasks();
}

// Uncomment to add demo tasks
// addDemoTasks();