// --- 1. CLOCK & GREETING LOGIC ---
function updateTime() {
    const now = new Date();
    // Time in 24h format
    document.getElementById('clock').textContent = now.toLocaleTimeString('en-GB');
    // Full Date format
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });

    const hours = now.getHours();
    let greet;

    // Fixed Greeting Logic
    if (hours >= 4 && hours < 12) {
        greet = "Good Morning";
    } else if (hours >= 12 && hours < 17) {
        greet = "Good Afternoon";
    } else if (hours >= 17 && hours < 19) {
        greet = "Good Evening";
    } else {
        greet = "Good Night";
    }
    
    // Challenge: Custom Name in Greeting
    document.getElementById('greeting').textContent = `${greet}, Future Engineer!`;
}
setInterval(updateTime, 1000); 
updateTime();

// --- 2. FOCUS TIMER LOGIC (Challenge: Change Pomodoro Time) ---
let timeLeft = 25 * 60;
let timerId = null;
const timerDisplay = document.getElementById('timer');

function formatTimer() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    timerDisplay.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

window.setTimer = (minutes) => {
    clearInterval(timerId); 
    timerId = null;
    timeLeft = minutes * 60;
    formatTimer();
};

document.getElementById('start-timer').onclick = () => {
    if (timerId) return;
    timerId = setInterval(() => {
        if (timeLeft > 0) { 
            timeLeft--; 
            formatTimer(); 
        } else { 
            clearInterval(timerId); 
            timerId = null; 
            alert("Break time, Future Engineer!"); 
        }
    }, 1000);
};

document.getElementById('stop-timer').onclick = () => { 
    clearInterval(timerId); 
    timerId = null; 
};

document.getElementById('reset-timer').onclick = () => { 
    setTimer(25); 
};

// --- 3. TO-DO LIST LOGIC (MVP + Challenge: Prevent Duplicate) ---
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = "";
    tasks.forEach((t, i) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${t.done ? 'checked' : ''} onclick="toggleTask(${i})">
            <span class="task-text" style="${t.done ? 'text-decoration:line-through; color:gray;' : ''}">${t.text}</span>
            <div class="task-actions">
                <button class="btn-edit" onclick="editTask(${i})">Edit</button>
                <button class="btn-delete" onclick="deleteTask(${i})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.getElementById('add-task').onclick = () => {
    const input = document.getElementById('task-input');
    const val = input.value.trim();
    if (!val) return;

    // Challenge: Prevent Duplicate Tasks
    const isDuplicate = tasks.some(t => t.text.toLowerCase() === val.toLowerCase());
    if (isDuplicate) {
        alert("This task already exists!");
        return;
    }

    tasks.push({ text: val, done: false });
    input.value = ""; 
    renderTasks();
};

// MVP: Edit Task
window.editTask = (i) => {
    const newText = prompt("Edit your task:", tasks[i].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[i].text = newText.trim(); 
        renderTasks();
    }
};

window.deleteTask = (i) => { 
    tasks.splice(i, 1); 
    renderTasks(); 
};

window.toggleTask = (i) => { 
    tasks[i].done = !tasks[i].done; 
    renderTasks(); 
};

renderTasks();

// --- 4. QUICK LINKS LOGIC ---
let links = JSON.parse(localStorage.getItem('links')) || [];

function renderLinks() {
    const container = document.getElementById('links-container');
    container.innerHTML = "";
    links.forEach(l => {
        container.innerHTML += `<a href="${l.url}" target="_blank" class="link-item">${l.name}</a>`;
    });
    localStorage.setItem('links', JSON.stringify(links));
}

document.getElementById('add-link').onclick = () => {
    const n = document.getElementById('link-name');
    const u = document.getElementById('link-url');
    if (n.value && u.value) {
        let url = u.value.startsWith('http') ? u.value : 'https://' + u.value;
        links.push({ name: n.value, url: url });
        n.value = ""; 
        u.value = ""; 
        renderLinks();
    }
};

renderLinks();
