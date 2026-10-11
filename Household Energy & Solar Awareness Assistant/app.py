"""
BRIGHT HOMES, LOWER BILLS AND ENERGY SAVING
Household Energy & Solar Awareness Assistant
CSP Project Application
"""

from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid
from typing import Dict, List, Any

app = Flask(__name__)
CORS(app)

# Data storage (using JSON file for persistence)
DATA_FILE = 'assessments.json'

# Load assessments from file
def load_assessments():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

# Save assessments to file
def save_assessments(assessments):
    with open(DATA_FILE, 'w') as f:
        json.dump(assessments, f, indent=2, default=str)

# Generate unique assessment ID
def generate_assessment_id():
    return str(uuid.uuid4())[:8].upper()

# Routes
@app.route('/')
def index():
    """Landing page"""
    return render_template('index.html')

@app.route('/survey')
def survey():
    """Household survey page"""
    return render_template('survey.html')

@app.route('/analysis')
def analysis():
    """Electricity consumption analysis page"""
    return render_template('analysis.html')

@app.route('/recommendations')
def recommendations():
    """Energy saving recommendations page"""
    return render_template('recommendations.html')

@app.route('/solar-estimator')
def solar_estimator():
    """Rooftop solar estimator page"""
    return render_template('solar_estimator.html')

@app.route('/solar-savings')
def solar_savings():
    """Solar savings dashboard page"""
    return render_template('solar_savings.html')

@app.route('/pm-surya-ghar')
def pm_surya_ghar():
    """PM Surya Ghar awareness page"""
    return render_template('pm_surya_ghar.html')

@app.route('/registration')
def registration():
    """Registration guidance page"""
    return render_template('registration.html')

@app.route('/report')
def report():
    """Report generation page"""
    return render_template('report.html')

@app.route('/history')
def history():
    """Survey history page"""
    return render_template('history.html')

@app.route('/dashboard')
def dashboard():
    """Dashboard page"""
    return render_template('dashboard.html')

@app.route('/about-csp')
def about_csp():
    """About CSP project page"""
    return render_template('about_csp.html')

# API Routes
@app.route('/api/assessment', methods=['POST'])
def save_assessment():
    """Save a new assessment"""
    try:
        data = request.json
        data['assessment_id'] = generate_assessment_id()
        data['created_at'] = datetime.now().isoformat()
        
        assessments = load_assessments()
        assessments.append(data)
        save_assessments(assessments)
        
        return jsonify({'success': True, 'assessment_id': data['assessment_id']})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/assessment/<assessment_id>', methods=['GET'])
