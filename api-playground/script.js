/**
 * DecidrAI API Playground - Unified Script
 * Handles all microservice endpoints with visual and JSON responses
 */

// ====================================
// Configuration
// ====================================

const CONFIG = {
    services: {
        tool: { baseUrl: 'http://localhost:5003', name: 'Tool Service' },
        auth: { baseUrl: 'http://localhost:5002', name: 'Auth Service' },
        recommendation: { baseUrl: 'http://localhost:5001', name: 'Recommendation Service' },
        flow: { baseUrl: 'http://localhost:5004', name: 'Flow Service' },
        comparison: { baseUrl: 'http://localhost:5005', name: 'Comparison Service' },
        gateway: { baseUrl: 'http://localhost:4000', name: 'API Gateway' }
    }
};

// Detect current service from HTML data attribute
const currentService = document.documentElement.dataset.service || 'tool';
const SERVICE_URL = CONFIG.services[currentService]?.baseUrl || 'http://localhost:5003';

// ====================================
// DOM Elements
// ====================================

const elements = {
    // Common
    responsePre: document.getElementById('tool-response'),
    responseMeta: document.getElementById('response-meta'),
    healthStatus: document.getElementById('health-status'),
    visualResponse: document.getElementById('visual-response'),
    viewVisualBtn: document.getElementById('view-visual'),
    viewJsonBtn: document.getElementById('view-json'),

    // Tool Service
    healthBtn: document.getElementById('test-health-btn'),
    getToolsBtn: document.getElementById('get-tools-btn'),
    searchToolsBtn: document.getElementById('search-tools-btn'),
    getToolSlugBtn: document.getElementById('get-tool-slug-btn'),
    getRelatedBtn: document.getElementById('get-related-btn'),
    createToolBtn: document.getElementById('create-tool-btn'),
    updateToolBtn: document.getElementById('update-tool-btn'),
    deleteToolBtn: document.getElementById('delete-tool-btn'),
    searchInput: document.getElementById('search-input'),
    slugInput: document.getElementById('slug-input'),
    toolIdInput: document.getElementById('tool-id-input'),
    requestBodyInput: document.getElementById('request-body'),
    limitInput: document.getElementById('limit-input'),
    categorySelect: document.getElementById('category-select'),

    // Auth Service
    getMeBtn: document.getElementById('get-me-btn'),
    authTokenInput: document.getElementById('auth-token-input'),

    // Recommendation Service
    testRedisBtn: document.getElementById('test-redis-btn'),

    // Flow Service
    getFlowsBtn: document.getElementById('get-flows-btn'),
    getFlowSlugBtn: document.getElementById('get-flow-slug-btn'),
    startFlowBtn: document.getElementById('start-flow-btn'),
    startSlugInput: document.getElementById('start-slug-input'),
    sessionIdInput: document.getElementById('session-id-input'),
    getSessionBtn: document.getElementById('get-session-btn'),
    submitAnswerBtn: document.getElementById('submit-answer-btn'),
    answerBodyInput: document.getElementById('answer-body'),
    completeFlowBtn: document.getElementById('complete-flow-btn'),
    createFlowBtn: document.getElementById('create-flow-btn'),
    updateFlowBtn: document.getElementById('update-flow-btn'),
    deleteFlowBtn: document.getElementById('delete-flow-btn'),
    flowIdInput: document.getElementById('flow-id-input'),

    // Recommendation Service
    tagsInput: document.getElementById('tags-input'),
    recommendTagsBtn: document.getElementById('recommend-tags-btn'),
    recommendSessionBtn: document.getElementById('recommend-session-btn'),
    useAICheckbox: document.getElementById('use-ai-checkbox'),

    // Comparison Service
    toolsInput: document.getElementById('tools-input'),
    compareGetBtn: document.getElementById('compare-get-btn'),
    toolsArrayInput: document.getElementById('tools-array-input'),
    comparePostBtn: document.getElementById('compare-post-btn'),
    popularBtn: document.getElementById('popular-btn'),

    // Gateway Service
    testServicesBtn: document.getElementById('test-services-btn'),
    echoMethod: document.getElementById('echo-method'),
    echoBtn: document.getElementById('echo-btn'),
    authToken: document.getElementById('auth-token'),
    protectedBtn: document.getElementById('protected-btn'),
    proxyToolsBtn: document.getElementById('proxy-tools-btn'),
    proxyFlowsBtn: document.getElementById('proxy-flows-btn'),
    compareSlugs: document.getElementById('compare-slugs'),
    proxyCompareBtn: document.getElementById('proxy-compare-btn')
};

