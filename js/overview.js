document.addEventListener('DOMContentLoaded', () => {
  const userId = 1; // replace with session user id if available
  const completedCountEl = document.getElementById('completedCount');
  const pendingCountEl = document.getElementById('pendingCount');
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  const categoryCtx = document.getElementById('categoryDonutChart').getContext('2d');
  const upcomingTasksEl = document.getElementById('upcomingTasks');

  const COLORS = {
    purple: '#6A5ACD',
    peach: '#FF8C69',
    blue: '#3b82f6',
    orange: '#f59e0b',
    green: '#4caf50',
    pink: '#FF69B4'
  };

  let pieChart = null;
  let categoryChart = null;

  async function fetchTasks() {
    try {
      const res = await fetch(`/api/tasks/${userId}`);
      if (!res.ok) throw new Error('API fetch failed');
      return await res.json();
    } catch (err) {
      console.warn('API tasks fetch failed, using localStorage fallback:', err);
      const raw = localStorage.getItem('tasks');
      return raw ? JSON.parse(raw) : [];
    }
  }

  // Completed vs Pending
  function countCompletedPending(tasks) {
    let completed = 0, pending = 0;
    tasks.forEach(t => t.completed ? completed++ : pending++);
    return { completed, pending };
  }

  function renderPie(completed, pending) {
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [completed, pending],
          backgroundColor: [COLORS.purple, COLORS.peach],
          hoverOffset: 6
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } } },
        maintainAspectRatio: false
      }
    });
  }

  // Pending tasks by category
  function countPendingByCategory(tasks) {
    const categories = ['Work','Personal','Wishlist','Birthdays'];
    const counts = { Work:0, Personal:0, Wishlist:0, Birthdays:0 };
    tasks.forEach(t => { if (!t.completed) counts[t.category] = (counts[t.category] || 0) + 1; });
    return categories.map(cat => counts[cat]);
  }

  function renderCategoryDonut(counts) {
    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: ['Work','Personal','Wishlist','Birthdays'],
        datasets: [{
          data: counts,
          backgroundColor: [COLORS.blue, COLORS.orange, COLORS.green, COLORS.pink],
          hoverOffset: 6
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } } },
        maintainAspectRatio: false
      }
    });
  }

  // Upcoming pending tasks (next 7 days)
  function getUpcomingTasks(tasks) {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return tasks
      .filter(t => !t.completed && t.due_date && new Date(t.due_date) >= today && new Date(t.due_date) <= nextWeek)
      .sort((a,b) => new Date(a.due_date) - new Date(b.due_date));
  }

  function renderUpcomingTasks(tasks) {
    upcomingTasksEl.innerHTML = '';
    if (!tasks.length) {
      upcomingTasksEl.innerHTML = '<li>No pending tasks in the upcoming week</li>';
      return;
    }
    tasks.forEach(t => {
      const li = document.createElement('li');
      li.textContent = `${t.title || 'Untitled Task'} — Due: ${new Date(t.due_date).toLocaleDateString()}`;
      upcomingTasksEl.appendChild(li);
    });
  }

  // Update everything
  async function updateAll() {
    const tasks = await fetchTasks();

    // Stats
    const { completed, pending } = countCompletedPending(tasks);
    completedCountEl.textContent = completed;
    pendingCountEl.textContent = pending;

    // Charts
    renderPie(completed, pending);
    renderCategoryDonut(countPendingByCategory(tasks));

    // Upcoming tasks
    const upcoming = getUpcomingTasks(tasks);
    renderUpcomingTasks(upcoming);
  }

  // Navigation buttons
  document.getElementById('nav-tasks').addEventListener('click', () => window.location.href = '/dashboard');
  document.getElementById('nav-calendar').addEventListener('click', () => window.location.href = '/calendar');
  document.getElementById('nav-profile').addEventListener('click', () => window.location.href = '/overview');

  updateAll();
});