def get_assessment(assessment_id):
    """Get a specific assessment"""
    try:
        assessments = load_assessments()
        assessment = next((a for a in assessments if a['assessment_id'] == assessment_id), None)
        
        if assessment:
            return jsonify({'success': True, 'data': assessment})
        else:
            return jsonify({'success': False, 'error': 'Assessment not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/assessments', methods=['GET'])
def get_all_assessments():
    """Get all assessments"""
    try:
        assessments = load_assessments()
        return jsonify({'success': True, 'data': assessments})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/assessment/<assessment_id>', methods=['DELETE'])
def delete_assessment(assessment_id):
    """Delete an assessment"""
    try:
        assessments = load_assessments()
        assessments = [a for a in assessments if a['assessment_id'] != assessment_id]
        save_assessments(assessments)
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/calculate-consumption', methods=['POST'])
def calculate_consumption():
    """Calculate electricity consumption from appliances"""
    try:
        data = request.json
        appliances = data.get('appliances', [])
        
        total_daily_kwh = 0
        appliance_breakdown = []
        
        for appliance in appliances:
            quantity = appliance.get('quantity', 0)
            wattage = appliance.get('wattage', 0)
            hours_per_day = appliance.get('hours_per_day', 0)
            
            daily_kwh = (quantity * wattage * hours_per_day) / 1000
            monthly_kwh = daily_kwh * 30
            
            total_daily_kwh += daily_kwh
            
            appliance_breakdown.append({
                'name': appliance.get('name', 'Unknown'),
                'quantity': quantity,
                'wattage': wattage,
                'hours_per_day': hours_per_day,
                'daily_kwh': round(daily_kwh, 2),
                'monthly_kwh': round(monthly_kwh, 2)
            })
        
        monthly_kwh = total_daily_kwh * 30
        annual_kwh = monthly_kwh * 12
        
        return jsonify({
            'success': True,
            'data': {
                'daily_kwh': round(total_daily_kwh, 2),
                'monthly_kwh': round(monthly_kwh, 2),
                'annual_kwh': round(annual_kwh, 2),
                'appliance_breakdown': appliance_breakdown
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/calculate-solar', methods=['POST'])
def calculate_solar():
    """Calculate solar capacity and savings"""
    try:
        data = request.json
        
        monthly_consumption = data.get('monthly_consumption', 0)
        rooftop_area = data.get('rooftop_area', 0)
        tariff = data.get('tariff', 6.0)
        peak_sun_hours = data.get('peak_sun_hours', 5.0)
        performance_factor = data.get('performance_factor', 0.75)
        preferred_capacity = data.get('preferred_capacity')
        
        # Calculate recommended capacity based on consumption
        # Rule of thumb: 1 kW generates ~120-150 kWh per month in India
        recommended_capacity = max(1, round(monthly_consumption / 140))
        
        # Use preferred capacity if provided
        if preferred_capacity:
            solar_capacity = preferred_capacity
        else:
            solar_capacity = recommended_capacity
        
        # Check rooftop area requirement (100 sq.ft per kW approx)
        area_required = solar_capacity * 100
        area_sufficient = rooftop_area >= area_required
        
        # Calculate generation
        daily_generation = solar_capacity * peak_sun_hours * performance_factor
        monthly_generation = daily_generation * 30
        annual_generation = monthly_generation * 12
        
        # Calculate offset and savings
        monthly_offset = min(monthly_generation, monthly_consumption)
        annual_offset = monthly_offset * 12
        offset_percentage = (annual_offset / annual_generation) * 100 if annual_generation > 0 else 0
        
        annual_savings = annual_offset * tariff
        
        # Estimate system cost (₹50,000 - ₹70,000 per kW)
        system_cost_min = solar_capacity * 50000
        system_cost_max = solar_capacity * 70000
        
        # Payback period
        payback_years = system_cost_min / annual_savings if annual_savings > 0 else 0
        
        # Lifetime generation (25 years)
        lifetime_generation = annual_generation * 25
        lifetime_savings = annual_savings * 25
        
        return jsonify({
            'success': True,
            'data': {
                'solar_capacity': solar_capacity,
                'recommended_capacity': recommended_capacity,
                'area_required': area_required,
                'area_sufficient': area_sufficient,
                'daily_generation': round(daily_generation, 2),
                'monthly_generation': round(monthly_generation, 2),
                'annual_generation': round(annual_generation, 2),
                'monthly_offset': round(monthly_offset, 2),
                'annual_offset': round(annual_offset, 2),
                'offset_percentage': round(offset_percentage, 2),
                'annual_savings': round(annual_savings, 2),
                'system_cost_min': system_cost_min,
                'system_cost_max': system_cost_max,
                'payback_years': round(payback_years, 1),
                'lifetime_generation': round(lifetime_generation, 2),
                'lifetime_savings': round(lifetime_savings, 2)
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/generate-recommendations', methods=['POST'])
def generate_recommendations():
    """Generate energy saving recommendations"""
    try:
        data = request.json
        appliances = data.get('appliances', [])
        
        recommendations = {
            'quick_savings': [],
            'low_cost_improvements': [],
            'long_term_improvements': []
        }
        
        # Analyze appliances and generate recommendations
        appliance_names = [a.get('name', '').lower() for a in appliances]
        
        # Quick savings
        recommendations['quick_savings'].append({
            'title': 'Switch off appliances when not in use',
            'description': 'Turn off lights, fans, and other appliances when leaving a room.',
            'potential_saving': '5-10%'
        })
        
        recommendations['quick_savings'].append({
            'title': 'Avoid standby power',
            'description': 'Unplug devices or use smart power strips to eliminate standby power consumption.',
            'potential_saving': '3-5%'
        })
        
        # Low-cost improvements
        if 'bulb' in ' '.join(appliance_names) or 'light' in ' '.join(appliance_names):
            recommendations['low_cost_improvements'].append({
                'title': 'Replace with LED bulbs',
                'description': 'Replace incandescent bulbs with LED bulbs which use 75% less energy.',
                'potential_saving': '10-15%'
            })
        
        recommendations['low_cost_improvements'].append({
            'title': 'Use natural lighting',
            'description': 'Maximize use of natural daylight during daytime hours.',
            'potential_saving': '5-8%'
        })
        
        # Long-term improvements
        if 'refrigerator' in appliance_names:
            recommendations['long_term_improvements'].append({
                'title': 'Energy-efficient refrigerator',
                'description': 'Consider upgrading to a 5-star rated energy-efficient refrigerator.',
                'potential_saving': '15-20%'
            })
        
        if 'ac' in appliance_names or 'air conditioner' in appliance_names:
            recommendations['long_term_improvements'].append({
                'title': 'Energy-efficient air conditioner',
                'description': 'Upgrade to a 5-star rated inverter AC for significant energy savings.',
                'potential_saving': '20-30%'
            })
        
        recommendations['long_term_improvements'].append({
            'title': 'Install rooftop solar',
            'description': 'Consider installing rooftop solar panels to generate clean energy and reduce electricity bills.',
            'potential_saving': '40-70%'
        })
        
        return jsonify({
            'success': True,
            'data': recommendations
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
