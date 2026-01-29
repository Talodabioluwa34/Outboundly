const companies = [
    {
        name: "EcoStream",
        title: "Senior Product Designer",
        description: "Building the next generation of renewable energy monitoring platforms.",
        industry: "Green Tech",
        type: "Full-time",
        salary: "$140k – $180k",
        location: "Remote",
        postedAt: "12 min ago",
        color: "#10b981",
        aiInsight: { label: "Actively hiring", explanation: "EcoStream has increased their job postings by 40% this month, signaling strong growth." }
    },
    {
        name: "Lumina Design",
        title: "Visual Systems Lead",
        description: "A digital agency crafting high-end visual experiences for global brands.",
        industry: "Design Agency",
        type: "Full-time",
        salary: "$120k – $160k",
        location: "New York / Hybrid",
        postedAt: "45 min ago",
        color: "#ec4899",
        aiInsight: { label: "High Response Likelihood", explanation: "Based on previous outbound signals, Lumina's design team typically responds within 48 hours." }
    },
    {
        name: "Quasar Systems",
        title: "Distributed Systems Engineer",
        description: "Hyper-scale infrastructure for autonomous planetary exploration.",
        industry: "Aerospace",
        type: "Contract",
        salary: "$160k – $220k",
        location: "Remote (Global)",
        postedAt: "2 hours ago",
        color: "#6366f1",
        aiInsight: { label: "Recently funded", explanation: "Quasar Systems closed a $50M Series B last week, specifically for infrastructure scaling." }
    },
    {
        name: "Vortex AI",
        title: "ML Engineering Manager",
        description: "Scaling generative video infrastructure for the next generation of creators.",
        industry: "Artificial Intelligence",
        type: "Full-time",
        salary: "$190k – $250k",
        location: "San Francisco",
        postedAt: "3 hours ago",
        color: "#8b5cf6",
        aiInsight: { label: "High signal growth", explanation: "Headcount has increased by 15% in the engineering team over the last quarter." }
    },
    {
        name: "Nebula Health",
        title: "Lead Frontend Architect",
        description: "Reimagining patient data interoperability with privacy-first protocols.",
        industry: "Health Tech",
        type: "Full-time",
        salary: "$150k – $190k",
        location: "Austin / Remote",
        postedAt: "5 hours ago",
        color: "#06b6d4",
        aiInsight: { label: "Actively hiring", explanation: "Nebula Health just opened 3 new positions in their frontend team." }
    },
    {
        name: "AeroSynth",
        title: "Embedded C++ Developer",
        description: "Developing flight control software for hydrogen-powered vertical takeoff aircraft.",
        industry: "Aviation",
        type: "Full-time",
        salary: "$130k – $170k",
        location: "Seattle / Hybrid",
        postedAt: "1 day ago",
        color: "#f59e0b",
        aiInsight: { label: "Recently funded", explanation: "Secured a $100M government contract for eco-friendly aviation R&D." }
    }
];

// Mock API Key (as requested)
const MOCK_API_KEY = "sk-outboundly-xxxxxxxxxxxx";

let searchBtn, searchInput, resultsSection, resultsList, recentSearchesContainer, recentPillsContainer;

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements
    searchBtn = document.getElementById('search-btn');
    searchInput = document.getElementById('job-search');
    resultsSection = document.getElementById('results-section');
    resultsList = document.getElementById('results-list');
    recentSearchesContainer = document.getElementById('recent-searches');
    recentPillsContainer = document.getElementById('recent-pills');

    updateRecentSearchesUI();
    initSuggestionChips();
    initScrollReveal();
    initStickyNav();

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                saveRecentSearch(query);
                performSearch();
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    saveRecentSearch(query);
                    performSearch();
                }
            }
        });
    }
});

/**
 * Scroll Reveal Narrative logic
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // stop observing once it's revealed to keep it simple and performant
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));
}

function initStickyNav() {
    const nav = document.getElementById('sticky-nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

function initSuggestionChips() {
    const chips = document.querySelectorAll('.suggestion-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            searchInput.value = chip.textContent;
            searchInput.focus();
            // Subtle visual feedback
            chip.style.transform = 'scale(0.95)';
            setTimeout(() => chip.style.transform = '', 100);
        });
    });
}



/**
 * Handle Recent Searches
 */
function saveRecentSearch(query) {
    if (!query) return;

    let history = JSON.parse(localStorage.getItem('outboundly_history')) || [];

    // Remove if already exists (to bump to front)
    history = history.filter(item => item.toLowerCase() !== query.toLowerCase());

    // Add to front
    history.unshift(query);

    // Keep only last 3
    history = history.slice(0, 3);

    localStorage.setItem('outboundly_history', JSON.stringify(history));
    updateRecentSearchesUI();
}

function updateRecentSearchesUI() {
    if (!recentSearchesContainer || !recentPillsContainer) return;

    const history = JSON.parse(localStorage.getItem('outboundly_history')) || [];

    if (history.length === 0) {
        recentSearchesContainer.classList.add('hidden');
        return;
    }

    recentSearchesContainer.classList.remove('hidden');
    recentPillsContainer.innerHTML = '';

    history.forEach(query => {
        const pill = document.createElement('div');
        pill.className = 'search-pill';
        pill.textContent = query;
        pill.addEventListener('click', () => {
            searchInput.value = query;
            performSearch();
            // Re-save to bump priority
            saveRecentSearch(query);
        });
        recentPillsContainer.appendChild(pill);
    });
}