// ====================================
// Utilities
// ====================================

/**
 * Syntax highlight JSON for display
 */
function syntaxHighlight(json) {
    if (typeof json !== 'string') {
        json = JSON.stringify(json, null, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
            let cls = 'number';
            if (/^"/.test(match)) {
                cls = /:$/.test(match) ? 'key' : 'string';
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return `<span class="${cls}">${match}</span>`;
        }
    );
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ====================================
// View Toggle
// ====================================

let currentView = 'visual';

function toggleView(mode) {
    currentView = mode;
    if (elements.viewVisualBtn && elements.viewJsonBtn) {
        if (mode === 'visual') {
            elements.viewVisualBtn.classList.add('active');
            elements.viewJsonBtn.classList.remove('active');
            if (elements.visualResponse) elements.visualResponse.style.display = 'block';
            if (elements.responsePre) elements.responsePre.style.display = 'none';
        } else {
            elements.viewVisualBtn.classList.remove('active');
            elements.viewJsonBtn.classList.add('active');
            if (elements.visualResponse) elements.visualResponse.style.display = 'none';
            if (elements.responsePre) elements.responsePre.style.display = 'block';
        }
    }
}

// ====================================
// Visual Renderers
// ====================================

const visualRenderers = {
    /**
     * Render loading state
     */
    loading() {
        return `
            <div class="empty-state">
                <div class="icon">⏳</div>
                <h3>Loading...</h3>
                <p>Fetching data from the server</p>
            </div>
        `;
    },

    /**
     * Render error state
     */
    error(message) {
        return `
            <div class="empty-state fade-in">
                <div class="icon">❌</div>
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
    },

    /**
     * Render health check
     */
    health(data, isSuccess) {
        const dbStatus = data.db || data.mongodb || data.database || 'Unknown';
        return `
            <div class="health-visual fade-in">
                <div class="health-icon ${isSuccess ? 'success' : 'error'}">
                    ${isSuccess ? '✅' : '❌'}
                </div>
                <div class="health-title">${isSuccess ? 'Service Healthy' : 'Service Error'}</div>
                <div class="health-subtitle">All systems ${isSuccess ? 'operational' : 'experiencing issues'}</div>
                <div class="health-details">
                    <div class="health-detail">
                        <span class="status-dot" style="background: ${isSuccess ? 'var(--success)' : 'var(--error)'}"></span>
                        <span>Status: ${data.status || 'unknown'}</span>
                    </div>
                    <div class="health-detail">
                        <span class="status-dot" style="background: ${dbStatus !== 'Unknown' ? 'var(--success)' : 'var(--warning)'}"></span>
                        <span>Database: ${dbStatus}</span>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render tools grid
     */
    toolsGrid(tools) {
        if (!tools || tools.length === 0) {
            return `
                <div class="empty-state fade-in">
                    <div class="icon">📭</div>
                    <h3>No Tools Found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
        }

        const cards = tools.map((tool, index) => `
            <div class="tool-card fade-in" style="animation-delay: ${index * 50}ms">
                <h3>${tool.name || 'Unknown Tool'}</h3>
                <div class="desc">${tool.short_description || tool.description || 'No description available'}</div>
                <div class="meta">
                    <span class="tag">${tool.categories?.[0] || 'Uncategorized'}</span>
                    <span style="font-size: 0.75rem; color: var(--text-tertiary);">
                        ${tool.pricing?.model || 'Free'}
                    </span>
                </div>
            </div>
        `).join('');

        return `<div class="tools-grid">${cards}</div>`;
    },

    /**
     * Render single tool detail
     */
    toolDetail(tool) {
        const categories = (tool.categories || [])
            .map(cat => `<span class="tag">${cat}</span>`)
            .join('');

        const features = (tool.features || [])
            .slice(0, 5)
            .map(f => `<li>${f}</li>`)
            .join('');

        return `
            <div class="tool-card fade-in" style="max-width: 600px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="font-size: 1.5rem; margin-bottom: 0.25rem;">${tool.name}</h3>
                        <div style="font-size: 0.8rem; color: var(--text-tertiary);">/${tool.slug}</div>
                    </div>
                    <span class="tag" style="background: var(--accent-glow); color: var(--accent-tertiary);">
                        ${tool.pricing?.model || 'Free'}
                    </span>
                </div>
                
                <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
                    ${tool.long_description || tool.description || 'No description available.'}
                </p>

                ${features ? `
                    <div style="margin-bottom: 1rem;">
                        <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-tertiary); margin-bottom: 0.5rem;">Features</div>
                        <ul style="padding-left: 1rem; color: var(--text-secondary); font-size: 0.875rem; line-height: 1.8;">
                            ${features}
                        </ul>
                    </div>
                ` : ''}

                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    ${categories}
                </div>

                <div class="meta" style="font-size: 0.8rem;">
                    <span>Views: ${tool.view_count || 0}</span>
                    <span>Status: <span style="color: ${tool.status === 'active' ? 'var(--success)' : 'var(--warning)'};">${tool.status || 'unknown'}</span></span>
                </div>
            </div>
        `;
    },

    /**
     * Render user profile
     */
    userProfile(user) {
        const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '') || '?';
        return `
            <div class="user-card fade-in">
                <div class="user-avatar">${initials}</div>
                <div class="user-name">${user.firstName || ''} ${user.lastName || ''}</div>
                <div class="user-email">${user.email || 'No email'}</div>
                <div class="user-meta">
                    <div class="user-meta-item">
                        <div class="label">Joined</div>
                        <div class="value">${formatDate(user.createdAt)}</div>
                    </div>
                    <div class="user-meta-item">
                        <div class="label">Role</div>
                        <div class="value">${user.role || 'User'}</div>
                    </div>
                    <div class="user-meta-item">
                        <div class="label">Status</div>
                        <div class="value" style="color: var(--success);">Active</div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render Redis test result
     */
    redisTest(data) {
        const isWorking = data.redisWorking === true;
        return `
            <div class="health-visual fade-in">
                <div class="health-icon ${isWorking ? 'success' : 'error'}">
                    ${isWorking ? '🔴' : '❌'}
                </div>
                <div class="health-title">Redis ${isWorking ? 'Connected' : 'Error'}</div>
                <div class="health-subtitle">${isWorking ? 'Cache layer is operational' : 'Redis connection failed'}</div>
            </div>
        `;
    },

    /**
     * Render success message
     */
    success(message, details = null) {
        return `
            <div class="empty-state fade-in">
                <div class="icon">✅</div>
                <h3>${message}</h3>
                ${details ? `<p>${details}</p>` : ''}
            </div>
        `;
    }
};

/**
 * Render visual response based on data type
 */
function renderVisual(data, endpoint = '') {
    if (!elements.visualResponse) return;

    // Health check
    if (endpoint.includes('/health')) {
        elements.visualResponse.innerHTML = visualRenderers.health(data, data.status === 'ok');
        return;
    }

    // Redis test
    if (endpoint.includes('/redis-test')) {
        elements.visualResponse.innerHTML = visualRenderers.redisTest(data);
        return;
    }

    // User profile (/me)
    if (endpoint.includes('/me') && data && (data.firstName || data.email || data.clerkId)) {
        elements.visualResponse.innerHTML = visualRenderers.userProfile(data);
        return;
    }

    // Success response with user data
    if (data?.success && data?.data && (data.data.firstName || data.data.email)) {
        elements.visualResponse.innerHTML = visualRenderers.userProfile(data.data);
        return;
    }

    // Tools list
    if (data?.success && data?.data?.tools && Array.isArray(data.data.tools)) {
        elements.visualResponse.innerHTML = visualRenderers.toolsGrid(data.data.tools);
        return;
    }

    // Single tool
    if (data?.success && data?.data?.name && data?.data?.slug) {
        elements.visualResponse.innerHTML = visualRenderers.toolDetail(data.data);
        return;
    }

    // Direct array of tools
    const toolsArray = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : null);
    if (toolsArray) {
        elements.visualResponse.innerHTML = visualRenderers.toolsGrid(toolsArray);
        return;
    }

    // Success message for mutations
    if (data?.success && data?.message) {
        elements.visualResponse.innerHTML = visualRenderers.success(data.message);
        return;
    }

    // Default: No visual available
    elements.visualResponse.innerHTML = `
        <div class="empty-state fade-in">
            <div class="icon">📋</div>
            <h3>Response Received</h3>
            <p>Switch to JSON view for detailed data</p>
        </div>
    `;
}

// ====================================
// API Fetcher
// ====================================

async function fetchAPI(url, options = {}) {
    const startTime = performance.now();
    const method = options.method || 'GET';
    const displayUrl = url.replace(SERVICE_URL, '');

    // Update meta
    if (elements.responseMeta) {
        elements.responseMeta.textContent = `${method} ${displayUrl} ...`;
        elements.responseMeta.className = 'meta-tag';
    }

    // Show loading state
    if (elements.responsePre) {
        elements.responsePre.textContent = 'Loading...';
    }
    if (elements.visualResponse) {
        elements.visualResponse.innerHTML = visualRenderers.loading();
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(0);

        // Update JSON view
        if (elements.responsePre) {
            elements.responsePre.innerHTML = syntaxHighlight(data);
        }

        // Update visual view
        renderVisual(data, displayUrl);

        // Update meta
        if (elements.responseMeta) {
            elements.responseMeta.textContent = `${response.status} ${response.statusText} • ${duration}ms`;
            elements.responseMeta.className = `meta-tag ${response.ok ? 'success' : 'error'}`;
        }

        return { success: response.ok, data, status: response.status };

    } catch (error) {
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(0);

        // Update JSON view
        if (elements.responsePre) {
            elements.responsePre.textContent = `Error: ${error.message}\n\nMake sure the service is running at ${SERVICE_URL}`;
        }

        // Update visual view
        if (elements.visualResponse) {
            elements.visualResponse.innerHTML = visualRenderers.error(`Failed to connect to ${SERVICE_URL}`);
        }

        // Update meta
        if (elements.responseMeta) {
            elements.responseMeta.textContent = `Network Error • ${duration}ms`;
            elements.responseMeta.className = 'meta-tag error';
        }

        return { success: false, error };
    }
}

// ====================================
// Event Listeners - Tool Service
// ====================================

function initToolServiceListeners() {
    // Health Check
    if (elements.healthBtn) {
        elements.healthBtn.addEventListener('click', async () => {
            if (elements.healthStatus) {
                elements.healthStatus.className = 'status-indicator status-loading';
            }
            const result = await fetchAPI(`${SERVICE_URL}/health`);
            if (elements.healthStatus) {
                elements.healthStatus.className = `status-indicator ${result.success ? 'status-success' : 'status-error'}`;
            }
        });
    }

    // Get All Tools
    if (elements.getToolsBtn) {
        elements.getToolsBtn.addEventListener('click', () => {
            let url = `${SERVICE_URL}/tools`;
            const params = new URLSearchParams();

            if (elements.limitInput?.value) {
                params.append('limit', elements.limitInput.value);
            }
            if (elements.categorySelect?.value) {
                params.append('category', elements.categorySelect.value);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            fetchAPI(url);
        });
    }

    // Search Tools
    if (elements.searchToolsBtn) {
        elements.searchToolsBtn.addEventListener('click', () => {
            const query = elements.searchInput?.value.trim();
            if (!query) {
                alert('Please enter a search query');
                return;
            }
            fetchAPI(`${SERVICE_URL}/tools/search?q=${encodeURIComponent(query)}`);
        });
    }

    // Get Tool by Slug
    if (elements.getToolSlugBtn) {
        elements.getToolSlugBtn.addEventListener('click', () => {
            const slug = elements.slugInput?.value.trim();
            if (!slug) {
                alert('Please enter a tool slug');
                return;
            }
            fetchAPI(`${SERVICE_URL}/tools/${encodeURIComponent(slug)}`);
        });
    }

    // Get Related Tools
    if (elements.getRelatedBtn) {
        elements.getRelatedBtn.addEventListener('click', () => {
            const slug = elements.slugInput?.value.trim();
            if (!slug) {
                alert('Please enter a tool slug');
                return;
            }
            fetchAPI(`${SERVICE_URL}/tools/${encodeURIComponent(slug)}/related`);
        });
    }

    // Create Tool (Admin)
    if (elements.createToolBtn) {
        elements.createToolBtn.addEventListener('click', () => {
            let body;
            try {
                body = JSON.parse(elements.requestBodyInput?.value || '{}');
            } catch (e) {
                alert('Invalid JSON in request body');
                return;
            }
            fetchAPI(`${SERVICE_URL}/admin/tools`, {
                method: 'POST',
                body: JSON.stringify(body)
            });
        });
    }

    // Update Tool (Admin)
    if (elements.updateToolBtn) {
        elements.updateToolBtn.addEventListener('click', () => {
            const id = elements.toolIdInput?.value.trim();
            if (!id) {
                alert('Please enter a tool ID');
                return;
            }
            let body;
            try {
                body = JSON.parse(elements.requestBodyInput?.value || '{}');
            } catch (e) {
                alert('Invalid JSON in request body');
                return;
            }
            fetchAPI(`${SERVICE_URL}/admin/tools/${encodeURIComponent(id)}`, {
                method: 'PATCH',
                body: JSON.stringify(body)
            });
        });
    }

    // Delete Tool (Admin)
    if (elements.deleteToolBtn) {
        elements.deleteToolBtn.addEventListener('click', () => {
            const id = elements.toolIdInput?.value.trim();
            if (!id) {
                alert('Please enter a tool ID');
                return;
            }
            if (!confirm('Are you sure you want to delete this tool?')) {
                return;
            }
            fetchAPI(`${SERVICE_URL}/admin/tools/${encodeURIComponent(id)}`, {
                method: 'DELETE'
            });
        });
    }

    // Enter key support
    if (elements.searchInput) {
        elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') elements.searchToolsBtn?.click();
        });
    }
    if (elements.slugInput) {
        elements.slugInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') elements.getToolSlugBtn?.click();
        });
    }
}

// ====================================
// Event Listeners - Auth Service
// ====================================

function initAuthServiceListeners() {
    // Health Check
    if (elements.healthBtn) {
        elements.healthBtn.addEventListener('click', async () => {
            if (elements.healthStatus) {
                elements.healthStatus.className = 'status-indicator status-loading';
            }
            const result = await fetchAPI(`${SERVICE_URL}/health`);
            if (elements.healthStatus) {
                elements.healthStatus.className = `status-indicator ${result.success ? 'status-success' : 'status-error'}`;
            }
        });
    }

    // Get Current User (/me)
    if (elements.getMeBtn) {
        elements.getMeBtn.addEventListener('click', () => {
            const token = elements.authTokenInput?.value.trim();
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            fetchAPI(`${SERVICE_URL}/me`, { headers });
        });
    }
}

// ====================================
// Event Listeners - Recommendation Service
// ====================================

function initRecommendationServiceListeners() {
    // Health Check
    if (elements.healthBtn) {
        elements.healthBtn.addEventListener('click', async () => {
            if (elements.healthStatus) {
                elements.healthStatus.className = 'status-indicator status-loading';
            }
            const result = await fetchAPI(`${SERVICE_URL}/health`);
            if (elements.healthStatus) {
                elements.healthStatus.className = `status-indicator ${result.success ? 'status-success' : 'status-error'}`;
            }
        });
    }

    // Test Redis
    if (elements.testRedisBtn) {
        elements.testRedisBtn.addEventListener('click', () => {
            fetchAPI(`${SERVICE_URL}/redis-test`);
        });
    }

    // Recommend by Tags
    if (elements.recommendTagsBtn) {
        elements.recommendTagsBtn.addEventListener('click', () => {
            let tags;
            try {
                tags = JSON.parse(elements.tagsInput?.value || '[]');
            } catch (e) {
                alert('Invalid JSON in tags input. Use format: ["tag1", "tag2"]');
                return;
            }
            if (!Array.isArray(tags) || tags.length === 0) {
                alert('Please enter at least one tag');
                return;
            }
            const limit = elements.limitInput?.value || 3;
            const useAI = elements.useAICheckbox?.checked ?? true;

            fetchAPI(`${SERVICE_URL}/recommend`, {
                method: 'POST',
                body: JSON.stringify({ tags, limit: Number(limit), useAI })
            });
        });
    }

    // Recommend by Session
    if (elements.recommendSessionBtn) {
        elements.recommendSessionBtn.addEventListener('click', () => {
            const sessionId = elements.sessionIdInput?.value.trim();
            if (!sessionId) {
                alert('Please enter a session ID');
                return;
            }
            fetchAPI(`${SERVICE_URL}/recommend/session/${encodeURIComponent(sessionId)}`);
        });
    }
}

// ====================================
// Event Listeners - Flow Service
// ====================================

function initFlowServiceListeners() {
    // Health Check
    if (elements.healthBtn) {
        elements.healthBtn.addEventListener('click', async () => {
            if (elements.healthStatus) {
                elements.healthStatus.className = 'status-indicator status-loading';
            }
            const result = await fetchAPI(`${SERVICE_URL}/health`);
            if (elements.healthStatus) {
                elements.healthStatus.className = `status-indicator ${result.success ? 'status-success' : 'status-error'}`;
            }
        });
    }

    // Get All Flows
    if (elements.getFlowsBtn) {
        elements.getFlowsBtn.addEventListener('click', () => {
            let url = `${SERVICE_URL}/flows`;
            const params = new URLSearchParams();

            if (elements.categorySelect?.value) {
                params.append('category', elements.categorySelect.value);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            fetchAPI(url);
        });
    }

    // Get Flow by Slug
    if (elements.getFlowSlugBtn) {
        elements.getFlowSlugBtn.addEventListener('click', () => {
            const slug = elements.slugInput?.value.trim();
            if (!slug) {
                alert('Please enter a flow slug');
                return;
            }
            fetchAPI(`${SERVICE_URL}/flows/${encodeURIComponent(slug)}`);
        });
    }

    // Start Flow
    if (elements.startFlowBtn) {
        elements.startFlowBtn.addEventListener('click', () => {
            const slug = elements.startSlugInput?.value.trim();
            if (!slug) {
                alert('Please enter a flow slug');
                return;
            }
            fetchAPI(`${SERVICE_URL}/flows/${encodeURIComponent(slug)}/start`, {
                method: 'POST',
                body: JSON.stringify({})
            });
        });
    }

    // Get Session
    if (elements.getSessionBtn) {
        elements.getSessionBtn.addEventListener('click', () => {
            const sessionId = elements.sessionIdInput?.value.trim();
            if (!sessionId) {
                alert('Please enter a session ID');
                return;
            }
            fetchAPI(`${SERVICE_URL}/flows/sessions/${encodeURIComponent(sessionId)}`);
        });
    }

    // Submit Answer
    if (elements.submitAnswerBtn) {
        elements.submitAnswerBtn.addEventListener('click', () => {
            const sessionId = elements.sessionIdInput?.value.trim();
            if (!sessionId) {
                alert('Please enter a session ID');
                return;
            }
            let body;
            try {
                body = JSON.parse(elements.answerBodyInput?.value || '{}');
            } catch (e) {
                alert('Invalid JSON in answer body');
                return;
            }
            fetchAPI(`${SERVICE_URL}/flows/sessions/${encodeURIComponent(sessionId)}/answer`, {
                method: 'POST',
                body: JSON.stringify(body)
            });
        });
    }

    // Complete Flow
    if (elements.completeFlowBtn) {
        elements.completeFlowBtn.addEventListener('click', () => {
            const sessionId = elements.sessionIdInput?.value.trim();
            if (!sessionId) {
                alert('Please enter a session ID');
                return;
            }
            fetchAPI(`${SERVICE_URL}/flows/sessions/${encodeURIComponent(sessionId)}/complete`, {
                method: 'POST'
            });
        });
    }

    // Create Flow (Admin)
    if (elements.createFlowBtn) {
        elements.createFlowBtn.addEventListener('click', () => {
            let body;
            try {
                body = JSON.parse(elements.requestBodyInput?.value || '{}');
            } catch (e) {
                alert('Invalid JSON in request body');
                return;
            }
            fetchAPI(`${SERVICE_URL}/admin/flows`, {
                method: 'POST',
                body: JSON.stringify(body)
            });
        });
    }

    // Update Flow (Admin)
    if (elements.updateFlowBtn) {
        elements.updateFlowBtn.addEventListener('click', () => {
            const id = elements.flowIdInput?.value.trim();
            if (!id) {
                alert('Please enter a flow ID');
                return;
            }
            let body;
            try {
                body = JSON.parse(elements.requestBodyInput?.value || '{}');
            } catch (e) {
                alert('Invalid JSON in request body');
                return;
            }
            fetchAPI(`${SERVICE_URL}/admin/flows/${encodeURIComponent(id)}`, {
                method: 'PATCH',
                body: JSON.stringify(body)
            });
        });
    }

    // Delete Flow (Admin)
    if (elements.deleteFlowBtn) {
        elements.deleteFlowBtn.addEventListener('click', () => {
            const id = elements.flowIdInput?.value.trim();
            if (!id) {
                alert('Please enter a flow ID');
                return;
            }
            if (!confirm('Are you sure you want to delete this flow?')) {
                return;
            }
            fetchAPI(`${SERVICE_URL}/admin/flows/${encodeURIComponent(id)}`, {
                method: 'DELETE'
            });
        });
    }

    // Enter key support for slug input
    if (elements.slugInput) {
        elements.slugInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') elements.getFlowSlugBtn?.click();
        });
    }
}

