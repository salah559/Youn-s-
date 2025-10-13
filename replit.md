# Salon de Coiffure - Système de Réservation

## Overview
This project is a professional hair salon booking management system designed with a modern user interface and interactive 3D background animations. It provides a public booking interface, a client list view, an announcements page, and a comprehensive admin panel. The system is designed for a single-salon operation, focusing on efficient appointment management, client-driven day selection, and a visually engaging user experience. The business vision is to offer a streamlined, visually appealing, and highly functional booking solution for hair salons, enhancing both client interaction and administrative efficiency.

## Recent Major Updates (October 2025)
- **Configurable Working Days**: Admin can now add, remove, and configure working days dynamically through the admin panel
- **Per-Day Capacity Management**: Each working day can have its own capacity setting (1-20 clients)
- **Client Day Selection**: Clients now choose their preferred booking day from available options instead of automatic assignment
- **Fixed Booking Positions**: Bookings stay on the chosen day - no automatic rescheduling when other bookings are deleted
- **Enhanced Admin Panel**: New "Jours de travail" tab for managing working days configuration

## User Preferences
- Language: French (fr)
- Theme: Professional gold on black with modern effects
- No database backend (localStorage only)
- Enhanced with Three.js 3D graphics

## System Architecture
The application is a pure frontend system built with HTML, CSS, and Vanilla JavaScript, with all data stored client-side using `localStorage`.

### UI/UX Decisions
- **Theme**: Professional gold-on-black theme with modern effects, gradient animations, smooth transitions, hover effects, and backdrop blur.
- **3D Background**: Interactive particle system using Three.js with 3000+ golden particles, mouse-following parallax, and smooth rotation. Optimized for performance with WebGL and a graceful fallback.
- **Responsiveness**: Fully responsive design with a breakpoint at 768px for mobile/desktop. Features a professional hamburger menu for mobile with smooth sliding animations.
- **Animations**: Incorporates extensive animations including page load fade-in/slide-up, navigation slide-in, card lift/scale on hover, button transitions, and a continuous logo pulse.
- **Bilingual Support**: Fully bilingual interface (French/Arabic) with RTL support.

### Technical Implementations
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+), Three.js for 3D graphics.
- **Data Storage**: `localStorage` is used for all data persistence, including bookings, admin credentials, announcements, and activity logs.
- **Admin Panel**: Secured with login credentials (`younes/younes` by default). Provides features for managing bookings (promote, edit, delete, mark "in progress"), cancelling/restoring days, creating announcements, changing admin credentials, and viewing activity.
- **Business Logic**:
    - **Working Days**: Configurable by admin (default: Sunday, Tuesday, Thursday, Friday).
    - **Capacity**: Configurable per day by admin (1-20 clients, default: Friday = 3, others = 5).
    - **Client Day Selection**: Clients choose their preferred booking day from available options with remaining capacity shown.
    - **Fixed Booking Positions**: Bookings remain on the chosen day - deleting a booking simply frees up that spot.
    - **Day Cancellation**: Cancelling a day removes it from available options but preserves existing bookings data.
    - **Completed Bookings**: Marked as completed, hidden from public/admin views but still count towards daily capacity to prevent new bookings from filling the spot.

### Feature Specifications
- **Client Features**: Book appointments, view all bookings by day, see "in progress" clients, view salon announcements, contact page with salon info and social media.
- **Admin Features**: Comprehensive management of bookings, announcements, and system settings.
- **Visual Enhancements**: 3D particle background, improved navigation, professional card designs, enhanced form inputs, smooth button animations, responsive modal dialogs, improved tab navigation, and refined typography.

### System Design Choices
- **Client-Side Only**: All operations are performed within the browser, leveraging `localStorage` for data persistence. This avoids the need for a separate backend server for core functionality.
- **Modularity**: Code is organized into `main.js` for application logic and `background3d.js` for Three.js specific code.
- **Static Assets**: Utilizes standard HTML, CSS, and JavaScript files, making it suitable for static hosting.

## External Dependencies
- **Three.js**: Used for creating the interactive 3D particle background animation.