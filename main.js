const companies = [
    {
        name: "EcoStream",
        description: "Building the next generation of renewable energy monitoring platforms.",
        color: "#10b981"
    },
    {
        name: "Lumina Design",
        description: "A digital agency crafting high-end visual experiences for global brands.",
        color: "#ec4899"
    },
    {
        name: "Quasar Systems",
        description: "Hyper-scale infrastructure for autonomous planetary exploration.",
        color: "#6366f1"
    }
];

const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('job-search');
const resultsSection = document.getElementById('results-section');
const resultsList = document.getElementById('results-list');

searchBtn.addEventListener('click', () => {
    performSearch();
});

// Allow search on Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const query = searchInput.value.trim();
    
    // Clear previous results
    resultsList.innerHTML = '';
    
    // Show results section
    resultsSection.classList.remove('hidden');
    
    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Render 3 fake results with staggered animation
    companies.forEach((company, index) => {
        const card = document.createElement('div');
        card.className = 'company-card animate-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="company-info">
                <div style="width: 40px; height: 8px; background: ${company.color}; border-radius: 4px; margin-bottom: 1rem;"></div>
                <h3>${company.name}</h3>
                <p class="company-description">${company.description}</p>
            </div>
            <button class="btn-secondary">View company</button>
        `;
        
        resultsList.appendChild(card);
    });
}
