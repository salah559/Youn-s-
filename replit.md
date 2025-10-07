# Salon de Coiffure - Système de Réservation

## Overview
This is a hair salon booking management system built with pure HTML, CSS, and JavaScript. The application uses localStorage for data persistence (client-side only) and provides:
- Public booking interface
- Client list view with "in progress" status
- Announcements page for salon updates
- Admin panel for managing bookings, announcements, and settings

## Project Structure
- **Frontend**: Static HTML/CSS/JavaScript application
- **No Backend**: All data stored in browser's localStorage
- **Pages**:
  - `index.html` - Redirects to announcements page
  - `annoncent.html` - Public announcements page
  - `reservation.html` - Booking form for clients
  - `list.html` - Public list of all bookings grouped by day
  - `admin.html` - Admin panel (requires login)
- **Assets**:
  - `css/style.css` - Gold on black modern theme styling
  - `js/main.js` - All application logic
  - `logo.png` - Salon logo

## Features
### Client Features
- Book appointments (name, surname, phone optional)
- View all bookings organized by day
- See which client is currently being served ("En cours")
- View salon announcements and system notifications

### Admin Features (Login: younes/younes)
- Manage bookings: promote in queue, edit, delete, mark "in progress"
- Cancel entire days (automatically reschedules clients)
- Restore cancelled days
- Create public announcements
- Change admin credentials
- View activity journal
- Reset all data

### Business Logic
- Working days: Sunday (0), Tuesday (2), Thursday (4), Friday (5)
- Capacity: Friday = 3 clients, Other days = 5 clients
- Automatic scheduling to next available day
- Day cancellation with automatic rescheduling

## Technology Stack
- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Data Storage**: Browser localStorage
- **Server**: Python 3.11 HTTP server with cache-control headers
- **Styling**: Custom CSS with gradient animations and responsive design

## Development Setup
The project runs on a Python HTTP server (port 5000) with:
- Cache-Control headers to prevent stale content
- Static file serving
- Support for all modern browsers

## Data Structure
All data stored in localStorage with keys:
- `bp_creds` - Admin credentials
- `bp_bookings` - Active bookings
- `bp_cancelled` - Cancelled day snapshots
- `bp_annonces` - Announcements (user and system)
- `bp_journal` - Activity log

## Recent Changes
- Initial setup in Replit environment (2025-10-07)
- Configured Python HTTP server with proper cache headers
- Set up workflow for automatic server startup
- Added .gitignore for Python and Replit files

## User Preferences
- Language: French (fr)
- Theme: Gold on black modern design
- No database backend (localStorage only)