/**
 * Mock LLM call to generate insights
 * In a real app, this would be a fetch() call to a backend or OpenAI
 */
async function callAIAPI(companyName, description) {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const summaries = {
        "EcoStream": "EcoStream is a pioneer in green-tech, specializing in real-time grid analytics. They are rapidly scaling their engineering team to meet the demands of global energy transitions.",
        "Lumina Design": "Lumina is a boutique studio known for pixel-perfect interfaces and brand strategy. They work with Fortune 500 companies to redefine their digital presence through immersive UX.",
        "Quasar Systems": "Quasar is pushing the boundaries of edge computing in deep space. They are currently developing low-latency protocols for Martian orbital relay stations."
    };

    const outreachMessages = {
        "EcoStream": "Hi there! I've been following EcoStream's work in renewable grid monitoring and I'm inspired by your mission. I'd love to discuss how my experience in data visualization could help your team drive the green energy transition.",
        "Lumina Design": "Hello! As a designer who values craft and high-fidelity prototypes, Lumina's recent work for global brands caught my eye. I'm curious to learn more about your creative process and potential collaboration.",
        "Quasar Systems": "Hi! Your work on autonomous infrastructure is fascinating. Given my background in distributed systems and a passion for space exploration, I'd love to connect and hear about the challenges Quasar is solving."
    };

    return {
        summary: summaries[companyName] || `A leading innovator in ${description.toLowerCase()}.`,
        outreach: outreachMessages[companyName] || `Hi! I saw your work on ${companyName} and would love to connect to discuss potential opportunities.`
    };
}

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    // If we're on the index page, redirect to discover page
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    if (isIndexPage) {
        window.location.href = `discover.html?q=${encodeURIComponent(query)}`;
        return;
    }

    if (!resultsList || !resultsSection) return;

    // Clear previous results
    resultsList.innerHTML = '';

    // Show results section
    resultsSection.classList.remove('hidden');

    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Initial render with loading states for AI sections
    companies.forEach((company, index) => {
        const card = document.createElement('div');
        card.className = 'company-card animate-card';
        card.id = `company-${index}`;
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="company-info">
                <h3>${company.name}</h3>
                <p class="company-description">${company.description}</p>
            </div>
            
            <div class="ai-insights">
                <div class="ai-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                    Intelligence Report
                </div>
                
                <div class="insight-group">
                    <div class="insight-label">Direct Target Summary</div>
                    <div class="loading-skeleton"></div>
                    <div class="loading-skeleton" style="width: 80%; margin-top: 5px;"></div>
                </div>

                <div class="insight-group">
                    <div class="insight-label">Recommended Outbound Outreach</div>
                    <div class="loading-skeleton"></div>
                    <div class="loading-skeleton" style="width: 60%; margin-top: 5px;"></div>
                </div>
            </div>

            <button class="btn-secondary">View company</button>
        `;

        resultsList.appendChild(card);

        // Lazily load AI insights for each card
        loadAIContent(company, card);
    });
}

async function loadAIContent(company, cardElement) {
    const insights = await callAIAPI(company.name, company.description);

    const insightsContainer = cardElement.querySelector('.ai-insights');

    // Replace skeletons with actual content
    insightsContainer.innerHTML = `
        <div class="ai-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
            Intelligence Report
        </div>
        
        <div class="insight-group">
            <div class="insight-label">Direct Target Summary</div>
            <p class="ai-summary">${insights.summary}</p>
        </div>

        <div class="insight-group">
            <div class="insight-label">Recommended Outbound Outreach</div>
            <div class="ai-outreach">${insights.outreach}</div>
        </div>
    `;
}

/**
 * Renders results specifically for the discovery page (linear list)
 */
function renderDiscoverResults() {
    const discoverList = document.getElementById('discover-list');
    if (!discoverList) return;

    discoverList.innerHTML = '';

    companies.forEach((company, index) => {
        const card = document.createElement('div');
        card.className = 'job-result-card';
        card.innerHTML = `
            <div class="card-main">
                <div class="company-logo-circle" style="background: ${company.color}">
                    ${company.name.charAt(0)}
                </div>
                <div class="job-info-group">
                    <div class="job-title-row">
                        <h3>${company.title}</h3>
                        <div class="ai-insight-badge">
                            <svg class="ai-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                            AI Insight: ${company.aiInsight.label}
                            <div class="tooltip">${company.aiInsight.explanation}</div>
                        </div>
                        <span class="posted-tag">${company.postedAt}</span>
                    </div>
                    <span class="company-name-muted">${company.name}</span>
                    <div class="card-meta-row">
                        <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                            ${company.industry}
                        </div>
                        <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            ${company.salary}
                        </div>
                        <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                            ${company.location}
                        </div>
                        <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            ${company.type}
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="bookmark-btn" title="Save Job">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </button>
                <button class="btn-details">View Details</button>
            </div>
        `;
        discoverList.appendChild(card);
    });

    // Update result info text if query exists
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
        document.getElementById('result-info').textContent = `Showing 1 – ${companies.length} of 124 results for "${query}"`;
    }
}

