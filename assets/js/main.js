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
    btn.href = 'https://wa.me/212617304703';
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
      mobileNav.querySelectorAll('.mobile-dropdown-toggle').forEach((toggle) => {
        toggle.setAttribute('aria-expanded', 'false');
      });
      mobileNav.querySelectorAll('.mobile-dropdown-panel').forEach((panel) => {
        panel.classList.add('hidden');
      });
    };

    burger.addEventListener('click', () => {
      mobileNav.classList.remove('hidden');
      requestAnimationFrame(() => mobileNav.classList.add('show'));
      document.body.classList.add('overflow-hidden');
    });

    mobileNav.querySelectorAll('.mobile-dropdown-toggle').forEach((toggle) => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const panel = toggle.nextElementSibling;
        if (!panel || !panel.classList.contains('mobile-dropdown-panel')) return;

        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        panel.classList.toggle('hidden', isOpen);
      });
    });

    if (closeMobileNav) {
      closeMobileNav.addEventListener('click', closeMenu);
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('show') && !mobileNav.contains(e.target) && !burger.contains(e.target)) {
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
    const closeMobileLanguageMenu = () => {
      const mobileNav = document.getElementById('mobile-nav');
      if (!mobileNav) return;
      mobileNav.classList.remove('show');
      mobileNav.querySelectorAll('.mobile-dropdown-toggle').forEach((toggle) => {
        toggle.setAttribute('aria-expanded', 'false');
      });
      mobileNav.querySelectorAll('.mobile-dropdown-panel').forEach((panel) => {
        panel.classList.add('hidden');
      });
      document.body.classList.remove('overflow-hidden');
    };

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
        closeMobileLanguageMenu();
      });
    }
    if (langArMobile) {
      langArMobile.addEventListener('click', () => {
        setLang('ar');
        closeMobileLanguageMenu();
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
      const whatsappUrl = `https://wa.me/212617304703?text=${encodeURIComponent(whatsappMessage)}`;

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
      const whatsappUrl = `https://wa.me/212617304703?text=${encodeURIComponent(whatsappMessage)}`;

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
        nav_language: 'Langue',
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
        services_page_kicker: 'Biologie médicale complète',
        services_page_intro: 'Des analyses pensées pour le diagnostic, la prévention et le suivi médical, avec un accompagnement clair à chaque étape.',
        services_nav_label: 'Accès rapide aux services',
        service_included_label: 'Examens inclus',
        service_indications_label: 'Indications',
        service_preparation_label: 'Préparation',
        service_cta: 'Prendre rendez-vous',
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
        about_kicker: 'Excellence en biologie médicale',
        about_title: 'À propos du laboratoire',
        about_intro: 'Le Laboratoire Le Colisée associe expertise médicale, équipement moderne et accompagnement humain pour des analyses fiables, rapides et confidentielles.',
        doctor_name: 'Dr Hind BENNANI',
        doctor_role: 'Médecin Biologiste',
        doctor_bio_title: 'Biographie du médecin biologiste',
        doctor_bio_intro: 'Dr Hind BENNANI dirige le laboratoire avec une approche fondée sur la précision biologique, la sécurité du patient et l’écoute clinique.',
        doctor_bio_1: 'Médecin biologiste diplômée de la Faculté de Médecine et Pharmacie de Marrakech.',
        doctor_bio_2: 'Ancienne médecin au CHU Mohamed VI.',
        doctor_bio_3: 'Ancienne médecin à l’hôpital militaire Avicenne.',
        doctor_bio_4: 'Diplôme Universitaire : Assistance Médicale de Procréation – Université de Montpellier.',
        values_title: 'Charte des valeurs',
        values_intro: 'Nos engagements guident chaque prélèvement, chaque analyse et chaque échange avec les patients.',
        value_quality_title: 'Rigueur scientifique',
        value_quality_desc: 'Protocoles maîtrisés, contrôles qualité et interprétation biologique fiable pour soutenir les décisions médicales.',
        value_human_title: 'Accueil humain',
        value_human_desc: 'Écoute, pédagogie et respect du rythme de chaque patient, du premier contact au rendu des résultats.',
        value_privacy_title: 'Confidentialité',
        value_privacy_desc: 'Protection stricte des données personnelles, des résultats et des échanges médicaux sensibles.',
        value_innovation_title: 'Innovation utile',
        value_innovation_desc: 'Technologies modernes et organisation fluide pour gagner en précision, rapidité et confort.',
        specialties_title: 'Nos Spécialités',
        specialties_intro: 'Une expertise biologique organisée autour des besoins essentiels des patients, médecins et familles.',
        specialty_clinical_title: 'Biologie clinique',
        specialty_clinical_desc: 'Bilans sanguins, biochimie, hématologie et suivi biologique des pathologies courantes ou complexes.',
        specialty_micro_title: 'Microbiologie et infections',
        specialty_micro_desc: 'Recherche d’infections, cultures, antibiogrammes et orientation thérapeutique en lien avec le médecin.',
        specialty_repro_title: 'Santé reproductive',
        specialty_repro_desc: 'Bilans hormonaux, fertilité, grossesse et assistance médicale de procréation avec discrétion et précision.',
        about_li1: 'Plus de 20 ans d\'expérience au service de votre santé',
        about_li2: 'Laboratoire certifié ISO 15189',
        about_li3: 'Confidentialité et accompagnement personnalisé',
        about_team: 'Notre équipe',
        about_team_desc: 'Des biologistes, techniciens et infirmiers passionnés, à votre écoute et formés aux dernières avancées scientifiques.',
        about_values: 'Nos valeurs',
        about_values_desc: 'Éthique, rigueur, innovation et proximité guident notre engagement au quotidien.',
        about_timeline: 'Notre histoire',
        about_timeline1: '2005 : Création du laboratoire',
        about_timeline1_desc: 'Ouverture à Marrakech avec une vision d\'excellence et d\'accessibilité.',
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
        contact_kicker: 'Contact & accompagnement',
        contact_intro: 'Notre équipe vous répond pour vos rendez-vous, résultats, demandes administratives et informations pratiques.',
        contact_info: 'Informations',
        contact_info_desc: 'Pour une réponse efficace, indiquez votre nom, votre téléphone et l’objet de votre demande.',
        contact_address: 'numéro 1A, Magasin rez-de-chaussée, Immeuble Koutoubia, Bd Mohamed Zerktouni, Marrakech 40000',
        contact_name: 'Nom',
        contact_email: 'Email',
        contact_message: 'Message',
        contact_send: 'Envoyer',
        contact_call_button: 'Appeler le laboratoire',
        contact_feedback_button: 'Avis & réclamation',
        contact_visit_title: 'Avant votre visite',
        contact_visit_1: 'Apportez votre ordonnance, votre pièce d’identité et vos anciens résultats si utiles.',
        contact_visit_2: 'Pour les analyses à jeun, privilégiez un passage le matin avant le petit-déjeuner.',
        contact_visit_3: 'En cas de doute sur la préparation, contactez-nous avant votre déplacement.',
        contact_form_title: 'Envoyer une demande',
        contact_form_desc: 'Décrivez votre besoin en quelques lignes. Le message sera préparé pour un envoi rapide.',
        contact_map_desc: 'Le laboratoire est accessible pour les patients, familles et professionnels de santé. Vérifiez l’itinéraire avant votre départ.',
        contact_maps_button: 'Ouvrir Google Maps',
        contact_hours_week: 'Accueil, prélèvements et renseignements',
        contact_hours_sat: 'Service du matin',
        contact_hours_sun: 'Repos hebdomadaire',
        contact_success: 'Votre message a été préparé pour WhatsApp.',
        contact_error: 'Veuillez remplir tous les champs.',
        testimonials_title: 'Témoignages de nos clients',
        test1_text: '"Accueil chaleureux, résultats rapides et précis. Je recommande vivement!"',
        test1_name: 'Fatima B.',
        test1_date: 'Marrakech',
        test2_text: '"Personnel très professionnel. Les prélèvements à domicile sont très pratiques."',
        test2_name: 'Ahmed M.',
        test2_date: 'Rabat',
        test3_text: '"Meilleur laboratoire en ville. Équipement moderne et résultats fiables."',
        test3_name: 'Mariam L.',
        test3_date: 'Fès',
        why_title: 'Pourquoi nous choisir?',
        why_1: 'Satisfaction clients',
        why_2: 'Années d’expérience',
        why_3: 'Patients servis',
        why_4: 'Résultats rapides',
        why_expertise_title: 'Expertise médicale',
        why_expertise_desc: 'Analyses supervisées par Dr. BENNANI Hind avec rigueur, écoute et interprétation biologique fiable.',
        why_equipment_title: 'Matériel moderne',
        why_equipment_desc: 'Équipements récents et procédures contrôlées pour des résultats rapides, précis et reproductibles.',
        why_privacy_title: 'Confidentialité',
        why_privacy_desc: 'Données personnelles et résultats protégés avec discrétion, accès sécurisé et respect strict du secret médical.',
        details_about_link: 'Voir les détails',
        details_services_link: 'Tous les services',
        details_advice_link: 'Plus de conseils',
        details_contact_link: 'Détails contact',
        services_home_intro: 'Des prestations pensées pour le diagnostic, le suivi et la prévention, avec accompagnement personnalisé.',
        service_routine_title: 'Analyses de Routine',
        service_routine_short: 'Bilans courants pour contrôler les paramètres essentiels et orienter rapidement le diagnostic médical.',
        service_routine_detail: 'Hématologie, biochimie, ionogramme, fonction rénale et hépatique: des examens courants pour suivre les paramètres essentiels et orienter rapidement votre médecin.',
        service_routine_item1: 'Numération formule sanguine',
        service_routine_item2: 'Glycémie et bilan lipidique',
        service_routine_item3: 'Fonctions rénale et hépatique',
        service_routine_item4: 'Analyses urinaires courantes',
        service_routine_context: 'Ce service convient aux contrôles prescrits par votre médecin, aux symptômes récents ou au suivi simple de votre état général.',
        service_routine_indications: 'Fatigue, infection, contrôle annuel, suivi de traitement ou exploration d’un déséquilibre biologique.',
        service_routine_preparation: 'Certaines analyses demandent le jeûne. Apportez votre ordonnance et vos derniers résultats si disponibles.',
        service_bilan_title: 'Bilan de Santé',
        service_bilan_short: 'Check-up complet pour évaluer votre état général et détecter les déséquilibres précocement.',
        service_bilan_detail: 'Des bilans personnalisés selon l’âge, les antécédents et les objectifs de prévention pour évaluer l’état général et repérer les déséquilibres précocement.',
        service_bilan_item1: 'Check-up général',
        service_bilan_item2: 'Bilan fatigue et carences',
        service_bilan_item3: 'Bilan préopératoire',
        service_bilan_item4: 'Suivi annuel de prévention',
        service_bilan_context: 'Le bilan est construit pour donner une vision globale: métabolisme, carences, inflammation, organes clés et facteurs de risque.',
        service_bilan_indications: 'Prévention annuelle, fatigue persistante, antécédents familiaux, changement de mode de vie ou préparation médicale.',
        service_bilan_preparation: 'Venez idéalement le matin. Le jeûne peut être demandé selon le bilan lipidique ou glycémique.',
        service_chronic_title: 'Suivi des Maladies Chroniques',
        service_chronic_short: 'Contrôles réguliers pour diabète, reins, foie, thyroïde et traitements au long cours.',
        service_chronic_detail: 'Des analyses régulières pour surveiller l’évolution des maladies chroniques, adapter les traitements et prévenir les complications avec votre médecin.',
        service_chronic_item1: 'Diabète et HbA1c',
        service_chronic_item2: 'Thyroïde et hormones',
        service_chronic_item3: 'Fonction rénale',
        service_chronic_item4: 'Suivi thérapeutique biologique',
        service_chronic_context: 'Nous facilitons un suivi régulier, comparable dans le temps, avec des résultats lisibles pour le patient et le médecin traitant.',
        service_chronic_indications: 'Diabète, hypertension, troubles thyroïdiens, insuffisance rénale, traitements prolongés ou adaptation posologique.',
        service_chronic_preparation: 'Respectez les horaires de prise indiqués par votre médecin, surtout pour les dosages de traitement.',
        service_prevention_title: 'Dépistages et Prévention',
        service_prevention_short: 'Examens ciblés pour repérer les risques infectieux, métaboliques ou hormonaux avant complications.',
        service_prevention_detail: 'Dépistages ciblés pour identifier précocement les risques infectieux, métaboliques ou hormonaux et favoriser une prise en charge rapide.',
        service_prevention_item1: 'Sérologies et infections',
        service_prevention_item2: 'Dépistage métabolique',
        service_prevention_item3: 'Bilan cardiovasculaire',
        service_prevention_item4: 'Prévention personnalisée',
        service_prevention_context: 'La prévention permet d’agir avant les complications, avec des examens adaptés à l’âge, au contexte et aux facteurs de risque.',
        service_prevention_indications: 'Exposition infectieuse, antécédents familiaux, suivi vaccinal, bilan cardiovasculaire ou contrôle avant projet personnel.',
        service_prevention_preparation: 'Signalez vos vaccins récents, traitements et dates d’exposition éventuelle pour interpréter correctement les résultats.',
        service_reproductive_title: 'Santé Reproductive',
        service_reproductive_short: 'Bilans hormonaux, fertilité, grossesse et suivi biologique adapté à chaque étape.',
        service_reproductive_detail: 'Bilans biologiques pour fertilité, grossesse, hormones et suivi gynécologique, avec discrétion et accompagnement adapté.',
        service_reproductive_item1: 'Bilans hormonaux',
        service_reproductive_item2: 'Suivi de grossesse',
        service_reproductive_item3: 'Fertilité et réserve ovarienne',
        service_reproductive_item4: 'Analyses prénatales',
        service_reproductive_context: 'Nous accompagnons les étapes sensibles avec confidentialité: projet de grossesse, suivi hormonal, fertilité et surveillance prénatale.',
        service_reproductive_indications: 'Troubles du cycle, bilan de fertilité, confirmation ou suivi de grossesse, contrôle hormonal ou parcours AMP.',
        service_reproductive_preparation: 'Certains dosages dépendent du jour du cycle. Notez la date des dernières règles et les traitements en cours.',
        service_sport_title: 'Santé Sportive',
        service_sport_short: 'Bilans biologiques pour performance, récupération, carences et reprise sportive sécurisée.',
        service_sport_detail: 'Bilans adaptés aux sportifs pour surveiller récupération, inflammation, carences, hydratation et reprise après arrêt ou blessure.',
        service_sport_item1: 'Bilan carences et vitamines',
        service_sport_item2: 'Inflammation et récupération',
        service_sport_item3: 'Métabolisme et énergie',
        service_sport_item4: 'Suivi reprise sportive',
        service_sport_context: 'Le bilan sportif aide à ajuster l’entraînement, prévenir les carences et sécuriser une reprise avec des repères biologiques fiables.',
        service_sport_indications: 'Fatigue à l’effort, baisse de performance, reprise après blessure, préparation de compétition ou surveillance nutritionnelle.',
        service_sport_preparation: 'Évitez l’effort intense la veille si votre médecin souhaite mesurer l’état de récupération basal.',
        advice_home_title: 'Conseils & Astuces',
        advice_home_intro: 'Conseils pour vous aider à vous préparer.',
        advice_fasting_title: 'Vérifier le jeûne',
        advice_fasting_desc: 'Certaines analyses exigent 8 à 12 heures de jeûne. Demandez confirmation avant votre rendez-vous.',
        advice_fasting_detail: 'Pour la glycémie, les triglycérides ou certains bilans, respectez 8 à 12 heures de jeûne sauf avis médical différent.',
        advice_hydration_title: 'Rester hydraté',
        advice_hydration_desc: 'Boire de l’eau facilite le prélèvement, sauf indication contraire de votre médecin.',
        advice_hydration_detail: 'Buvez de l’eau avant la prise de sang. Cela facilite le prélèvement et améliore votre confort.',
        advice_docs_title: 'Préparer vos documents',
        advice_docs_desc: 'Apportez ordonnance, carte d’identité et anciens résultats utiles pour un dossier complet.',
        advice_docs_detail: 'Apportez ordonnance, pièce d’identité, informations d’assurance et anciens résultats si le médecin les demande.',
        advice_treatment_title: 'Signaler vos traitements',
        advice_treatment_desc: 'Informez l’équipe des médicaments, compléments ou anticoagulants pris avant le prélèvement.',
        advice_time_title: 'Respecter l’horaire',
        advice_time_desc: 'Arrivez à l’heure prévue, surtout pour les analyses sensibles au moment du prélèvement.',
        advice_avoid_title: 'Éviter certains excès',
        advice_avoid_desc: 'Évitez alcool, repas très gras et effort intense la veille si votre bilan le nécessite.',
        advice_cta_title: 'Prêt pour votre analyse ?',
        advice_cta_desc: 'Réservez votre rendez-vous en ligne pour un service rapide et personnalisé.',
        advice_cta_button: 'Prendre rendez-vous',
        conseils_title: 'Conseils pour vos analyses',
        conseils_intro: 'Suivez ces recommandations pour garantir la fiabilité de vos résultats et votre confort lors du prélèvement.',
        hours_title: 'Horaires et Localisation',
        hours_heading: 'Horaires d’ouverture',
        day_lun: 'Lundi - Vendredi:',
        day_sam: 'Samedi:',
        day_dim: 'Dimanche:',
        closed: 'Fermé',
        hours_emergency: 'Prélèvements et renseignements pendant les horaires d’ouverture.',
        contact_heading: 'Nous contacter',
        phone_label: 'Téléphone:',
        email_label: 'Email:',
        address_label: 'Adresse:',
        map_heading: 'Nous trouver',
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
        footer_city: 'Marrakech 40000, Maroc',
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
        nav_language: 'اللغة',
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
        services_page_kicker: 'بيولوجيا طبية شاملة',
        services_page_intro: 'تحاليل موجهة للتشخيص والوقاية والمتابعة الطبية، مع مواكبة واضحة في كل مرحلة.',
        services_nav_label: 'وصول سريع إلى الخدمات',
        service_included_label: 'الفحوصات المشمولة',
        service_indications_label: 'متى ينصح بها',
        service_preparation_label: 'التحضير',
        service_cta: 'حجز موعد',
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
        about_kicker: 'التميز في البيولوجيا الطبية',
        about_title: 'حول المختبر',
        about_intro: 'يجمع مختبر الكوليسي بين الخبرة الطبية والمعدات الحديثة والمواكبة الإنسانية من أجل تحاليل موثوقة وسريعة وسرية.',
        doctor_name: 'د. هند بناني',
        doctor_role: 'طبيبة بيولوجية',
        doctor_bio_title: 'السيرة المهنية للطبيبة البيولوجية',
        doctor_bio_intro: 'تدير د. هند بناني المختبر بمنهج يرتكز على الدقة البيولوجية وسلامة المريض والإنصات السريري.',
        doctor_bio_1: 'طبيبة بيولوجية خريجة كلية الطب والصيدلة بمراكش.',
        doctor_bio_2: 'طبيبة سابقة بالمركز الاستشفائي الجامعي محمد السادس.',
        doctor_bio_3: 'طبيبة سابقة بالمستشفى العسكري ابن سينا.',
        doctor_bio_4: 'دبلوم جامعي: المساعدة الطبية على الإنجاب – جامعة مونبلييه.',
        values_title: 'ميثاق القيم',
        values_intro: 'توجه التزاماتنا كل عملية أخذ عينة وكل تحليل وكل تواصل مع المرضى.',
        value_quality_title: 'صرامة علمية',
        value_quality_desc: 'بروتوكولات مضبوطة ومراقبة جودة وتفسير بيولوجي موثوق لدعم القرارات الطبية.',
        value_human_title: 'استقبال إنساني',
        value_human_desc: 'إنصات وتوضيح واحترام لإيقاع كل مريض من أول تواصل إلى تسليم النتائج.',
        value_privacy_title: 'السرية',
        value_privacy_desc: 'حماية صارمة للمعطيات الشخصية والنتائج والمراسلات الطبية الحساسة.',
        value_innovation_title: 'ابتكار نافع',
        value_innovation_desc: 'تقنيات حديثة وتنظيم سلس لتحسين الدقة والسرعة وراحة المريض.',
        specialties_title: 'تخصصاتنا',
        specialties_intro: 'خبرة بيولوجية منظمة حول الاحتياجات الأساسية للمرضى والأطباء والعائلات.',
        specialty_clinical_title: 'البيولوجيا السريرية',
        specialty_clinical_desc: 'تحاليل الدم والكيمياء الحيوية وأمراض الدم والمتابعة البيولوجية للحالات الشائعة أو المعقدة.',
        specialty_micro_title: 'الميكروبيولوجيا والعدوى',
        specialty_micro_desc: 'البحث عن العدوى والزراعات والمضادات الحيوية والتوجيه العلاجي بتنسيق مع الطبيب.',
        specialty_repro_title: 'الصحة الإنجابية',
        specialty_repro_desc: 'تحاليل هرمونية وخصوبة وحمل ومساعدة طبية على الإنجاب بسرية ودقة.',
        about_li1: 'أكثر من 20 سنة خبرة في خدمتكم',
        about_li2: 'مختبر معتمد ISO 15189',
        about_li3: 'سرية تامة ومرافقة شخصية',
        about_team: 'فريقنا',
        about_team_desc: 'بيولوجيون وتقنيون وممرضون شغوفون بخدمتكم ومواكبون لأحدث التطورات العلمية.',
        about_values: 'قيمنا',
        about_values_desc: 'الأخلاقيات والدقة والابتكار والقرب توجه التزامنا اليومي.',
        about_timeline: 'تاريخنا',
        about_timeline1: '2005: تأسيس المختبر',
        about_timeline1_desc: 'الافتتاح في مراكش برؤية للتميز وسهولة الوصول.',
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
        contact_kicker: 'تواصل ومواكبة',
        contact_intro: 'فريقنا يجيب عن مواعيدكم ونتائجكم والطلبات الإدارية والمعلومات العملية.',
        contact_info: 'معلومات',
        contact_info_desc: 'لإجابة فعالة، يرجى ذكر الاسم ورقم الهاتف وموضوع الطلب.',
        contact_address: 'رقم 1A، محل بالطابق الأرضي، عمارة الكتبية، شارع محمد الزرقطوني، مراكش 40000',
        contact_name: 'الاسم',
        contact_email: 'البريد الإلكتروني',
        contact_message: 'رسالتك',
        contact_send: 'إرسال',
        contact_call_button: 'الاتصال بالمختبر',
        contact_feedback_button: 'آراء وشكايات',
        contact_visit_title: 'قبل زيارتكم',
        contact_visit_1: 'أحضروا الوصفة الطبية وبطاقة التعريف والنتائج السابقة إذا كانت مفيدة.',
        contact_visit_2: 'بالنسبة للتحاليل التي تتطلب الصيام، يفضل الحضور صباحا قبل الإفطار.',
        contact_visit_3: 'عند الشك في طريقة التحضير، اتصلوا بنا قبل التنقل.',
        contact_form_title: 'إرسال طلب',
        contact_form_desc: 'صفوا حاجتكم في بضعة أسطر. سيتم تجهيز الرسالة لإرسال سريع.',
        contact_map_desc: 'المختبر متاح للمرضى والعائلات ومهنيي الصحة. تحققوا من الطريق قبل الانطلاق.',
        contact_maps_button: 'فتح Google Maps',
        contact_hours_week: 'استقبال وأخذ عينات ومعلومات',
        contact_hours_sat: 'خدمة صباحية',
        contact_hours_sun: 'راحة أسبوعية',
        contact_success: 'تم تجهيز رسالتك لإرسالها عبر واتساب.',
        contact_error: 'يرجى ملء جميع الحقول.',
        testimonials_title: 'آراء عملائنا',
        test1_text: '"استقبال جيد ونتائج سريعة ودقيقة. أنصح به بشدة!"',
        test1_name: 'فاطمة ب.',
        test1_date: 'مراكش',
        test2_text: '"طاقم مهني جدا. خدمة أخذ العينات في المنزل عملية للغاية."',
        test2_name: 'أحمد م.',
        test2_date: 'الرباط',
        test3_text: '"أفضل مختبر في المدينة. معدات حديثة ونتائج موثوقة."',
        test3_name: 'مريم ل.',
        test3_date: 'فاس',
        why_title: 'لماذا تختاروننا؟',
        why_1: 'رضا المرضى',
        why_2: 'سنوات من الخبرة',
        why_3: 'مريض تم خدمته',
        why_4: 'نتائج سريعة',
        why_expertise_title: 'خبرة طبية',
        why_expertise_desc: 'تحاليل بإشراف الدكتورة بناني هند مع دقة وإنصات وتفسير بيولوجي موثوق.',
        why_equipment_title: 'معدات حديثة',
        why_equipment_desc: 'أجهزة حديثة وإجراءات مضبوطة لضمان نتائج سريعة ودقيقة وقابلة للتكرار.',
        why_privacy_title: 'السرية',
        why_privacy_desc: 'حماية المعطيات الشخصية والنتائج بسرية واحترام صارم للسر الطبي.',
        details_about_link: 'عرض التفاصيل',
        details_services_link: 'كل الخدمات',
        details_advice_link: 'المزيد من النصائح',
        details_contact_link: 'تفاصيل الاتصال',
        services_home_intro: 'خدمات موجهة للتشخيص والمتابعة والوقاية مع مواكبة شخصية.',
        service_routine_title: 'تحاليل روتينية',
        service_routine_short: 'تحاليل شائعة لمراقبة المؤشرات الأساسية وتوجيه التشخيص بسرعة.',
        service_routine_detail: 'أمراض الدم، الكيمياء الحيوية، الأملاح، وظائف الكلى والكبد: فحوصات شائعة لمتابعة المؤشرات الأساسية وتوجيه الطبيب بسرعة.',
        service_routine_item1: 'تعداد وصيغة الدم',
        service_routine_item2: 'سكر الدم والدهنيات',
        service_routine_item3: 'وظائف الكلى والكبد',
        service_routine_item4: 'تحاليل البول الشائعة',
        service_routine_context: 'هذه الخدمة مناسبة للفحوصات التي يطلبها الطبيب، للأعراض الحديثة أو للمتابعة العامة البسيطة.',
        service_routine_indications: 'تعب، عدوى، مراقبة سنوية، متابعة علاج أو البحث عن اضطراب بيولوجي.',
        service_routine_preparation: 'بعض التحاليل تتطلب الصيام. أحضر الوصفة والنتائج السابقة إذا كانت متوفرة.',
        service_bilan_title: 'فحص صحي شامل',
        service_bilan_short: 'فحص شامل لتقييم الحالة العامة واكتشاف الاختلالات مبكرا.',
        service_bilan_detail: 'فحوصات شخصية حسب العمر والسوابق وأهداف الوقاية لتقييم الحالة العامة واكتشاف الاختلالات مبكرا.',
        service_bilan_item1: 'فحص عام',
        service_bilan_item2: 'فحص التعب والنواقص',
        service_bilan_item3: 'فحص قبل الجراحة',
        service_bilan_item4: 'متابعة وقائية سنوية',
        service_bilan_context: 'صمم هذا الفحص لإعطاء رؤية شاملة عن الاستقلاب، النواقص، الالتهاب، الأعضاء الأساسية وعوامل الخطر.',
        service_bilan_indications: 'وقاية سنوية، تعب مستمر، سوابق عائلية، تغيير نمط الحياة أو تحضير طبي.',
        service_bilan_preparation: 'يفضل الحضور صباحا. قد يطلب الصيام حسب فحص الدهون أو سكر الدم.',
        service_chronic_title: 'متابعة الأمراض المزمنة',
        service_chronic_short: 'مراقبة منتظمة للسكري والكلى والكبد والغدة الدرقية والعلاجات طويلة الأمد.',
        service_chronic_detail: 'تحاليل منتظمة لمراقبة تطور الأمراض المزمنة وتكييف العلاج والوقاية من المضاعفات مع الطبيب.',
        service_chronic_item1: 'السكري و HbA1c',
        service_chronic_item2: 'الغدة الدرقية والهرمونات',
        service_chronic_item3: 'وظائف الكلى',
        service_chronic_item4: 'متابعة علاجية بيولوجية',
        service_chronic_context: 'نسهل متابعة منتظمة قابلة للمقارنة مع الوقت، بنتائج واضحة للمريض والطبيب المعالج.',
        service_chronic_indications: 'السكري، ارتفاع الضغط، اضطرابات الغدة الدرقية، قصور الكلى، العلاجات الطويلة أو تعديل الجرعات.',
        service_chronic_preparation: 'احترم توقيت أخذ الدواء الذي حدده طبيبك، خصوصا عند قياس مستويات العلاجات.',
        service_prevention_title: 'الكشف والوقاية',
        service_prevention_short: 'فحوصات موجهة لرصد مخاطر العدوى أو الاضطرابات قبل حدوث المضاعفات.',
        service_prevention_detail: 'كشوفات موجهة لتحديد المخاطر المعدية أو الاستقلابية أو الهرمونية مبكرا وتسريع التكفل.',
        service_prevention_item1: 'السيرولوجيا والعدوى',
        service_prevention_item2: 'الكشف الاستقلابي',
        service_prevention_item3: 'فحص القلب والشرايين',
        service_prevention_item4: 'وقاية شخصية',
        service_prevention_context: 'تساعد الوقاية على التدخل قبل المضاعفات، عبر فحوصات مناسبة للعمر والسياق وعوامل الخطر.',
        service_prevention_indications: 'تعرض لعدوى، سوابق عائلية، متابعة اللقاحات، فحص قلبي وعائي أو مراقبة قبل مشروع شخصي.',
        service_prevention_preparation: 'أخبرنا باللقاحات الحديثة والعلاجات وتواريخ التعرض المحتملة لتفسير النتائج بدقة.',
        service_reproductive_title: 'الصحة الإنجابية',
        service_reproductive_short: 'فحوصات هرمونية وخصوبة وحمل ومتابعة بيولوجية مناسبة لكل مرحلة.',
        service_reproductive_detail: 'تحاليل بيولوجية للخصوبة والحمل والهرمونات والمتابعة النسائية بسرية ومواكبة مناسبة.',
        service_reproductive_item1: 'فحوصات هرمونية',
        service_reproductive_item2: 'متابعة الحمل',
        service_reproductive_item3: 'الخصوبة والمخزون المبيضي',
        service_reproductive_item4: 'تحاليل ما قبل الولادة',
        service_reproductive_context: 'نواكب المراحل الحساسة بسرية: مشروع الحمل، المتابعة الهرمونية، الخصوبة والمراقبة قبل الولادة.',
        service_reproductive_indications: 'اضطرابات الدورة، فحص الخصوبة، تأكيد أو متابعة الحمل، مراقبة هرمونية أو مسار المساعدة الطبية على الإنجاب.',
        service_reproductive_preparation: 'بعض التحاليل ترتبط بيوم الدورة. سجل تاريخ آخر دورة والعلاجات الجارية.',
        service_sport_title: 'الصحة الرياضية',
        service_sport_short: 'تحاليل للأداء والتعافي والنواقص والعودة الآمنة للنشاط الرياضي.',
        service_sport_detail: 'فحوصات مناسبة للرياضيين لمراقبة التعافي والالتهاب والنواقص والترطيب والعودة بعد التوقف أو الإصابة.',
        service_sport_item1: 'فحص النواقص والفيتامينات',
        service_sport_item2: 'الالتهاب والتعافي',
        service_sport_item3: 'الاستقلاب والطاقة',
        service_sport_item4: 'متابعة العودة للرياضة',
        service_sport_context: 'يساعد الفحص الرياضي على ضبط التدريب، الوقاية من النواقص وتأمين العودة للنشاط بمؤشرات بيولوجية موثوقة.',
        service_sport_indications: 'تعب عند الجهد، انخفاض الأداء، عودة بعد إصابة، تحضير لمنافسة أو متابعة غذائية.',
        service_sport_preparation: 'تجنب الجهد الشديد في اليوم السابق إذا أراد الطبيب قياس حالة التعافي الأساسية.',
        advice_home_title: 'نصائح وإرشادات',
        advice_home_intro: 'نصائح لمساعدتك على الاستعداد.',
        advice_fasting_title: 'التحقق من الصيام',
        advice_fasting_desc: 'بعض التحاليل تتطلب صياما من 8 إلى 12 ساعة. تأكد قبل الموعد.',
        advice_fasting_detail: 'بالنسبة لسكر الدم أو الدهون أو بعض الفحوصات، احترم صيام 8 إلى 12 ساعة إلا إذا أوصى الطبيب بغير ذلك.',
        advice_hydration_title: 'الحفاظ على الترطيب',
        advice_hydration_desc: 'شرب الماء يسهل أخذ العينة إلا إذا أوصى الطبيب بغير ذلك.',
        advice_hydration_detail: 'اشرب الماء قبل سحب الدم. ذلك يسهل العملية ويحسن راحتك.',
        advice_docs_title: 'تحضير الوثائق',
        advice_docs_desc: 'أحضر الوصفة وبطاقة التعريف والنتائج السابقة المفيدة لملف كامل.',
        advice_docs_detail: 'أحضر الوصفة وبطاقة التعريف ومعلومات التأمين والنتائج السابقة إذا طلبها الطبيب.',
        advice_treatment_title: 'إخبارنا بالعلاجات',
        advice_treatment_desc: 'أخبر الفريق بالأدوية أو المكملات أو مضادات التخثر قبل أخذ العينة.',
        advice_time_title: 'احترام الموعد',
        advice_time_desc: 'احضر في الوقت المحدد خصوصا للتحاليل الحساسة لتوقيت أخذ العينة.',
        advice_avoid_title: 'تجنب بعض الإفراط',
        advice_avoid_desc: 'تجنب الكحول والوجبات الدسمة والجهد الشديد في اليوم السابق إذا لزم الأمر.',
        advice_cta_title: 'هل أنت مستعد للتحليل؟',
        advice_cta_desc: 'احجز موعدك عبر الإنترنت لخدمة سريعة وشخصية.',
        advice_cta_button: 'حجز موعد',
        conseils_title: 'نصائح لتحاليلك',
        conseils_intro: 'اتبع هذه التوصيات لضمان موثوقية النتائج وراحتك أثناء أخذ العينة.',
        hours_title: 'الأوقات والموقع',
        hours_heading: 'أوقات العمل',
        day_lun: 'الإثنين - الجمعة:',
        day_sam: 'السبت:',
        day_dim: 'الأحد:',
        closed: 'مغلق',
        hours_emergency: 'أخذ العينات والمعلومات خلال أوقات العمل.',
        contact_heading: 'اتصلوا بنا',
        phone_label: 'الهاتف:',
        email_label: 'البريد الإلكتروني:',
        address_label: 'العنوان:',
        map_heading: 'موقعنا',
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
        footer_city: 'مراكش 40000، المغرب',
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
