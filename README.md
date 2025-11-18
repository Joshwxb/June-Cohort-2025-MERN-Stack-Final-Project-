**WaterWise: Personal Water Usage Dashboard**

**💧 Overview**

WaterWise is a personal web application designed to help users easily track and monitor their daily water consumption. By logging volume and date, the application provides a simple history to encourage mindful water usage.

This application runs as a single-user system using a fixed ID for persistence, bypassing the need for a full authentication layer.

**✨ Features**

Usage Logging: Users can quickly record new water consumption entries (volume in liters and date) via a simple web form.

Usage History: Displays a historical list of all recorded water usage for the static user ID, sorted by the most recent entry.

Persistent Storage: All usage logs are stored securely in a MongoDB database.

Single-User Focus: Data persistence relies on a fixed, internal user ID (user_static_default_id).

Responsive Design: Built using HTML, Vanilla JavaScript, and Tailwind CSS for a clean, adaptive interface.

💻 Technologies Used

Frontend

HTML5 and JavaScript (Vanilla)

Tailwind CSS for responsive styling.

Backend

Node.js and Express.js for the RESTful API server.

MongoDB (via the native driver) for data persistence.

dotenv for environment variable management.

🛠️ Installation and Setup

1. Prerequisites

To run this application, you must have the following installed:

Node.js (v18 or higher recommended)

npm (Node Package Manager)

A MongoDB Atlas account (or local MongoDB instance) to obtain your connection URI.

2. Clone the Repository

git clone <repository_url>
cd WaterWise


3. Install Dependencies

Install all necessary packages for the backend server:

npm install express mongodb dotenv cors


4. Configure Environment Variables

Create a file named .env in the root directory of the project and populate it with your MongoDB connection string.

# .env file

# MongoDB Connection String (Replace with your Atlas URI)
# The application uses the 'waterwise_db' database specified in server.js
MONGO_URI="mongodb+srv://<user>:<password>@<cluster_url>/"


🚀 Running the Application

Start the Server:
Run the application using Node.js:

node server.js


The terminal should output confirmation of the MongoDB connection and the server port:

✅ Connected successfully to MongoDB
Server running at http://localhost:3001


Access the Application:
Open your web browser and navigate to: http://localhost:3001

You can now log water usage, and the entries will be saved to your MongoDB database under the fixed user ID