document.addEventListener('DOMContentLoaded', () => {
    // Chart.js Configuration
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    let labels = Array.from({length: 20}, (_, i) => i + ':00');
    let throughputData = [450, 480, 520, 600, 750, 900, 1100, 1200, 1150, 1000, 950, 800, 750, 700, 650, 600, 550, 500, 480, 450];
    let latencyData = [1.2, 1.3, 1.2, 1.4, 1.6, 1.8, 2.1, 2.3, 2.2, 1.9, 1.7, 1.5, 1.4, 1.3, 1.2, 1.2, 1.1, 1.1, 1.2, 1.2];

    const performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Throughput (req/s)',
                    data: throughputData,
                    borderColor: '#0061ff',
                    backgroundColor: 'rgba(0, 97, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Latency (ms)',
                    data: latencyData,
                    borderColor: '#60efff',
                    borderDash: [5, 5],
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: { display: false }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Real-time Data Simulation
    setInterval(() => {
        // Update Hit Ratio
        const hitRatioEl = document.getElementById('hit-ratio');
        let currentRatio = parseFloat(hitRatioEl.innerText);
        let newRatio = (currentRatio + (Math.random() * 0.4 - 0.2)).toFixed(1);
        hitRatioEl.innerText = newRatio + '%';

        // Update Latency
        const latencyEl = document.getElementById('latency');
        let currentLat = parseFloat(latencyEl.innerText);
        let newLat = (currentLat + (Math.random() * 0.2 - 0.1)).toFixed(1);
        latencyEl.innerText = newLat + 'ms';

        // Update Chart
        performanceChart.data.datasets[0].data.shift();
        performanceChart.data.datasets[0].data.push(Math.floor(Math.random() * 500) + 500);
        performanceChart.data.datasets[1].data.shift();
        performanceChart.data.datasets[1].data.push(Math.random() * 1 + 1);
        performanceChart.update('none');
    }, 3000);

    // Memory Pie Chart
    const memoryCtx = document.getElementById('memoryPieChart').getContext('2d');
    new Chart(memoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Used', 'Free'],
            datasets: [{
                data: [4.2, 3.8],
                backgroundColor: ['#0061ff', 'rgba(0, 97, 255, 0.05)'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            plugins: { legend: { display: false } },
            maintainAspectRatio: false
        }
    });

    // Real-time Log Simulation
    const logFeed = document.getElementById('log-feed');
    const statusTypes = ['status-ok', 'status-warn'];
    const logMessages = [
        'GET user:profile:982 - 0.4ms',
        'SET product:inventory:44 - 1.2ms',
        'Eviction policy triggered on Node 2',
        'New client connection from 192.168.1.45',
        'Keyspace notification: user:session expired'
    ];

    setInterval(() => {
        const entry = document.createElement('div');
        entry.className = 'log-entry animate-fade-up';
        const time = new Date().toLocaleTimeString([], { hour12: false });
        const status = statusTypes[Math.floor(Math.random() * statusTypes.length)];
        const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
        
        entry.innerHTML = `
            <span class="log-time">${time}</span>
            <span class="log-status ${status}">[${status === 'status-ok' ? 'OK' : 'WARN'}]</span>
            <span>${msg}</span>
        `;
        
        logFeed.prepend(entry);
        if (logFeed.children.length > 20) {
            logFeed.removeChild(logFeed.lastChild);
        }
    }, 4000);

    // Invalidation Pattern Toggle
    const patternSelect = document.getElementById('patternSelect');
    const patternDetails = document.getElementById('patternDetails');

    const patterns = {
        'write-through': {
            title: 'Write-Through Caching',
            desc: 'Updates the cache and the data store simultaneously. Ensures strong consistency but adds write latency.'
        },
        'write-behind': {
            title: 'Write-Behind (Asynchronous)',
            desc: 'Updates the data store asynchronously after updating the cache. High write performance but risk of data loss on crash.'
        },
        'refresh-ahead': {
            title: 'Refresh-Ahead',
            desc: 'Automatically reloads frequently accessed keys before they expire. Great for read-heavy systems with predictable patterns.'
        },
        'cache-aside': {
            title: 'Cache-Aside (Lazy Loading)',
            desc: 'Loads data into the cache only when it is requested. Best for general-purpose workloads with unpredictable access patterns.'
        }
    };

    if (patternSelect && patternDetails) {
        patternSelect.addEventListener('change', (e) => {
            const pattern = patterns[e.target.value];
            patternDetails.innerHTML = `
                <p class="mb-1 fw-bold text-primary">${pattern.title}</p>
                <p class="mb-0 opacity-75">${pattern.desc}</p>
            `;
        });
    }

    // Sidebar Active State and View Switching
    const navLinks = document.querySelectorAll('.nav-menu-link');
    const views = document.querySelectorAll('.dashboard-view');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Switch views
                views.forEach(view => {
                    view.classList.remove('active');
                    if (view.id === targetId) {
                        view.classList.add('active');
                        // Initialize view-specific charts if needed
                        initializeViewCharts(targetId);
                    }
                });

                // Close sidebar on mobile after clicking
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('show');
                    sidebarToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
                }
            }
        });
    });

    function initializeViewCharts(viewId) {
        if (viewId === 'cluster-health' && !window.shardChart) {
            const shardCtx = document.getElementById('shardChart').getContext('2d');
            window.shardChart = new Chart(shardCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Shard 1', 'Shard 2', 'Shard 3'],
                    datasets: [{
                        data: [5461, 5461, 5462],
                        backgroundColor: ['#0061ff', '#60efff', '#10b981']
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }

        if (viewId === 'memory-audit' && !window.keyTypeChart) {
            const ktCtx = document.getElementById('keyTypeChart').getContext('2d');
            window.keyTypeChart = new Chart(ktCtx, {
                type: 'pie',
                data: {
                    labels: ['Strings', 'Hashes', 'Lists', 'Sets', 'ZSets'],
                    datasets: [{
                        data: [45, 30, 10, 10, 5],
                        backgroundColor: ['#0061ff', '#60efff', '#10b981', '#f59e0b', '#ef4444']
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }
        
        if (viewId === 'latency-tuning' && !window.latencyBreakdownChart) {
            const latCtx = document.getElementById('latencyBreakdownChart').getContext('2d');
            window.latencyBreakdownChart = new Chart(latCtx, {
                type: 'radar',
                data: {
                    labels: ['GET', 'SET', 'HGETALL', 'LPUSH', 'SADD'],
                    datasets: [{
                        label: 'Latency (ms)',
                        data: [0.5, 1.2, 4.5, 0.8, 1.1],
                        borderColor: '#0061ff',
                        backgroundColor: 'rgba(0, 97, 255, 0.1)'
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            pointLabels: { 
                                color: 'rgba(255, 255, 255, 0.7)',
                                font: { size: 10 }
                            },
                            ticks: { display: false }
                        }
                    }
                }
            });
        }
    }

    // Log Filtering
    const logFilters = document.getElementById('logFilters');
    if (logFilters) {
        logFilters.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const filter = e.target.getAttribute('data-filter');
                
                // Update active button
                logFilters.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Filter logs
                const logs = document.querySelectorAll('#full-log-feed .log-entry');
                logs.forEach(log => {
                    if (filter === 'all') {
                        log.style.display = 'flex';
                    } else if (filter === 'ok') {
                        log.style.display = log.querySelector('.status-ok') ? 'flex' : 'none';
                    } else if (filter === 'warn') {
                        log.style.display = log.querySelector('.status-warn') ? 'flex' : 'none';
                    }
                });
            }
        });
    }

    // Real-time Full Log Simulation
    const fullLogFeed = document.getElementById('full-log-feed');
    if (fullLogFeed) {
        setInterval(() => {
            const entry = document.createElement('div');
            entry.className = 'log-entry animate-fade-up';
            const time = new Date().toLocaleTimeString([], { hour12: false });
            const status = statusTypes[Math.floor(Math.random() * statusTypes.length)];
            const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
            
            entry.innerHTML = `
                <span class="log-time">${time}</span>
                <span class="log-status ${status}">[${status === 'status-ok' ? 'OK' : 'WARN'}]</span>
                <span>${msg}</span>
            `;
            
            fullLogFeed.prepend(entry);
            if (fullLogFeed.children.length > 50) {
                fullLogFeed.removeChild(fullLogFeed.lastChild);
            }
        }, 2000);
    }

    // Mobile Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebar-mobile-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
            const icon = sidebarToggle.querySelector('i');
            if (sidebar.classList.contains('show')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && 
            sidebar.classList.contains('show') && 
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('show');
            sidebarToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
    });
});

function deployConfig() {
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = 'Deploying...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerText = 'Deployed Successfully!';
        btn.classList.replace('btn-premium', 'btn-success');
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.replace('btn-success', 'btn-premium');
            btn.disabled = false;
        }, 2000);
    }, 1500);
}
