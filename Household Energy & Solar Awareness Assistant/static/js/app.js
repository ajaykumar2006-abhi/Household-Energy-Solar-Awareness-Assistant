/**
 * BRIGHT HOMES, LOWER BILLS AND ENERGY SAVING
 * Household Energy & Solar Awareness Assistant
 * Frontend Application Logic
 */

// Application State
const AppState = {
    currentStep: 1,
    totalSteps: 8,
    assessmentData: {},
    surveyData: {},
    applianceData: [],
    solarData: {},
    assessmentId: null
};

// Utility Functions
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

function formatNumber(num) {
    return num.toLocaleString('en-IN');
}

function showError(message) {
    alert('Error: ' + message);
}

function showSuccess(message) {
    alert('Success: ' + message);
}

// Storage Functions
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return null;
    }
}

function clearLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error('Error clearing localStorage:', e);
    }
}

// API Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(endpoint, options);
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'API call failed');
        }
        
        return result.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Validation Functions
function validateNumber(value, min = 0, max = Infinity) {
    const num = parseFloat(value);
    if (isNaN(num)) return { valid: false, message: 'Please enter a valid number' };
    if (num < min) return { valid: false, message: `Value must be at least ${min}` };
    if (num > max) return { valid: false, message: `Value must be at most ${max}` };
    return { valid: true };
}

function validateRequired(value) {
    if (!value || value.trim() === '') {
        return { valid: false, message: 'This field is required' };
    }
    return { valid: true };
}

// Progress Indicator
function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar) {
        const percentage = (AppState.currentStep / AppState.totalSteps) * 100;
        progressBar.style.width = percentage + '%';
    }
    
    if (progressText) {
        progressText.textContent = `Step ${AppState.currentStep} of ${AppState.totalSteps}`;
    }
}

// Navigation Functions
function goToStep(step) {
    AppState.currentStep = step;
    updateProgress();
    
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show current step
    const currentStepEl = document.getElementById(`step-${step}`);
    if (currentStepEl) {
        currentStepEl.style.display = 'block';
        currentStepEl.classList.add('fade-in');
    }
    
    // Update navigation buttons
    updateNavigationButtons();
}

function nextStep() {
    if (AppState.currentStep < AppState.totalSteps) {
        goToStep(AppState.currentStep + 1);
    }
}

function prevStep() {
    if (AppState.currentStep > 1) {
        goToStep(AppState.currentStep - 1);
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.style.display = AppState.currentStep > 1 ? 'inline-flex' : 'none';
    }
    
    if (nextBtn) {
        if (AppState.currentStep === AppState.totalSteps) {
            nextBtn.textContent = 'Complete Assessment';
            nextBtn.onclick = completeAssessment;
        } else {
            nextBtn.textContent = 'Next';
            nextBtn.onclick = nextStep;
        }
    }
}

// Survey Functions
function addAppliance() {
    const name = document.getElementById('appliance-name').value;
    const quantity = parseInt(document.getElementById('appliance-quantity').value);
    const wattage = parseInt(document.getElementById('appliance-wattage').value);
    const hoursPerDay = parseFloat(document.getElementById('appliance-hours').value);
    
    // Validation
    if (!name) {
        showError('Please enter appliance name');
        return;
    }
    
    const qtyValidation = validateNumber(quantity, 1);
    if (!qtyValidation.valid) {
        showError(qtyValidation.message);
        return;
    }
    
    const wattageValidation = validateNumber(wattage, 1);
    if (!wattageValidation.valid) {
        showError(wattageValidation.message);
        return;
    }
    
    const hoursValidation = validateNumber(hoursPerDay, 0, 24);
    if (!hoursValidation.valid) {
        showError(hoursValidation.message);
        return;
    }
    
    const appliance = {
        id: Date.now(),
        name,
        quantity,
        wattage,
        hours_per_day: hoursPerDay
    };
    
    AppState.applianceData.push(appliance);
    renderApplianceList();
    clearApplianceForm();
}

