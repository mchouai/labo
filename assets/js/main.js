/**
 * LABORATOIRE LE COLISÉE - MAIN JAVASCRIPT
 * Unified animations and interactions
 */

class LaboApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupLogoAnimation();
    this.setupAOS();
    this.setupFadeIn();
    this.setupCarousel();
    this.setupBurgerMenu();
    this.setupLanguageSwitcher();
    this.setupContactForm();
    this.setupFloatingWhatsapp();
  }

  // Floating WhatsApp button (fixed circle bottom-right)
  setupFloatingWhatsapp() {
    if (document.getElementById('floating-whatsapp')) return;

    const btn = document.createElement('a');
    btn.id = 'floating-whatsapp';
    btn.href = 'https://wa.me/212600000000';
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.setAttribute('aria-label', 'WhatsApp');
    btn.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="" aria-hidden="true">';
    btn.className = 'fixed z-50 right-4 bottom-4 bg-transparent text-white p-0 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110';

    // Accessible label for small screens
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = 'WhatsApp';
    btn.appendChild(sr);

    document.body.appendChild(btn);
  }

  // Quick intro wipe animation
  setupLogoAnimation() {
    // Support both intro-overlay (index) and logo-overlay (other pages)
    const overlay = document.getElementById('intro-overlay') || document.getElementById('logo-overlay');
    if (!overlay) return;

    // Fast top-to-bottom wipe sequence (ms)
    const closeDur = 260;
    const pauseDur = 110;
    const openDur = 340;

    // Start closing animation
    overlay.classList.add('closing');

    // After close + pause, open curtains (applies if CSS has opening/closing rules)
    setTimeout(() => {
      overlay.classList.remove('closing');
      overlay.classList.add('opening');
    }, closeDur + pauseDur);

    // After full sequence, reveal content and remove overlay
    setTimeout(() => {
      try { overlay.style.opacity = '0'; } catch (e) {}
      document.body.classList.remove('content-hidden');
      setTimeout(() => {
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 120);
    }, closeDur + pauseDur + openDur + 60);
  }

  // Initialize AOS (Animate On Scroll)
  setupAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 500,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
      });
    }
  }

  // Fade in animations for sections and cards
  setupFadeIn() {
    document.querySelectorAll('section, .glass-card').forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.35s ease-out';
      setTimeout(() => {
        el.style.opacity = '1';
      }, 80);
    });
  }

  // Carousel functionality
  setupCarousel() {
    const carousel = document.getElementById('carousel-container');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('div[class*="flex-none"]');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.carousel-dot');

    if (slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('bg-cyan-600', index === currentIndex);
        dot.classList.toggle('bg-cyan-200', index !== currentIndex);
      });
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    };

    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoPlay = () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
    });

    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Start autoplay
    startAutoPlay();
  }

  // Burger menu functionality
  setupBurgerMenu() {
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobile-nav');
    const closeMobileNav = document.getElementById('close-mobile-nav');

    if (!burger || !mobileNav) return;

    const closeMenu = () => {
      mobileNav.classList.remove('show');
      document.body.classList.remove('overflow-hidden');
    };

    burger.addEventListener('click', () => {
      mobileNav.classList.remove('hidden');
      requestAnimationFrame(() => mobileNav.classList.add('show'));
      document.body.classList.add('overflow-hidden');
    });

    if (closeMobileNav) {
      closeMobileNav.addEventListener('click', closeMenu);
    }

    // Close on outside click
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) {
        closeMenu();
      }
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Language switcher functionality
  setupLanguageSwitcher() {
    const langFr = document.getElementById('lang-fr');
    const langAr = document.getElementById('lang-ar');

    if (!langFr || !langAr) return;

    const translations = this.getTranslations();

    const setLang = (lang) => {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
          el.textContent = translations[lang][key];
        }
      });

      const siteTitle = document.getElementById('site-title');
      if (siteTitle && translations[lang] && translations[lang].site_title) {
        siteTitle.textContent = translations[lang].site_title;
      }

      const footerText = document.getElementById('footer-text');
      if (footerText && translations[lang] && translations[lang].footer) {
        footerText.textContent = translations[lang].footer;
      }

      document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';

      // Store language preference
      localStorage.setItem('preferred-language', lang);
    };

    const langToggle = document.getElementById('lang-toggle');
    const langMenu = document.getElementById('lang-menu');
    const langFrMobile = document.getElementById('lang-fr-mobile');
    const langArMobile = document.getElementById('lang-ar-mobile');

    langFr.addEventListener('click', () => {
      setLang('fr');
      if (langMenu) langMenu.classList.add('hidden');
    });
    langAr.addEventListener('click', () => {
      setLang('ar');
      if (langMenu) langMenu.classList.add('hidden');
    });

    if (langFrMobile) {
      langFrMobile.addEventListener('click', () => {
        setLang('fr');
        document.getElementById('mobile-nav')?.classList.remove('show');
        document.body.classList.remove('overflow-hidden');
      });
    }
    if (langArMobile) {
      langArMobile.addEventListener('click', () => {
        setLang('ar');
        document.getElementById('mobile-nav')?.classList.remove('show');
        document.body.classList.remove('overflow-hidden');
      });
    }

    if (langToggle && langMenu) {
      langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.classList.toggle('hidden');
      });

      langMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      document.addEventListener('click', () => {
        if (langMenu && !langMenu.classList.contains('hidden')) {
          langMenu.classList.add('hidden');
        }
      });
    }

    // Load saved language preference
    const savedLang = localStorage.getItem('preferred-language') || 'fr';
    setLang(savedLang);
  }

  // Contact form functionality
  setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const whatsappLink = document.getElementById('whatsapp-link');

    if (!contactForm) return;

    const handleSubmit = (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      if (!name || !email || !message) {
        this.showNotification('Veuillez remplir tous les champs.', 'error');
        return;
      }

      // Prepare WhatsApp message
      const whatsappMessage = `Nom: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
      const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(whatsappMessage)}`;

      window.open(whatsappUrl, '_blank');
      this.showNotification('Votre message a été préparé pour WhatsApp.', 'success');

      // Reset form
      contactForm.reset();
    };

    const handleWhatsappClick = (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      const whatsappMessage = `Nom: ${name || 'Non spécifié'}%0AEmail: ${email || 'Non spécifié'}%0AMessage: ${message || 'Non spécifié'}`;
      const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(whatsappMessage)}`;

      window.open(whatsappUrl, '_blank');
    };

    contactForm.addEventListener('submit', handleSubmit);

    if (whatsappBtn) whatsappBtn.addEventListener('click', handleWhatsappClick);
    if (whatsappLink) whatsappLink.addEventListener('click', handleWhatsappClick);
  }

  // Notification system
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Translations data
  getTranslations() {
    return {
      fr: {
        nav_accueil: 'Accueil',
        nav_apropos: 'À propos',
        nav_services: 'Services',
        nav_tarifs: 'Tarifs',
        nav_conseils: 'Conseils',
        nav_contact: 'Contact',
        nav_rdv: 'RDV',
        site_title: 'Laboratoire Le Colisée',
        footer: '© 2026 Laboratoire Le Colisée – Tous droits réservés',
        hero_title: 'Laboratoire Le Colisée d\'analyses médicales',
        hero_desc: 'Laboratoire des analyses medicales à Marrakech',
        hero_li1: 'Laboratoire certifié ISO, résultats rapides',
        hero_li2: 'Personnel expérimenté et accueil chaleureux',
        hero_li3: 'Prélèvements à domicile disponibles',
        btn_rdv: 'Préparer votre visite',
        services_title: 'Nos services',
        services_intro: 'Nous proposons une large gamme d\'analyses médicales, réalisées avec précision et confidentialité.',
        service1: 'Hématologie',
        service1_desc: 'Numération sanguine, anémies, hémostase, etc.',
        service2: 'Biochimie',
        service2_desc: 'Fonction rénale, hépatique, ionogramme, etc.',
        service3: 'Immunologie',
        service3_desc: 'Sérologies, allergies, auto-immunité.',
        service4: 'Microbiologie',
        service4_desc: 'Bactériologie, mycologie, parasitologie.',
        service5: 'Tests PCR',
        service5_desc: 'COVID-19, grippes, IST, etc.',
        service6: 'Bilans complets',
        service6_desc: 'Bilans préopératoires, check-up, suivi chronique.',
        about_title: 'À propos du laboratoire',
        about_intro: 'Le Laboratoire Le Colisée est spécialisé dans les analyses médicales avec des équipements modernes, une équipe qualifiée et le respect des normes internationales.',
        about_li1: 'Plus de 20 ans d\'expérience au service de votre santé',
        about_li2: 'Laboratoire certifié ISO 15189',
        about_li3: 'Confidentialité et accompagnement personnalisé',
        about_team: 'Notre équipe',
        about_team_desc: 'Des biologistes, techniciens et infirmiers passionnés, à votre écoute et formés aux dernières avancées scientifiques.',
        about_values: 'Nos valeurs',
        about_values_desc: 'Éthique, rigueur, innovation et proximité guident notre engagement au quotidien.',
        about_timeline: 'Notre histoire',
        about_timeline1: '2005 : Création du laboratoire',
        about_timeline1_desc: 'Ouverture à Casablanca avec une vision d\'excellence et d\'accessibilité.',
        about_timeline2: '2015 : Certification ISO',
        about_timeline2_desc: 'Obtention de la certification ISO 15189 pour la qualité des analyses.',
        about_timeline3: '2023 : Digitalisation',
        about_timeline3_desc: 'Mise en place de la prise de rendez-vous en ligne et résultats numériques sécurisés.',
        about_cta: 'Contactez-nous',
        tarifs_title: 'Nos tarifs',
        tarifs_intro: 'Découvrez nos prix transparents pour les analyses les plus courantes. Pour un devis personnalisé, contactez-nous !',
        tarif_type: 'Type d\'analyse',
        tarif_desc: 'Description',
        tarif_prix: 'Prix',
        tarif_sang: 'Analyse sanguine',
        tarif_sang_desc: 'Bilan complet, dépistage, suivi diabète',
        tarif_gly: 'Test glycémie',
        tarif_gly_desc: 'Mesure du taux de sucre dans le sang',
        tarif_lipid: 'Bilan lipidique',
        tarif_lipid_desc: 'Cholestérol, triglycérides, HDL/LDL',
        tarif_urine: 'Analyse d\'urine',
        tarif_urine_desc: 'Recherche d\'infection, bilan rénal',
        tarif_pcr: 'Test PCR',
        tarif_pcr_desc: 'Dépistage COVID-19, grippes, etc.',
        tarifs_cta: 'Demander un devis personnalisé',
        contact_title: 'Contactez-nous',
        contact_info: 'Informations',
        contact_address: '123 Avenue des Sciences, Casablanca',
        contact_name: 'Nom',
        contact_email: 'Email',
        contact_message: 'Message',
        contact_send: 'Envoyer',
        contact_success: 'Votre message a été préparé pour WhatsApp.',
        contact_error: 'Veuillez remplir tous les champs.',
        footer_about: 'Laboratoire Le Colisée offre des services de diagnostic fiables depuis plus de 15 ans avec des équipements modernes et une équipe expérimentée.',
        footer_services: 'Services',
        footer_blood: 'Analyses sanguines',
        footer_hormones: 'Tests hormonaux',
        footer_bacterio: 'Bactériologie',
        footer_home: 'Prélèvements à domicile',
        footer_links: 'Liens utiles',
        footer_home_link: 'Accueil',
        footer_about_link: 'À propos',
        footer_tariffs: 'Tarifs',
        footer_contact_link: 'Contact',
        footer_contact_info: 'Contact Info',
        footer_city: 'Casablanca, Maroc',
        footer_privacy: 'Politique de confidentialité',
        footer_terms: 'Conditions d\'utilisation',
      },
      ar: {
        nav_accueil: 'الرئيسية',
        nav_apropos: 'من نحن',
        nav_services: 'الخدمات',
        nav_tarifs: 'الأسعار',
        nav_conseils: 'نصائح',
        nav_contact: 'اتصل بنا',
        nav_rdv: 'موعد',
        site_title: 'مختبر الكوليسي',
        footer: '© 2026 مختبر الكوليسي – جميع الحقوق محفوظة',
        hero_title: 'مختبر كوليزي للتحاليل الطبية',
        hero_desc: 'مختبر كوليزي للتحاليل الطبية في مراكش',
        hero_li1: 'مختبر معتمد ISO ونتائج سريعة',
        hero_li2: 'طاقم ذو خبرة واستقبال دافئ',
        hero_li3: 'أخذ العينات متاح في المنزل',
        btn_rdv: 'تحضير زيارتك',
        services_title: 'خدماتنا',
        services_intro: 'نقدم مجموعة واسعة من التحاليل الطبية، منجزة بدقة وسرية.',
        service1: 'الدم',
        service1_desc: 'عد الدم، فقر الدم، التخثر، إلخ.',
        service2: 'الكيمياء الحيوية',
        service2_desc: 'الوظيفة الكلوية، الكبدية، الأيونات، إلخ.',
        service3: 'المناعة',
        service3_desc: 'المصليات، الحساسية، المناعة الذاتية.',
        service4: 'الميكروبيولوجيا',
        service4_desc: 'البكتريولوجيا، الفطريات، الطفيليات.',
        service5: 'اختبارات PCR',
        service5_desc: 'كوفيد-19، الإنفلونزا، الأمراض المنقولة جنسياً، إلخ.',
        service6: 'الفحوصات الشاملة',
        service6_desc: 'الفحوصات قبل العمليات، الفحص الدوري، المتابعة المزمنة.',
        about_title: 'حول المختبر',
        about_intro: 'مختبر الكوليسي متخصص في التحاليل الطبية بأحدث الأجهزة وفريق مؤهل وفق المعايير الدولية.',
        about_li1: 'أكثر من 20 سنة خبرة في خدمتكم',
        about_li2: 'مختبر معتمد ISO 15189',
        about_li3: 'سرية تامة ومرافقة شخصية',
        about_team: 'فريقنا',
        about_team_desc: 'بيولوجيون وتقنيون وممرضون شغوفون بخدمتكم ومواكبون لأحدث التطورات العلمية.',
        about_values: 'قيمنا',
        about_values_desc: 'الأخلاقيات والدقة والابتكار والقرب توجه التزامنا اليومي.',
        about_timeline: 'تاريخنا',
        about_timeline1: '2005: تأسيس المختبر',
        about_timeline1_desc: 'الافتتاح في الدار البيضاء برؤية للتميز وسهولة الوصول.',
        about_timeline2: '2015: شهادة ISO',
        about_timeline2_desc: 'الحصول على شهادة ISO 15189 لجودة التحاليل.',
        about_timeline3: '2023: الرقمنة',
        about_timeline3_desc: 'إطلاق حجز المواعيد والنتائج الرقمية المؤمنة.',
        about_cta: 'اتصل بنا',
        tarifs_title: 'أسعارنا',
        tarifs_intro: 'اكتشفوا أسعارنا الشفافة لأشهر التحاليل. للمزيد من التفاصيل أو عرض خاص، اتصلوا بنا!',
        tarif_type: 'نوع التحليل',
        tarif_desc: 'الوصف',
        tarif_prix: 'السعر',
        tarif_sang: 'تحليل الدم',
        tarif_sang_desc: 'تحليل شامل، كشف، متابعة السكري',
        tarif_gly: 'اختبار السكر',
        tarif_gly_desc: 'قياس نسبة السكر في الدم',
        tarif_lipid: 'تحليل الدهون',
        tarif_lipid_desc: 'الكوليسترول، الدهون الثلاثية، HDL/LDL',
        tarif_urine: 'تحليل البول',
        tarif_urine_desc: 'كشف العدوى، فحص الكلى',
        tarif_pcr: 'اختبار PCR',
        tarif_pcr_desc: 'كشف كوفيد-19، الإنفلونزا، إلخ.',
        tarifs_cta: 'طلب عرض خاص',
        contact_title: 'اتصل بنا',
        contact_info: 'معلومات',
        contact_address: '123 شارع العلوم، الدار البيضاء',
        contact_name: 'الاسم',
        contact_email: 'البريد الإلكتروني',
        contact_message: 'رسالتك',
        contact_send: 'إرسال',
        contact_success: 'تم تجهيز رسالتك لإرسالها عبر واتساب.',
        contact_error: 'يرجى ملء جميع الحقول.',
        footer_about: 'يقدم مختبر الكوليسي خدمات تشخيصية موثوقة منذ أكثر من 15 سنة مع معدات حديثة وفريق ذو خبرة.',
        footer_services: 'الخدمات',
        footer_blood: 'تحاليل الدم',
        footer_hormones: 'اختبارات الهرمونات',
        footer_bacterio: 'البكتريولوجيا',
        footer_home: 'أخذ العينات في المنزل',
        footer_links: 'روابط مفيدة',
        footer_home_link: 'الرئيسية',
        footer_about_link: 'من نحن',
        footer_tariffs: 'الأسعار',
        footer_contact_link: 'اتصل بنا',
        footer_contact_info: 'معلومات الاتصال',
        footer_city: 'الدار البيضاء، المغرب',
        footer_privacy: 'سياسة الخصوصية',
        footer_terms: 'شروط الاستخدام',
      }
    };
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LaboApp();
});
