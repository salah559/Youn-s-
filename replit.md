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
  - `contact.html` - Contact page with salon info and social media links
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
- Contact page with phone, email, address, and social media links
- Fully bilingual interface (French/Arabic) with RTL support

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
- Capacity: Friday = 3 clients, Other days (Sunday, Tuesday, Thursday) = 5 clients
- Automatic scheduling to next available day
- Day cancellation with automatic rescheduling
- **Cascade auto-advance on delete**: When admin deletes a booking, entire queue advances - everyone moves one day earlier across all future days
- **Completed bookings**: When client pays/marked as debt (haircut done), booking is marked as completed:
  - Stays in system but hidden from public/admin view
  - Still counts toward day's capacity (keeps spot occupied)
  - Prevents new bookings from filling the spot

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

## Recent Changes
### October 2025 - Contact Page & Mobile Improvements (2025-10-09 Latest)
- ✨ Added new Contact page with salon information
  - Phone number, email, address, and hours of operation
  - Social media links (Facebook, Instagram, WhatsApp)
  - Beautiful card-based design with hover effects
  - Fully responsive for mobile devices
- 📱 Significantly improved mobile experience
  - Optimized navigation for small screens (4 links fit perfectly)
  - Enhanced responsive design for tablets and phones
  - Improved touch targets and button sizes
  - Better spacing and layout on mobile devices
- 🌐 Added bilingual support (French/Arabic) for Contact page
- 🎨 Enhanced CSS with professional social media buttons
- ✅ All navigation updated across all pages

### October 2025 - GitHub Import Setup (2025-10-09)
- ✅ Successfully imported GitHub repository to Replit
- ✅ Installed Python 3.11 for server
- ✅ Installed Node.js 20 and Three.js dependency via npm
- ✅ Configured workflow "Server" for automatic startup on port 5000
- ✅ Verified server runs correctly with cache-control headers
- ✅ Tested all pages: announcements, reservation, list - all working
- ✅ Configured deployment for autoscale (production ready)
- ✅ .gitignore already includes Node.js patterns

### October 2025 - Business Logic Update (2025-10-08)
- 🔧 Capacity: Friday = 3 clients, Other working days = 5 clients
- 🔄 Cascade auto-advance: When admin deletes a client, entire queue advances across all days - each person moves one day earlier
- 🚫 Completed bookings: When client pays or is marked as debt (haircut complete), the spot stays occupied and doesn't get filled by new bookings
- 👁️ Hidden completed: Completed clients are hidden from public and admin views but still count toward daily capacity
- 📋 System announcements: Auto-advance actions are logged as system announcements

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
