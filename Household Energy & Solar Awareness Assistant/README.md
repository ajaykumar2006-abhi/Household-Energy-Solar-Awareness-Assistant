# BRIGHT HOMES, LOWER BILLS AND ENERGY SAVING
## Household Energy & Solar Awareness Assistant

A comprehensive Community Service Project (CSP) web application designed to help households understand their electricity consumption, reduce energy waste, explore rooftop solar options, and learn about government support schemes like PM Surya Ghar.

### 🌟 Features

- **Household Energy Assessment**: Multi-step survey to collect household and appliance data
- **Electricity Consumption Analysis**: Detailed breakdown of energy usage by appliance
- **Energy Saving Recommendations**: Personalized suggestions to reduce electricity bills
- **Rooftop Solar Estimator**: Calculate solar capacity, generation, and financial benefits
- **Solar Savings Dashboard**: Visual analysis of potential savings and payback periods
- **PM Surya Ghar Awareness**: Information about government rooftop solar schemes
- **Registration Guidance**: Step-by-step guide for government scheme applications
- **Report Generation**: Download comprehensive household energy reports
- **Assessment History**: Track and manage previous assessments
- **Professional Dashboard**: Overview of energy assessments and statistics

### 🚀 Technology Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Custom CSS with professional solar-themed design
- **Data Storage**: JSON file-based storage with local backup
- **Charts**: Custom JavaScript charting (no external dependencies)

### 📋 Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### 🔧 Installation

1. **Navigate to the project directory**:
   ```bash
   cd "C:\Users\ajayg\Desktop\New folder"
   ```

2. **Install required dependencies**:
   ```bash
   pip install flask flask-cors
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Access the application**:
   Open your web browser and navigate to: `http://127.0.0.1:5000`

### 📁 Project Structure

```
bright-homes-energy/
├── app.py                      # Flask application with API endpoints
├── assessments.json            # Data storage for assessments
├── static/
│   ├── css/
│   │   └── style.css          # Professional solar-themed styling
│   └── js/
│       └── app.js             # Frontend application logic
└── templates/
    ├── index.html             # Landing page
    ├── survey.html            # Household energy assessment
    ├── analysis.html          # Consumption analysis
    ├── recommendations.html   # Energy saving recommendations
    ├── solar_estimator.html   # Solar capacity calculator
    ├── solar_savings.html    # Solar savings dashboard
    ├── pm_surya_ghar.html     # PM Surya Ghar information
    ├── registration.html      # Registration guidance
    ├── report.html            # Report generation
    ├── history.html           # Assessment history
    ├── dashboard.html         # Main dashboard
    └── about_csp.html         # CSP project information
```

### 🎯 Usage Guide

#### 1. Start Energy Assessment
- Click "START ENERGY ASSESSMENT" on the landing page
- Complete the household details form
- Add your appliances with quantity, wattage, and usage hours
- Review your consumption analysis
- Get personalized energy-saving recommendations

#### 2. Solar Estimation
- Navigate to "Solar Estimator"
- Enter your monthly electricity consumption
- Specify available rooftop area
- Adjust parameters like tariff and sun hours
- View estimated solar capacity and savings

#### 3. PM Surya Ghar Information
- Learn about the government rooftop solar scheme
- Understand eligibility criteria
- Follow the step-by-step registration guide
- Access official government portal links

#### 4. Reports & History
- Generate comprehensive household energy reports
- Download reports for documentation
- View assessment history
- Track your energy awareness journey

### ⚠️ Important Disclaimers

1. **Educational Purpose**: This is a Community Service Project educational application
2. **Estimates Only**: All calculations are estimates based on provided assumptions
3. **Professional Advice**: Consult professionals before making financial decisions
4. **Government Schemes**: Always verify information through official government portals
5. **No Fake Data**: The application does not create fake government confirmations or approvals

### 🎨 Design Features

- **Professional Solar Theme**: Navy blue, solar gold, and green sustainability accents
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean cards, smooth animations, and intuitive navigation
- **Accessible**: High contrast, clear typography, and keyboard navigation
- **Visual Elements**: Charts, progress indicators, and icon-based navigation

### 🔒 Data Privacy

- All assessment data is stored locally on the server
- No external data transmission except to official government portals
- Household information is not shared with third parties
- Users can delete their assessment data at any time

### 📊 Key Calculations

#### Electricity Consumption
```
Daily kWh = (Quantity × Wattage × Hours/Day) / 1000
Monthly kWh = Daily kWh × 30
Annual kWh = Monthly kWh × 12
```

#### Solar Estimation
```
Solar Capacity = Monthly Consumption / 140 (rule of thumb)
Daily Generation = Capacity × Peak Sun Hours × Performance Factor
Annual Generation = Daily Generation × 365
Annual Savings = Annual Offset × Tariff
Payback Period = System Cost / Annual Savings
```

### 🐛 Troubleshooting

**Application won't start**:
- Ensure Python is installed and accessible
- Check that required packages are installed
- Verify port 5000 is not in use

**Charts not displaying**:
- Ensure JavaScript is enabled in your browser
- Check browser console for errors
- Try refreshing the page

**Data not saving**:
- Check write permissions for the project directory
- Verify assessments.json file exists
- Check server logs for errors

### 📝 Development Notes

- Built as a complete working application, not a prototype
- No external API dependencies
- All calculations are transparent and documented
- Form validation on all user inputs
- Error handling throughout the application
- Mobile-responsive design
- Accessible interface

### 🎓 Educational Value

This CSP project serves as:
- A tool for household energy awareness
- An educational resource for renewable energy
- A demonstration of web application development
- A platform for community energy education
- A reference for government scheme information

### 📞 Support

For issues or questions about this CSP project, please refer to the project documentation or contact the project developers.

### 📄 License

This is a Community Service Project educational application. Use it for educational and awareness purposes.

---

**Project Title**: BRIGHT HOMES, LOWER BILLS AND ENERGY SAVING  
**Project Type**: Community Service Project (CSP)  
**Purpose**: Household Energy & Solar Awareness  
**Technology**: Python Flask, HTML, CSS, JavaScript  
**Status**: Complete and Functional
