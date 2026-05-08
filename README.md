# 💉 VacciNet

VacciNet is a smart vaccination tracking and hospital recommendation web application designed to help parents manage children’s immunization schedules efficiently.

The system calculates the child’s age from the birth date and recommends age-appropriate vaccines using real vaccination data stored in MongoDB. Users can mark vaccines that have already been taken and view pending vaccines with priority indicators.

The application also provides nearby hospital recommendations based on the entered Pune pincode and displays them on an interactive map using Leaflet and OpenStreetMap APIs. Users can select hospitals and simulate appointment booking through the dashboard.

---

# ✨ Features

- Child vaccination tracking system
- Age-based vaccine recommendation
- Real vaccine dataset integration
- Pending vaccine management
- Nearby hospital finder with maps
- Interactive and responsive dashboard UI
- User authentication (Login/Register)
- Appointment booking simulation

---

# 🛠 Tech Stack

## Frontend
- HTML
- CSS
- JavaScript
- Leaflet.js
- OpenStreetMap API

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

---

# 📁 Project Structure

```bash
Frontend/
 ┣ index.html
 ┣ style.css
 ┗ script.js

Backend/
 ┣ server.js
 ┣ routes/
 ┣ controllers/
 ┣ models/
 ┣ data/
 ┣ config/
 ┗ utils/