// ====================================
// Event Listeners - Comparison Service
// ====================================

function initComparisonServiceListeners() {
    // Health Check
    if (elements.healthBtn) {
        elements.healthBtn.addEventListener('click', async () => {
            if (elements.healthStatus) {
                elements.healthStatus.className = 'status-indicator status-loading';
            }
            const result = await fetchAPI(`${SERVICE_URL}/health`);
            if (elements.healthStatus) {
                elements.healthStatus.className = `status-indicator ${result.success ? 'status-success' : 'status-error'}`;
            }
        });
    }

    // Compare by slugs (GET)
    if (elements.compareGetBtn) {
        elements.compareGetBtn.addEventListener('click', () => {
            const tools = elements.toolsInput?.value.trim();
            if (!tools) {
                alert('Please enter tool slugs (comma-separated)');
                return;
            }
            fetchAPI(`${SERVICE_URL}/compare?tools=${encodeURIComponent(tools)}`);
        });
    }

    // Compare (POST - force regenerate)
    if (elements.comparePostBtn) {
        elements.comparePostBtn.addEventListener('click', () => {
            let tools;
            try {
                tools = JSON.parse(elements.toolsArrayInput?.value || '[]');
            } catch (e) {
                alert('Invalid JSON. Use format: ["slug1", "slug2"]');
                return;
            }
            if (!Array.isArray(tools) || tools.length < 2) {
                alert('Please enter at least 2 tool slugs');
                return;
            }
            fetchAPI(`${SERVICE_URL}/compare`, {
                method: 'POST',
                body: JSON.stringify({ tools })
            });
        });
    }

    // Popular comparisons
    if (elements.popularBtn) {
        elements.popularBtn.addEventListener('click', () => {
            fetchAPI(`${SERVICE_URL}/compare/popular`);
        });
    }

    // Enter key support
    if (elements.toolsInput) {
        elements.toolsInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') elements.compareGetBtn?.click();
        });
    }
}

