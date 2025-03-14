# Residence Finder

## Overview
Residence Finder is a web application designed to help users search for rental properties efficiently. The platform allows landlords to list properties and tenants to browse, filter residences.

## Features
- User authentication (Login & Registration)
- Property listing management (Add, Edit, Delete)
- Search and filter properties by location, price, and amenities
- View detailed property information
- Responsive design for seamless experience on all devices

## Technologies Used
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

## Deployment
🔗 **Live Application:** [Residence Finder](https://residence-finder-frontend.onrender.com)

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Keerthana345/Residence-Finder.git
   ```
2. Navigate to the project directory:
   ```sh
   cd Residence-Finder
   ```
3. Install dependencies for both frontend and backend:
   ```sh
   cd frontend
   npm install
   cd ../backend
   npm install
   ```
4. Set up environment variables for the backend (MongoDB URI, JWT Secret, etc.).
5. Start the backend server:
   ```sh
   cd frontend
   npm run dev
   ```
6. Start the frontend:
   ```sh
   cd backend
   node server.js
   ```

## Usage
- Register/Login as a landlord or tenant.
- Landlords can add, edit, and manage property listings.
- Tenants can browse, filter, and view property details.
- Contact landlords directly for inquiries.
