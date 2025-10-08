// js/translations.js - Translation system
const translations = {
    fr: {
        // Navigation
        'nav.announcements': 'Annonces',
        'nav.reservation': 'Réservation',
        'nav.list': 'Liste',
        
        // Announcements page
        'announcements.title': 'Salon — Annonces',
        'announcements.subtitle': 'Les annonces du salon (annonces du coiffeur et notifications système).',
        'announcements.recent': 'Annonces récentes',
        'announcements.none': 'Aucune annonce',
        
        // Reservation page
        'reservation.title': 'Réservation',
        'reservation.subtitle': 'Réservez facilement — téléphone optionnel.',
        'reservation.name': 'Nom *',
        'reservation.surname': 'Prénom *',
        'reservation.phone': 'Téléphone (optionnel)',
        'reservation.phone.placeholder': 'Laisser vide si vous préférez',
        'reservation.button': 'Réserver',
        'reservation.success': 'Réservé: ',
        
        // List page
        'list.title': 'Liste des réservations',
        'list.subtitle': 'Qui est prévu et qui est en cours de coupe.',
        'list.none': 'Aucune réservation pour l\'instant.',
        'list.capacity': 'Capacité: ',
        'list.inprogress': 'En cours',
        
        // Admin page
        'admin.title': 'Administration',
        'admin.subtitle': 'Ouvrez la modal via le logo pour vous connecter.',
        'admin.tab.bookings': 'Gestion réservations',
        'admin.tab.announcements': 'Annonces',
        'admin.cancelled.title': 'Jours annulés (restaurables)',
        'admin.restoreday': 'Restaurer jour',
        'admin.cancelday': 'Annuler jour',
        'admin.noclient': 'Aucun client',
        'admin.tab.settings': 'Paramètres',
        'admin.tab.journal': 'Journal',
        'admin.bookings.title': 'Réservations par jour',
        'admin.announcements.title': 'Annonces (créées par le coiffeur)',
        'admin.announcements.placeholder': 'Titre / message...',
        'admin.announcements.publish': 'Publier annonce',
        'admin.settings.title': 'Paramètres',
        'admin.settings.user': 'Nouvel utilisateur',
        'admin.settings.password': 'Nouveau mot de passe',
        'admin.settings.update': 'Mettre à jour',
        'admin.settings.reset': 'Réinitialiser tout',
        'admin.journal.title': 'Journal interne',
        'admin.noclient': 'Aucun client',
        'admin.cancelday': 'Annuler jour',
        
        // Buttons
        'button.promote': 'Promouvoir',
        'button.inprogress': 'En cours',
        'button.edit': 'Éditer',
        'button.delete': 'Supprimer',
        
        // Login modal
        'login.title': 'Connexion Coiffeur',
        'login.username': 'Nom d\'utilisateur',
        'login.password': 'Mot de passe',
        'login.submit': 'Se connecter',
        'login.close': 'Fermer',
        'login.error': 'Identifiants incorrects',
        'login.welcome': 'Bienvenue, vous êtes connecté en tant que coiffeur',
        
        // Days
        'day.sunday': 'Dimanche',
        'day.tuesday': 'Mardi',
        'day.thursday': 'Jeudi',
        'day.friday': 'Vendredi'
    },
    ar: {
        // Navigation
        'nav.announcements': 'الإعلانات',
        'nav.reservation': 'الحجز',
        'nav.list': 'القائمة',
        
        // Announcements page
        'announcements.title': 'صالون — الإعلانات',
        'announcements.subtitle': 'إعلانات الصالون (إعلانات الحلاق وإشعارات النظام).',
        'announcements.recent': 'الإعلانات الأخيرة',
        'announcements.none': 'لا توجد إعلانات',
        
        // Reservation page
        'reservation.title': 'الحجز',
        'reservation.subtitle': 'احجز بسهولة — رقم الهاتف اختياري.',
        'reservation.name': 'الاسم الأخير *',
        'reservation.surname': 'الاسم الأول *',
        'reservation.phone': 'الهاتف (اختياري)',
        'reservation.phone.placeholder': 'اتركه فارغاً إذا كنت تفضل ذلك',
        'reservation.button': 'احجز',
        'reservation.success': 'تم الحجز: ',
        
        // List page
        'list.title': 'قائمة الحجوزات',
        'list.subtitle': 'من المقرر ومن يتم قصه الآن.',
        'list.none': 'لا توجد حجوزات حالياً.',
        'list.capacity': 'السعة: ',
        'list.inprogress': 'قيد التنفيذ',
        
        // Admin page
        'admin.title': 'الإدارة',
        'admin.subtitle': 'افتح النافذة عبر الشعار لتسجيل الدخول.',
        'admin.tab.bookings': 'إدارة الحجوزات',
        'admin.tab.announcements': 'الإعلانات',
        'admin.tab.settings': 'الإعدادات',
        'admin.tab.journal': 'السجل',
        'admin.bookings.title': 'الحجوزات حسب اليوم',
        'admin.announcements.title': 'الإعلانات (التي أنشأها الحلاق)',
        'admin.announcements.placeholder': 'العنوان / الرسالة...',
        'admin.announcements.publish': 'نشر الإعلان',
        'admin.settings.title': 'الإعدادات',
        'admin.settings.user': 'مستخدم جديد',
        'admin.settings.password': 'كلمة مرور جديدة',
        'admin.settings.update': 'تحديث',
        'admin.settings.reset': 'إعادة تعيين الكل',
        'admin.journal.title': 'السجل الداخلي',
        'admin.noclient': 'لا يوجد عملاء',
        'admin.cancelday': 'إلغاء اليوم',
        
        // Buttons
        'button.promote': 'ترقية',
        'button.inprogress': 'قيد التنفيذ',
        'button.edit': 'تعديل',
        'button.delete': 'حذف',
        
        // Login modal
        'login.title': 'تسجيل دخول الحلاق',
        'login.username': 'اسم المستخدم',
        'login.password': 'كلمة المرور',
        'login.submit': 'تسجيل الدخول',
        'login.close': 'إغلاق',
        'login.error': 'بيانات غير صحيحة',
        'login.welcome': 'مرحباً، تم تسجيل دخولك كحلاق',
        
        // Days
        'day.sunday': 'الأحد',
        'day.tuesday': 'الثلاثاء',
        'day.thursday': 'الخميس',
        'day.friday': 'الجمعة'
    }
};

let currentLang = localStorage.getItem('salon_lang') || 'fr';

function t(key) {
    return translations[currentLang][key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('salon_lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    updatePageTexts();
    updateLangButton();
}

function toggleLanguage() {
    const newLang = currentLang === 'fr' ? 'ar' : 'fr';
    setLanguage(newLang);
}

function updateLangButton() {
    const btn = document.getElementById('langToggle');
    if (btn) {
        btn.textContent = currentLang === 'fr' ? 'العربية' : 'Français';
    }
}

function updatePageTexts() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' && el.placeholder !== undefined) {
            el.placeholder = t(key);
        } else {
            el.textContent = t(key);
        }
    });
    
    // Re-render dynamic content
    if (typeof renderList === 'function') renderList();
    if (typeof renderAnnonces === 'function') renderAnnonces();
    if (typeof renderAdminDays === 'function') renderAdminDays();
    if (typeof renderAdminAnns === 'function') renderAdminAnns();
    if (typeof renderJournal === 'function') renderJournal();
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    updateLangButton();
});