// ====================================
// Event Listeners - Gateway Service
// ====================================

function initGatewayServiceListeners() {
    // Health Check
    if (elements.healthBtn) {
        elements.healthBtn.addEventListener('click', async () => {
            if (elements.healthStatus) {
                elements.healthStatus.className = 'status-indicator status-loading';
            }
            const result = await fetchAPI(`${SERVICE_URL}/health`);
            if (elements.healthStatus) {
                elements.healthStatus.className = `status-indicator ${result.success ? 'status-success' : 'status-error'}`;
            }
        });
    }

    // Test Services
    if (elements.testServicesBtn) {
        elements.testServicesBtn.addEventListener('click', () => {
            fetchAPI(`${SERVICE_URL}/test/services`);
        });
    }

    // Echo Request
    if (elements.echoBtn) {
        elements.echoBtn.addEventListener('click', () => {
            const method = elements.echoMethod?.value || 'GET';
            fetchAPI(`${SERVICE_URL}/test/echo`, { method });
        });
    }

    // Protected Test
    if (elements.protectedBtn) {
        elements.protectedBtn.addEventListener('click', () => {
            const token = elements.authToken?.value.trim();
            const options = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
            fetchAPI(`${SERVICE_URL}/test/protected`, options);
        });
    }

    // Proxy - Tools
    if (elements.proxyToolsBtn) {
        elements.proxyToolsBtn.addEventListener('click', () => {
            fetchAPI(`${SERVICE_URL}/api/tools`);
        });
    }

    // Proxy - Flows
    if (elements.proxyFlowsBtn) {
        elements.proxyFlowsBtn.addEventListener('click', () => {
            fetchAPI(`${SERVICE_URL}/api/flows`);
        });
    }

    // Proxy - Compare
    if (elements.proxyCompareBtn) {
        elements.proxyCompareBtn.addEventListener('click', () => {
            const slugs = elements.compareSlugs?.value.trim();
            if (!slugs) {
                alert('Please enter tool slugs (comma-separated)');
                return;
            }
            fetchAPI(`${SERVICE_URL}/api/compare?tools=${encodeURIComponent(slugs)}`);
        });
    }
}

// ====================================
// Initialize
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize view toggle
    if (elements.viewVisualBtn) {
        elements.viewVisualBtn.addEventListener('click', () => toggleView('visual'));
    }
    if (elements.viewJsonBtn) {
        elements.viewJsonBtn.addEventListener('click', () => toggleView('json'));
    }

    // Initialize based on current service
    switch (currentService) {
        case 'tool':
            initToolServiceListeners();
            break;
        case 'auth':
            initAuthServiceListeners();
            break;
        case 'flow':
            initFlowServiceListeners();
            break;
        case 'recommendation':
            initRecommendationServiceListeners();
            break;
        case 'comparison':
            initComparisonServiceListeners();
            break;
        case 'gateway':
            initGatewayServiceListeners();
            break;
    }

    // Set initial view
    toggleView('visual');

    console.log(`🎮 API Playground initialized for ${currentService} service`);
});
