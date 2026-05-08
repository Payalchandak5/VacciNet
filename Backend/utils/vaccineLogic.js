// Calculate age
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    return years + months / 12 + days / 365.25;
}

// Get vaccines based on age
// Get vaccines based on age (with due + priority)
function getVaccines(age) {
    let vaccines = {};

    if (age <= 1) {
        vaccines = {
            1: { name: "BCG", due: "At Birth", priority: "High" },
            2: { name: "Hepatitis B (1st Dose)", due: "Within 24 hours", priority: "High" },
            3: { name: "OPV (0 Dose)", due: "At Birth", priority: "High" },
            4: { name: "OPV (1st Dose)", due: "6 weeks", priority: "High" },
            5: { name: "IPV (1st Dose)", due: "6 weeks", priority: "Medium" },
            6: { name: "Pentavalent (1st Dose)", due: "6 weeks", priority: "High" },
            7: { name: "Rotavirus (1st Dose)", due: "6 weeks", priority: "Medium" },
            8: { name: "PCV (1st Dose)", due: "6 weeks", priority: "Medium" },
            9: { name: "Pentavalent (2nd Dose)", due: "10 weeks", priority: "High" },
            10: { name: "OPV (2nd Dose)", due: "10 weeks", priority: "High" },
            11: { name: "Pentavalent (3rd Dose)", due: "14 weeks", priority: "High" },
            12: { name: "IPV (2nd Dose)", due: "14 weeks", priority: "Medium" }
        };
    } 
    else if (age <= 2) {
        vaccines = {
            1: { name: "MMR (1st Dose)", due: "9 months", priority: "High" },
            2: { name: "Typhoid", due: "12 months", priority: "Medium" },
            3: { name: "Hepatitis A (1st Dose)", due: "12 months", priority: "Medium" },
            4: { name: "PCV Booster", due: "12-15 months", priority: "Medium" },
            5: { name: "MMR (2nd Dose)", due: "15 months", priority: "High" },
            6: { name: "Varicella (Chickenpox)", due: "15 months", priority: "Medium" },
            7: { name: "DTaP Booster", due: "16-18 months", priority: "High" },
            8: { name: "IPV Booster", due: "16-18 months", priority: "Medium" }
        };
    } 
    else if (age <= 4) {
        vaccines = {
            1: { name: "DTaP Booster (2nd)", due: "2 years", priority: "High" },
            2: { name: "MMR Booster", due: "2-3 years", priority: "High" },
            3: { name: "Typhoid Booster", due: "3 years", priority: "Medium" },
            4: { name: "Influenza", due: "Yearly", priority: "Medium" },
            5: { name: "Hepatitis A (2nd Dose)", due: "2 years", priority: "Medium" }
        };
    } 
    else if (age <= 6) {
        vaccines = {
            1: { name: "DTaP (5th Dose)", due: "4-6 years", priority: "High" },
            2: { name: "Polio (Booster)", due: "4-6 years", priority: "High" },
            3: { name: "MMR (Final Dose)", due: "4-6 years", priority: "High" },
            4: { name: "Varicella (2nd Dose)", due: "4-6 years", priority: "Medium" },
            5: { name: "Influenza", due: "Yearly", priority: "Medium" }
        };
    } 
    else {
        vaccines = {
            1: { 
                name: "Consult Pediatrician for further schedule", 
                due: "N/A", 
                priority: "Low" 
            }
        };
    }

    return vaccines;
}

module.exports = { calculateAge, getVaccines };