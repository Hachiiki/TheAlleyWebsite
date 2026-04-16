const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.menu-toggle');
const closeBtn = document.querySelector('.close-btn');  

toggleBtn.addEventListener('click', () => {
    sidebar.style.left = '0';
});

closeBtn.addEventListener('click', () => {
    sidebar.style.left = '-250px';
});