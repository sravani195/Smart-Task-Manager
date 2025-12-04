// dashboard.js
document.addEventListener('DOMContentLoaded', () => {
  const userId = 1;
  const taskList = document.getElementById('task-list');
  const addBtn = document.getElementById('add-task-btn');
  const modal = document.getElementById('add-modal');
  const closeBtn = document.getElementById('closeModal');
  const closeBtnFooter = document.getElementById('closeModalFooter');
  const addTaskForm = document.getElementById('addTaskForm');

  async function loadTasks(category = 'All') {
    try {
      const res = await fetch(`/api/tasks/${userId}`);
      const tasks = await res.json();
      tasks.sort((a,b) => a.completed - b.completed);

      taskList.innerHTML = '';
      tasks.forEach(task => {
        if(category === 'All' || task.category === category) {
          const li = document.createElement('li');
          li.className = 'task-item';
          li.style.opacity = task.completed ? '0.5' : '1';
          const formattedDate = (task.due_date || '').toString().replace('T',' ');
          li.innerHTML = `
            <div class="task-info" style="flex:1;">
              <strong>${task.title}</strong> (${task.category}) - Due: ${formattedDate}
              ${task.completed ? '<span class="completed">(Completed)</span>' : ''}
              <p>${task.notes || ''}</p>
            </div>
            <button class="complete-btn" data-id="${task.id}" ${task.completed ? 'disabled' : ''}>
              ${task.completed ? '☑' : '☐'}
            </button>
          `;
          taskList.appendChild(li);

          const btn = li.querySelector('.complete-btn');
          btn.style.border='none';
          btn.style.background='transparent';
          btn.style.fontSize='22px';
          btn.style.cursor = task.completed ? 'default' : 'pointer';
          btn.style.marginLeft='10px';
          btn.style.color = task.completed ? '#6A5ACD' : '#000';

          if(!task.completed){
            btn.addEventListener('click', async () => {
              try {
                await fetch(`/api/tasks/complete/${btn.dataset.id}`, { method: 'PUT' });
                // reload to reflect change and reposition
                loadTasks(category);
              } catch (err) {
                console.error('Error marking complete:', err);
                alert('Failed to mark complete');
              }
            });
          }
        }
      });
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  }

  // tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('category-title').textContent = tab.dataset.category + ' Tasks';
      loadTasks(tab.dataset.category);
    });
  });

  // modal open/close
  const closeModal = () => modal.style.display = 'none';
  addBtn.addEventListener('click', ()=> modal.style.display = 'flex');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeBtnFooter) closeBtnFooter.addEventListener('click', closeModal);
  window.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  // form submit
  if (addTaskForm) {
    addTaskForm.addEventListener('submit', async e => {
      e.preventDefault();
      const taskData = {
        user_id: userId,
        title: document.getElementById('taskTitle').value.trim(),
        category: document.getElementById('taskCategory').value,
        due_date: document.getElementById('taskDate').value,
        notes: document.getElementById('taskNotes').value.trim() || null
      };
      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(taskData)
        });
        if (res.ok) {
          addTaskForm.reset();
          closeModal();
          loadTasks();
        } else {
          const err = await res.json().catch(()=>({error:'Add failed'}));
          alert(err.error || 'Failed to add task');
        }
      } catch (err) {
        console.error('Error adding task:', err);
        alert('Error adding task');
      }
    });
  }

  // bottom nav handlers
  const navTasks = document.getElementById('nav-tasks');
  const navCalendar = document.getElementById('nav-calendar');
  const navProfile = document.getElementById('nav-profile');

  if (navTasks) {
    navTasks.addEventListener('click', () => {
      // If not on dashboard, navigate; otherwise refresh tasks
      if (window.location.pathname !== '/dashboard' && window.location.pathname !== '/dashboard.html') {
        window.location.href = '/dashboard';
      } else {
        loadTasks('All');
      }
    });
  }
  if (navCalendar) navCalendar.addEventListener('click', () => window.location.href = '/calendar');
  if (navProfile) navProfile.addEventListener('click', () => window.location.href = '/overview');

  loadTasks();
});
