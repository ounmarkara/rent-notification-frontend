# Rent Notification Frontend

This is the frontend for the Rent Notification web application, built with Next.js and React. It integrates Firebase Cloud Messaging (FCM) to receive push notifications (system and in-app) and Socket.IO for real-time updates from the backend.

## Features
- Display system notifications (e.g., Windows/macOS notification tray) for rent reminders.
- Show in-app notifications on the website UI.
- Request FCM tokens and register them with the backend.
- Real-time status updates via Socket.IO.

## Prerequisites
- **Node.js** (version 18 or higher).
- **Git** (to clone the repository).
- **Firebase Project** (for FCM).
- **Backend** (running at `http://localhost:8080`, see [rent-notification-backend](https://github.com/your-username/rent-notification-backend)).

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/rent-notification-frontend.git
cd rent-notification-frontend
