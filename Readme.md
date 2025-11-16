Healthcare Appointment System  
A web-based appointment scheduling platform that allows users to book, view, edit, and delete healthcare appointments. The system is designed to be simple, clean, and easy to use, allowing patients to select a doctor, choose a date and time, and fully manage their upcoming bookings.

The goal of the project was to build a lightweight scheduling system using Express.js, EJS templates, and a JSON file as a temporary database. The website is fully deployed and accessible online.

Live Website:
https://infr3120-fall25-project-2zx3.onrender.com/

Features
- Book new appointments (patient name, doctor name, date & time)
- View all scheduled appointments
- Edit existing appointments
- Delete appointments
- Prevents double-booking
- Responsive UI with logo branding

Group Members
- Joval Mangalan  (github: jovalmangalan)
- Yousuf Elemeki  (github: yousuf-elmeki)
- Malik Khan      (github: malekmk333)

Roles & Contributions
Joval Mangalan
- Built backend routing structure
- Configured Express.js server and middleware
- Set up routes and deployment adjustments

Yousuf Elemeki
- Developed appointmentsController.js
- Implemented CRUD logic and conflict prevention
- Handled JSON read/write and ID logic

Malik Khan
- Designed all EJS templates
- Created UI styling and color theme
- Added branding and layout improvements

```
Project Structure
INFR3120-Fall25-Project
│   package.json
│   server.js
│
├── data
│   appointments.json
├── public
│   styles.css
│   logo.png
├── routes
│   appointments.js
├── controllers
│   appointmentsController.js
└── views
    home.ejs
    schedule.ejs
    calendar.ejs
    edit.ejs
```

How to Run Locally
1. git clone https://github.com/jovalmangalan/INFR3120-Fall25-Project
2. npm install
3. npm start
Local URL: http://localhost:3000
