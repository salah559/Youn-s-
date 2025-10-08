# Salon de Coiffure - Système de Réservation

## Overview
This is a professional hair salon booking management system built with pure HTML, CSS, and JavaScript, enhanced with Three.js 3D background animations. The application uses localStorage for data persistence (client-side only) and provides:
- Public booking interface with modern UI
- Client list view with "in progress" status
- Announcements page for salon updates
- Admin panel for managing bookings, announcements, and settings
- Interactive 3D particle background using Three.js

## Project Structure
- **Frontend**: Static HTML/CSS/JavaScript application with Three.js
- **No Backend**: All data stored in browser's localStorage
- **Pages**:
  - `index.html` - Redirects to announcements page
  - `annoncent.html` - Public announcements page
  - `reservation.html` - Booking form for clients
  - `list.html` - Public list of all bookings grouped by day
  - `admin.html` - Admin panel (requires login)
- **Assets**:
  - `css/style.css` - Enhanced professional gold on black theme with modern effects
  - `js/main.js` - All application logic
  - `js/background3d.js` - Three.js 3D particle background animation
  - `logo.png` - Salon logo

## Features
### Client Features
- Book appointments (name, surname, phone optional)
- View all bookings organized by day
- See which client is currently being served ("En cours")
- View salon announcements and system notifications
- Interactive 3D background that follows mouse movement

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
- **3D Graphics**: Three.js for animated particle background
- **Data Storage**: Browser localStorage
- **Server**: Python 3.11 HTTP server with cache-control headers
- **Styling**: Custom CSS with:
  - Gradient animations
  - Smooth transitions and hover effects
  - Backdrop blur effects
  - Responsive design
  - Professional gold-on-black theme

## Visual Enhancements (Latest Update)
- **3D Background**: Interactive particle system with 3000+ golden particles
  - Follows mouse movement for parallax effect
  - Smooth rotation animation
  - WebGL-based rendering with graceful fallback
  - Optimized performance with additive blending
  
- **Enhanced UI/UX**:
  - Improved navigation with hover animations
  - Professional card designs with backdrop blur
  - Enhanced form inputs with focus states
  - Smooth button animations with gradient transitions
  - Responsive modal dialogs with slide-up animation
  - Improved tab navigation with active states
  - Better spacing and typography
  - Enhanced color scheme with brighter gold accents

## Development Setup
The project runs on a Python HTTP server (port 5000) with:
- Cache-Control headers to prevent stale content
- Static file serving
- Support for all modern browsers
- Address reuse for faster restarts

## Data Structure
All data stored in localStorage with keys:
- `bp_creds` - Admin credentials
- `bp_bookings` - Active bookings
- `bp_cancelled` - Cancelled day snapshots
- `bp_annonces` - Announcements (user and system)
- `bp_journal` - Activity log
- `bp_income` - Income/revenue records
- `bp_debt` - Debt records (legacy, kept for compatibility)
- `bp_fulfilled` - Fulfilled days (تلبية - days completed)

## Recent Changes
### October 2025 - Fulfillment System Update (2025-10-08)
- ✅ Changed debt system to fulfillment system (تلبية)
- 🔄 When all bookings for a day are fulfilled, the day is marked as complete
- 🚫 Fulfilled days are excluded from new bookings
- 📋 New bookings automatically added to the end of the list
- ⬆️ When deleting a booking, subsequent bookings automatically move up
- 🎯 Improved Arabic language support for fulfillment workflow

### October 2025 - Replit Environment Setup (2025-10-08)
- ✅ Installed Python 3.11 and Node.js 20
- ✅ Installed Three.js dependency via npm
- ✅ Configured workflow for automatic server startup on port 5000
- ✅ Updated .gitignore to include Node.js patterns
- ✅ Configured deployment for autoscale (production ready)
- ✅ Verified all pages load correctly (announcements, reservation, list)
- ✅ Server running successfully with cache-control headers

### October 2025 - Major Visual Upgrade
- ✨ Added Three.js 3D particle background animation
- 🎨 Complete CSS redesign for professional appearance
- 🔧 Fixed form validation warnings by wrapping inputs properly
- ⚡ Enhanced all animations and transitions
- 🎯 Improved button hover effects and interactions
- 📱 Better responsive design for mobile devices
- 🛡️ Added WebGL fallback for unsupported environments

### Initial Setup (2025-10-07)
- Configured Python HTTP server with proper cache headers
- Set up workflow for automatic server startup
- Added .gitignore for Python and Replit files
- Configured deployment settings

## User Preferences
- Language: French (fr)
- Theme: Professional gold on black with modern effects
- No database backend (localStorage only)
- Enhanced with Three.js 3D graphics

## Performance Notes
- Three.js background is optimized with:
  - Limited particle count (3000)
  - Efficient buffer geometry
  - Additive blending for better performance
  - Automatic cleanup on errors
  - Graceful degradation without WebGL
  
## Browser Compatibility
- Modern browsers with ES6+ support
- WebGL support for 3D background (optional)
- Fallback CSS background for older browsers
- Responsive design for desktop and mobile