function removeAppliance(id) {
    AppState.applianceData = AppState.applianceData.filter(app => app.id !== id);
    renderApplianceList();
}

function clearApplianceForm() {
    document.getElementById('appliance-name').value = '';
    document.getElementById('appliance-quantity').value = '1';
    document.getElementById('appliance-wattage').value = '';
    document.getElementById('appliance-hours').value = '';
}

function renderApplianceList() {
    const container = document.getElementById('appliance-list');
    if (!container) return;
    
    if (AppState.applianceData.length === 0) {
        container.innerHTML = '<p class="text-gray">No appliances added yet.</p>';
        return;
    }
    
    let html = '<div class="appliance-grid">';
    
    AppState.applianceData.forEach(appliance => {
        const dailyKwh = (appliance.quantity * appliance.wattage * appliance.hours_per_day) / 1000;
        const monthlyKwh = dailyKwh * 30;
        
        html += `
            <div class="appliance-card">
                <div class="appliance-card-title">${appliance.name}</div>
                <p><strong>Quantity:</strong> ${appliance.quantity}</p>
                <p><strong>Wattage:</strong> ${appliance.wattage}W</p>
                <p><strong>Hours/Day:</strong> ${appliance.hours_per_day}</p>
                <p><strong>Daily:</strong> ${dailyKwh.toFixed(2)} kWh</p>
                <p><strong>Monthly:</strong> ${monthlyKwh.toFixed(2)} kWh</p>
                <button class="btn btn-sm btn-outline mt-2" onclick="removeAppliance(${appliance.id})">Remove</button>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Calculation Functions
async function calculateConsumption() {
    try {
        const result = await apiCall('/api/calculate-consumption', 'POST', {
            appliances: AppState.applianceData
        });
        
        AppState.assessmentData.consumption = result;
        displayConsumptionResults(result);
        return result;
    } catch (error) {
        showError('Failed to calculate consumption: ' + error.message);
        return null;
    }
}

function displayConsumptionResults(data) {
    const container = document.getElementById('consumption-results');
    if (!container) return;
    
    container.innerHTML = `
        <div class="dashboard-cards">
            <div class="dashboard-card">
                <div class="dashboard-card-icon">⚡</div>
                <div class="dashboard-card-value">${data.daily_kwh.toFixed(2)}</div>
                <div class="dashboard-card-label">Daily kWh</div>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-card-icon">📊</div>
                <div class="dashboard-card-value">${data.monthly_kwh.toFixed(2)}</div>
                <div class="dashboard-card-label">Monthly kWh</div>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-card-icon">📈</div>
                <div class="dashboard-card-value">${data.annual_kwh.toFixed(2)}</div>
                <div class="dashboard-card-label">Annual kWh</div>
            </div>
        </div>
        
        <h3 class="font-bold text-navy mt-3 mb-2">Appliance Breakdown</h3>
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Appliance</th>
                        <th>Quantity</th>
                        <th>Daily kWh</th>
                        <th>Monthly kWh</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.appliance_breakdown.map(app => `
                        <tr>
                            <td>${app.name}</td>
                            <td>${app.quantity}</td>
                            <td>${app.daily_kwh}</td>
                            <td>${app.monthly_kwh}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Determine energy usage category
    let category = 'LOW';
    if (data.monthly_kwh > 500) category = 'MODERATE';
    if (data.monthly_kwh > 1000) category = 'HIGH';
    
    const categoryContainer = document.getElementById('energy-category');
    if (categoryContainer) {
        let badgeClass = 'badge-success';
        if (category === 'MODERATE') badgeClass = 'badge-warning';
        if (category === 'HIGH') badgeClass = 'badge-danger';
        
        categoryContainer.innerHTML = `
            <div class="alert alert-info">
                <strong>Energy Usage Category:</strong> 
                <span class="badge ${badgeClass}">${category}</span>
                <p class="mt-1">Note: This is an indicative category based on estimated consumption, not an official electricity board classification.</p>
            </div>
        `;
    }
}

async function calculateSolar() {
    try {
        const monthlyConsumption = parseFloat(document.getElementById('monthly-consumption').value) || 
                                  (AppState.assessmentData.consumption?.monthly_kwh || 0);
        const rooftopArea = parseFloat(document.getElementById('rooftop-area').value);
        const tariff = parseFloat(document.getElementById('tariff').value) || 6.0;
        const peakSunHours = parseFloat(document.getElementById('peak-sun-hours').value) || 5.0;
        const performanceFactor = parseFloat(document.getElementById('performance-factor').value) || 0.75;
        const preferredCapacity = document.getElementById('preferred-capacity').value;
        
        const capacity = preferredCapacity === 'custom' ? 
                        parseFloat(document.getElementById('custom-capacity').value) : 
                        parseFloat(preferredCapacity);
        
        const result = await apiCall('/api/calculate-solar', 'POST', {
            monthly_consumption: monthlyConsumption,
            rooftop_area: rooftopArea,
            tariff: tariff,
            peak_sun_hours: peakSunHours,
            performance_factor: performanceFactor,
            preferred_capacity: capacity
        });
        
        AppState.solarData = result;
        displaySolarResults(result);
        return result;
    } catch (error) {
        showError('Failed to calculate solar: ' + error.message);
        return null;
    }
}

function displaySolarResults(data) {
    const container = document.getElementById('solar-results');
    if (!container) return;
    
    container.innerHTML = `
        <div class="dashboard-cards">
            <div class="dashboard-card">
                <div class="dashboard-card-icon">☀️</div>
                <div class="dashboard-card-value">${data.solar_capacity} kW</div>
                <div class="dashboard-card-label">Solar Capacity</div>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-card-icon">🔋</div>
                <div class="dashboard-card-value">${data.annual_generation.toFixed(0)}</div>
                <div class="dashboard-card-label">Annual Generation (kWh)</div>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-card-icon">💰</div>
                <div class="dashboard-card-value">${formatCurrency(data.annual_savings)}</div>
                <div class="dashboard-card-label">Est. Annual Savings</div>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-card-icon">⏱️</div>
                <div class="dashboard-card-value">${data.payback_years} yrs</div>
                <div class="dashboard-card-label">Est. Payback Period</div>
            </div>
        </div>
        
        <div class="alert ${data.area_sufficient ? 'alert-success' : 'alert-warning'}">
            <strong>Rooftop Area Analysis:</strong><br>
            Required: ${data.area_required} sq.ft | Available: ${document.getElementById('rooftop-area').value} sq.ft
            ${!data.area_sufficient ? '<br><strong>Warning:</strong> Available rooftop area may be insufficient for the selected capacity.' : ''}
        </div>
        
        <div class="disclaimer">
            <div class="disclaimer-title">⚠️ Important Note</div>
            <p>All solar capacity, generation, savings, and financial values are estimates based on the provided assumptions. Actual values may vary based on location, weather patterns, system efficiency, installation quality, and other factors. Please consult with approved solar vendors and your electricity distribution company for accurate assessments.</p>
        </div>
    `;
}

async function generateRecommendations() {
    try {
        const result = await apiCall('/api/generate-recommendations', 'POST', {
            appliances: AppState.applianceData
        });
        
        displayRecommendations(result);
        return result;
    } catch (error) {
        showError('Failed to generate recommendations: ' + error.message);
        return null;
    }
}

function displayRecommendations(data) {
    const container = document.getElementById('recommendations-results');
    if (!container) return;
    
    let html = '';
    
    const categories = [
        { key: 'quick_savings', title: 'Quick Savings', icon: '⚡' },
        { key: 'low_cost_improvements', title: 'Low-Cost Improvements', icon: '🔧' },
        { key: 'long_term_improvements', title: 'Long-Term Improvements', icon: '🏠' }
    ];
    
    categories.forEach(category => {
        if (data[category.key] && data[category.key].length > 0) {
            html += `
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">${category.icon} ${category.title}</h3>
                    </div>
                    <div class="recommendation-list">
            `;
            
            data[category.key].forEach(rec => {
                html += `
                    <div class="alert alert-info">
                        <strong>${rec.title}</strong>
                        <p>${rec.description}</p>
                        ${rec.potential_saving ? `<small><em>Potential saving: ${rec.potential_saving}</em></small>` : ''}
                    </div>
                `;
            });
            
            html += '</div></div>';
        }
    });
    
    container.innerHTML = html;
}

// Assessment Functions
async function completeAssessment() {
    try {
        // Gather all assessment data
        const assessment = {
            household: {
                name: document.getElementById('household-name')?.value || '',
                family_size: parseInt(document.getElementById('family-size')?.value) || 0,
                location: document.getElementById('location')?.value || '',
                connection_type: document.getElementById('connection-type')?.value || '',
                monthly_bill: parseFloat(document.getElementById('monthly-bill')?.value) || 0
            },
            appliances: AppState.applianceData,
            consumption: AppState.assessmentData.consumption,
            solar: AppState.solarData,
            created_at: new Date().toISOString()
        };
        
        const result = await apiCall('/api/assessment', 'POST', assessment);
        
        AppState.assessmentId = result.assessment_id;
        saveToLocalStorage('current_assessment', assessment);
        saveToLocalStorage('assessment_id', result.assessment_id);
        
        showSuccess('Assessment completed successfully! ID: ' + result.assessment_id);
        
        // Redirect to report page
        window.location.href = '/report?assessment_id=' + result.assessment_id;
    } catch (error) {
        showError('Failed to complete assessment: ' + error.message);
    }
}

async function loadAssessment(assessmentId) {
    try {
        const result = await apiCall(`/api/assessment/${assessmentId}`);
        AppState.assessmentData = result;
        return result;
    } catch (error) {
        showError('Failed to load assessment: ' + error.message);
        return null;
    }
}

async function loadAssessmentHistory() {
    try {
        const result = await apiCall('/api/assessments');
        displayAssessmentHistory(result);
        return result;
    } catch (error) {
        showError('Failed to load assessment history: ' + error.message);
        return null;
    }
}

function displayAssessmentHistory(assessments) {
    const container = document.getElementById('assessment-history');
    if (!container) return;
    
    if (!assessments || assessments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">No assessments found</div>
                <p>Start your first energy assessment to see results here.</p>
                <a href="/survey" class="btn btn-primary mt-2">Start Assessment</a>
            </div>
        `;
        return;
    }
    
    let html = '<div class="table-container"><table class="table"><thead><tr><th>ID</th><th>Household</th><th>Date</th><th>Monthly Consumption</th><th>Solar Capacity</th><th>Actions</th></tr></thead><tbody>';
    
    assessments.forEach(assessment => {
        const date = new Date(assessment.created_at).toLocaleDateString();
        const monthlyConsumption = assessment.consumption?.monthly_kwh?.toFixed(0) || 'N/A';
        const solarCapacity = assessment.solar?.solar_capacity || 'N/A';
        
        html += `
            <tr>
                <td><span class="badge badge-info">${assessment.assessment_id}</span></td>
                <td>${assessment.household?.name || 'N/A'}</td>
                <td>${date}</td>
                <td>${monthlyConsumption} kWh</td>
                <td>${solarCapacity} kW</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="viewAssessment('${assessment.assessment_id}')">View</button>
                    <button class="btn btn-sm btn-outline" onclick="deleteAssessment('${assessment.assessment_id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

async function viewAssessment(assessmentId) {
    window.location.href = '/report?assessment_id=' + assessmentId;
}

async function deleteAssessment(assessmentId) {
    if (!confirm('Are you sure you want to delete this assessment?')) {
        return;
    }
    
    try {
        await apiCall(`/api/assessment/${assessmentId}`, 'DELETE');
        showSuccess('Assessment deleted successfully');
        loadAssessmentHistory();
    } catch (error) {
        showError('Failed to delete assessment: ' + error.message);
    }
}

// Report Generation
function generateReport(assessmentId) {
    const assessment = AppState.assessmentData;
    if (!assessment) {
        showError('No assessment data available');
        return;
    }
    
    const reportContent = `
HOUSEHOLD ENERGY & SOLAR AWARENESS REPORT
==========================================

Assessment ID: ${assessmentId}
Generated: ${new Date().toLocaleString()}

HOUSEHOLD DETAILS
-----------------
Name: ${assessment.household?.name || 'N/A'}
Family Size: ${assessment.household?.family_size || 'N/A'}
Location: ${assessment.household?.location || 'N/A'}
Connection Type: ${assessment.household?.connection_type || 'N/A'}
Monthly Bill: ${formatCurrency(assessment.household?.monthly_bill || 0)}

ELECTRICITY CONSUMPTION
-----------------------
Daily: ${assessment.consumption?.daily_kwh?.toFixed(2) || 'N/A'} kWh
Monthly: ${assessment.consumption?.monthly_kwh?.toFixed(2) || 'N/A'} kWh
Annual: ${assessment.consumption?.annual_kwh?.toFixed(2) || 'N/A'} kWh

SOLAR ESTIMATION
----------------
Recommended Capacity: ${assessment.solar?.solar_capacity || 'N/A'} kW
Annual Generation: ${assessment.solar?.annual_generation?.toFixed(0) || 'N/A'} kWh
Annual Savings: ${formatCurrency(assessment.solar?.annual_savings || 0)}
Payback Period: ${assessment.solar?.payback_years || 'N/A'} years

ENERGY SAVING RECOMMENDATIONS
-----------------------------
- Switch off appliances when not in use
- Use LED bulbs instead of incandescent bulbs
- Maximize natural lighting
- Consider energy-efficient appliances
- Evaluate rooftop solar installation

PM SURYA GHAR AWARENESS
-----------------------
The PM Surya Ghar scheme provides subsidies for rooftop solar installations.
Visit the official government portal for the latest information and application process.

DISCLAIMER
----------
This report is generated by an educational awareness tool. All values are estimates
and should be verified with electricity distribution companies, approved solar vendors,
or official government portals before making any decisions.

Generated by: BRIGHT HOMES, LOWER BILLS AND ENERGY SAVING
CSP Project - Household Energy & Solar Awareness Assistant
    `;
    
    // Create downloadable text file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energy_report_${assessmentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Chart Functions (Simple implementation without external libraries)
function createSimpleChart(containerId, data, type = 'bar') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Simple bar chart using HTML/CSS
    if (type === 'bar') {
        let html = '<div class="simple-bar-chart">';
        const maxValue = Math.max(...data.map(d => d.value));
        
        data.forEach(item => {
            const percentage = (item.value / maxValue) * 100;
            html += `
                <div class="bar-item">
                    <div class="bar-label">${item.label}</div>
                    <div class="bar">
                        <div class="bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="bar-value">${item.value}</div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        const assessments = await apiCall('/api/assessments');
        
        if (!assessments || assessments.length === 0) {
            displayDashboardDemoData();
            return;
        }
        
        // Calculate dashboard metrics
        const totalHouseholds = assessments.length;
        const avgMonthlyConsumption = assessments.reduce((sum, a) => 
            sum + (a.consumption?.monthly_kwh || 0), 0) / totalHouseholds;
        const totalSolarCapacity = assessments.reduce((sum, a) => 
            sum + (a.solar?.solar_capacity || 0), 0);
        const totalAnnualSavings = assessments.reduce((sum, a) => 
            sum + (a.solar?.annual_savings || 0), 0);
        
        displayDashboardMetrics({
            totalHouseholds,
            avgMonthlyConsumption,
            totalSolarCapacity,
            totalAnnualSavings
        });
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        displayDashboardDemoData();
    }
}

function displayDashboardMetrics(metrics) {
    const container = document.getElementById('dashboard-metrics');
    if (!container) return;
    
    container.innerHTML = `
        <div class="dashboard-cards">
            <div class="dashboard-card">
                <div class="dashboard-card-icon">🏠</div>
                <div class="dashboard-card-value">${metrics.totalHouseholds}</div>
                <div class="dashboard-card-label">Households Assessed</div>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-card-icon">⚡</div>
                <div class="dashboard-card-value">${metrics.avgMonthlyConsumption.toFixed(0)}</div>
                <div class="dashboard-card-label">Avg Monthly kWh</div>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-card-icon">☀️</div>
                <div class="dashboard-card-value">${metrics.totalSolarCapacity.toFixed(1)}</div>
                <div class="dashboard-card-label">Total Solar Capacity (kW)</div>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-card-icon">💰</div>
                <div class="dashboard-card-value">${formatCurrency(metrics.totalAnnualSavings)}</div>
                <div class="dashboard-card-label">Est. Annual Savings</div>
            </div>
        </div>
    `;
}

function displayDashboardDemoData() {
    const container = document.getElementById('dashboard-metrics');
    if (!container) return;
    
    container.innerHTML = `
        <div class="alert alert-info">
            <strong>Demo Data</strong> - No actual assessments yet. Complete your first assessment to see real data.
        </div>
        <div class="dashboard-cards">
            <div class="dashboard-card">
                <div class="dashboard-card-icon">🏠</div>
                <div class="dashboard-card-value">0</div>
                <div class="dashboard-card-label">Households Assessed</div>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-card-icon">⚡</div>
                <div class="dashboard-card-value">--</div>
                <div class="dashboard-card-label">Avg Monthly kWh</div>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-card-icon">☀️</div>
                <div class="dashboard-card-value">0</div>
                <div class="dashboard-card-label">Total Solar Capacity (kW)</div>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-card-icon">💰</div>
                <div class="dashboard-card-value">₹0</div>
                <div class="dashboard-card-label">Est. Annual Savings</div>
            </div>
        </div>
    `;
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Load saved assessment data if exists
    const savedAssessment = loadFromLocalStorage('current_assessment');
    if (savedAssessment) {
        AppState.assessmentData = savedAssessment;
    }
    
    const savedAssessmentId = loadFromLocalStorage('assessment_id');
    if (savedAssessmentId) {
        AppState.assessmentId = savedAssessmentId;
    }
    
    // Initialize current page based on URL
    const path = window.location.pathname;
    
    if (path === '/history') {
        loadAssessmentHistory();
    } else if (path === '/dashboard') {
        loadDashboardData();
    } else if (path.includes('report')) {
        const urlParams = new URLSearchParams(window.location.search);
        const assessmentId = urlParams.get('assessment_id');
        if (assessmentId) {
            loadAssessment(assessmentId);
        }
    }
    
    // Initialize progress indicator if on survey page
    if (path === '/survey') {
        updateProgress();
    }
});

// Simple bar chart CSS
const style = document.createElement('style');
style.textContent = `
    .simple-bar-chart {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }
    
    .bar-item {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .bar-label {
        width: 150px;
        font-weight: 600;
        color: var(--navy-primary);
    }
    
    .bar {
        flex: 1;
        height: 30px;
        background: var(--light-gray);
        border-radius: var(--radius-md);
        overflow: hidden;
    }
    
    .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--solar-gold) 0%, var(--solar-orange) 100%);
        transition: width 0.5s ease;
    }
    
    .bar-value {
        width: 80px;
        text-align: right;
        font-weight: 600;
        color: var(--navy-primary);
    }
`;
document.head.appendChild(style);
