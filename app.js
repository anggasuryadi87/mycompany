/* ==========================================================================
   SINERGI SOLUSI DIGITAL - Application Script (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header & Back-to-Top Button
    const header = document.querySelector('.header');
    const backtop = document.querySelector('.floating-backtop');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Header Background Change
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to Top Button visibility
        if (scrollPos > 500) {
            backtop.classList.add('show');
        } else {
            backtop.classList.remove('show');
        }

        // Active Navigation Link on Scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // 2. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Close menu when clicking link (Mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) icon.className = 'fa fa-bars';
        });
    });

    // 3. Hero Banner Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDotsContainer = document.querySelector('.hero-dots');
    let activeSlideIndex = 0;
    let slideInterval;

    if (heroSlides.length > 0) {
        // Create Dots
        heroSlides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = `hero-dot ${idx === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => showSlide(idx));
            heroDotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.hero-dot');

        function showSlide(index) {
            heroSlides[activeSlideIndex].classList.remove('active');
            dots[activeSlideIndex].classList.remove('active');
            
            activeSlideIndex = (index + heroSlides.length) % heroSlides.length;
            
            heroSlides[activeSlideIndex].classList.add('active');
            dots[activeSlideIndex].classList.add('active');
            
            resetInterval();
        }

        function nextSlide() {
            showSlide(activeSlideIndex + 1);
        }

        function prevSlide() {
            showSlide(activeSlideIndex - 1);
        }

        // Attach Arrows
        document.querySelector('.hero-arrow-next').addEventListener('click', nextSlide);
        document.querySelector('.hero-arrow-prev').addEventListener('click', prevSlide);

        // Auto slide interval
        function startInterval() {
            slideInterval = setInterval(nextSlide, 6000);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        startInterval();
    }

    // 4. Calculator Tab Switcher Logic
    const tabButtons = document.querySelectorAll('.calc-tab-btn');
    const calcPanels = document.querySelectorAll('.calc-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(x => x.classList.remove('active'));
            calcPanels.forEach(x => x.classList.remove('active'));

            btn.classList.add('active');
            const panelId = btn.dataset.panel;
            document.getElementById(panelId).classList.add('active');
        });
    });

    // ==========================================
    // 5. CALCULATOR A: SOFTWARE COST CALCULATOR
    // ==========================================
    const softPlatforms = document.querySelectorAll('#panel-software .calc-card-option');
    const softDesignSelect = document.getElementById('soft-design');
    const softFeatureCards = document.querySelectorAll('.checkbox-card');
    
    // UI Outputs for Software
    const sumSoftPlatform = document.getElementById('sum-soft-platform');
    const sumSoftDesign = document.getElementById('sum-soft-design');
    const sumSoftFeatures = document.getElementById('sum-soft-features');
    const sumSoftPrice = document.getElementById('sum-soft-price');
    const softWhatsAppLink = document.getElementById('soft-whatsapp-link');

    // Default Selected Options
    let selectedPlatforms = ['web']; // can contain 'web', 'android', 'ios'

    // Pricing Model for Software
    const platformBasePrices = {
        web: 15000000,
        android: 20000000,
        ios: 25000000
    };

    const designModifiers = {
        template: 1.0,
        custom: 1.25,
        advanced: 1.45
    };

    const featurePrices = {
        auth: 3000000,
        payment: 5000000,
        chat: 4500000,
        admin: 6000000,
        notif: 2500000,
        api: 5500000
    };

    function calculateSoftware() {
        if (!sumSoftPrice) return;

        const platformNames = {
            web: 'Web Application',
            android: 'Android App',
            ios: 'iOS App'
        };

        const designNames = {
            template: 'Templated / Standard UI',
            custom: 'Custom UI/UX Premium (+25%)',
            advanced: 'Advanced UI & Animation (+45%)'
        };

        const featureNames = {
            auth: 'Sistem Login & Profil',
            payment: 'Payment Gateway',
            chat: 'Fitur Live Chat',
            admin: 'CMS / Admin Panel',
            notif: 'Push Notification',
            api: 'Integrasi API External'
        };

        // 1. Calculate Platform Base Price
        let platformBase = 0;
        selectedPlatforms.forEach(p => {
            platformBase += platformBasePrices[p];
        });

        // Multiplatform discount (15% off if customer chooses more than 1 platform)
        let discount = 0;
        if (selectedPlatforms.length > 1) {
            discount = platformBase * 0.15;
            platformBase = platformBase - discount;
        }

        // 2. Apply Design Modifier
        const designMod = designModifiers[softDesignSelect.value];
        let subtotal = platformBase * designMod;

        // 3. Add Checked Features
        let featuresTotal = 0;
        let selectedFeaturesTexts = [];
        softFeatureCards.forEach(card => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                const featureKey = checkbox.value;
                featuresTotal += featurePrices[featureKey];
                selectedFeaturesTexts.push(featureNames[featureKey]);
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        const totalSoftPrice = Math.round(subtotal + featuresTotal);

        // Format to IDR
        const formattedPrice = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(totalSoftPrice);

        // Update UI Summary
        const platformTexts = selectedPlatforms.map(p => platformNames[p]).join(', ');
        sumSoftPlatform.textContent = platformTexts || 'Belum memilih platform';
        sumSoftDesign.textContent = designNames[softDesignSelect.value].split(' (+')[0];
        
        sumSoftFeatures.textContent = selectedFeaturesTexts.length > 0 
            ? selectedFeaturesTexts.join(', ') 
            : 'Tanpa Fitur Tambahan';
        
        sumSoftPrice.textContent = formattedPrice;

        // Update WhatsApp Link
        const message = `Halo Sinergi Solusi Digital, saya tertarik dengan jasa pembuatan software/aplikasi dan ingin berkonsultasi mengenai rencana proyek berikut:\n\n` +
                        `- Platform: ${platformTexts || '-'}\n` +
                        `- Desain: ${designNames[softDesignSelect.value].split(' (+')[0]}\n` +
                        `- Fitur Tambahan: ${selectedFeaturesTexts.join(', ') || 'Tidak ada'}\n` +
                        `- Estimasi Investasi: ${formattedPrice}\n\n` +
                        `Apakah bisa dijadwalkan sesi meeting untuk mendiskusikan requirement proyek kami? Terima kasih.`;
        
        const encodedMessage = encodeURIComponent(message);
        softWhatsAppLink.href = `https://wa.me/6281387200061?text=${encodedMessage}`;
    }

    // Software Platform Card Event listeners (multi-select)
    softPlatforms.forEach(opt => {
        opt.addEventListener('click', () => {
            const platform = opt.dataset.platform;
            
            if (selectedPlatforms.includes(platform)) {
                // don't allow empty platform selection
                if (selectedPlatforms.length > 1) {
                    selectedPlatforms = selectedPlatforms.filter(x => x !== platform);
                    opt.classList.remove('active');
                }
            } else {
                selectedPlatforms.push(platform);
                opt.classList.add('active');
            }

            calculateSoftware();
        });
    });

    // Checkbox cards click forwarding
    softFeatureCards.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        card.addEventListener('click', (e) => {
            // Prevent double-firing if click was directly on the checkbox
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            calculateSoftware();
        });
    });

    // Design Select event
    if (softDesignSelect) {
        softDesignSelect.addEventListener('change', calculateSoftware);
    }


    // ==========================================
    // 6. CALCULATOR B: CCTV PACKAGE CALCULATOR
    // ==========================================
    const brandOptions = document.querySelectorAll('.brand-select-grid .calc-card-option');
    const cameraOptions = document.querySelectorAll('.camera-select-grid .calc-card-option');
    const storageSelect = document.getElementById('calc-storage');
    const resolutionSelect = document.getElementById('calc-res');

    // UI Outputs for CCTV
    const summaryBrand = document.getElementById('summary-brand');
    const summaryQty = document.getElementById('summary-qty');
    const summaryRes = document.getElementById('summary-res');
    const summaryStorage = document.getElementById('summary-storage');
    const summaryPrice = document.getElementById('summary-price');
    const summaryLink = document.getElementById('summary-whatsapp-link');

    let selectedBrand = 'hikvision';
    let selectedQty = 4;
    
    // Pricing matrices (base prices in IDR)
    const basePrices = {
        hikvision: { 2: 3000000, 4: 4500000, 8: 8000000, 16: 14800000 },
        dahua:     { 2: 2800000, 4: 4200000, 8: 7500000, 16: 13800000 },
        hilook:    { 2: 2500000, 4: 3800000, 8: 6800000, 16: 12500000 },
        ezviz:     { 2: 2200000, 4: 3500000, 8: 6200000, 16: 11500000 }
    };

    const storageAddons = {
        '500gb': 0,
        '1tb': 350000,
        '2tb': 750000,
        '4tb': 1500000
    };

    const resModifiers = {
        '2mp': 1.0,
        '4mp': 1.15,
        '8mp_4k': 1.35
    };

    function calculateCctv() {
        if (!summaryPrice) return;

        const brandNameMap = {
            hikvision: 'Hikvision Professional',
            dahua: 'Dahua Security',
            hilook: 'HiLook by Hikvision',
            ezviz: 'Ezviz Smart Wi-Fi'
        };

        const resTextMap = {
            '2mp': 'Full HD 2 Megapixel',
            '4mp': 'Super HD 4 Megapixel (+15%)',
            '8mp_4k': 'Ultra HD 4K 8 Megapixel (+35%)'
        };

        const base = basePrices[selectedBrand][selectedQty];
        const resMod = resModifiers[resolutionSelect.value];
        const storageAdd = storageAddons[storageSelect.value];

        // Calculation: (BasePrice * ResolutionModifier) + StorageAddon
        const totalPrice = Math.round(base * resMod) + storageAdd;

        // Format to Indonesian Rupiah
        const formattedPrice = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(totalPrice);

        // Update Summary UI
        summaryBrand.textContent = brandNameMap[selectedBrand];
        summaryQty.textContent = `${selectedQty} Kamera CCTV`;
        summaryRes.textContent = resTextMap[resolutionSelect.value].split(' (')[0];
        summaryStorage.textContent = storageSelect.options[storageSelect.selectedIndex].text.split(' (+')[0];
        summaryPrice.textContent = formattedPrice;

        // Update WhatsApp Order Link
        const message = `Halo Sinergi Solusi Digital, saya tertarik dengan penawaran di website dan ingin berkonsultasi mengenai paket CCTV berikut:\n\n` +
                        `- Merek: ${brandNameMap[selectedBrand]}\n` +
                        `- Jumlah: ${selectedQty} Kamera\n` +
                        `- Resolusi: ${resTextMap[resolutionSelect.value].split(' (')[0]}\n` +
                        `- Storage: ${storageSelect.options[storageSelect.selectedIndex].text.split(' (+')[0]}\n` +
                        `- Estimasi Paket: ${formattedPrice}\n\n` +
                        `Apakah bisa dibantu jadwalkan untuk survei lokasi pemasangan? Terima kasih.`;
        
        const encodedMessage = encodeURIComponent(message);
        summaryLink.href = `https://wa.me/6281387200061?text=${encodedMessage}`;
    }

    // Brand Select Event Listeners
    brandOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            brandOptions.forEach(x => x.classList.remove('active'));
            opt.classList.add('active');
            selectedBrand = opt.dataset.brand;
            calculateCctv();
        });
    });

    // Camera Qty Select Event Listeners
    cameraOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            cameraOptions.forEach(x => x.classList.remove('active'));
            opt.classList.add('active');
            selectedQty = parseInt(opt.dataset.qty);
            calculateCctv();
        });
    });

    // Dropdowns Event Listeners
    if (storageSelect) storageSelect.addEventListener('change', calculateCctv);
    if (resolutionSelect) resolutionSelect.addEventListener('change', calculateCctv);


    // Run calculators initially
    calculateSoftware();
    calculateCctv();


    // ==========================================
    // 7. FILTERABLE PORTFOLIO GALLERY
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state
            filterButtons.forEach(x => x.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.dataset.filter;

            galleryItems.forEach(item => {
                const category = item.dataset.category;
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    // ==========================================
    // 8. TESTIMONIAL SLIDER
    // ==========================================
    const testiSlider = document.querySelector('.testimonial-slider');
    const testiCards = document.querySelectorAll('.testimonial-card');
    const testiDotsContainer = document.querySelector('.testi-dots');
    let activeTestiIndex = 0;
    let testiInterval;

    if (testiCards.length > 0) {
        // Create dots
        testiCards.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = `testi-dot ${idx === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => showTestimonial(idx));
            testiDotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.testi-dot');

        function showTestimonial(index) {
            dots[activeTestiIndex].classList.remove('active');
            activeTestiIndex = index;
            dots[activeTestiIndex].classList.add('active');
            testiSlider.style.transform = `translateX(-${activeTestiIndex * 100}%)`;
            resetTestiInterval();
        }

        function nextTestimonial() {
            showTestimonial((activeTestiIndex + 1) % testiCards.length);
        }

        function startTestiInterval() {
            testiInterval = setInterval(nextTestimonial, 5000);
        }

        function resetTestiInterval() {
            clearInterval(testiInterval);
            startTestiInterval();
        }

        startTestiInterval();
    }


    // ==========================================
    // 9. ACCORDION FAQ
    // ==========================================
    const faqHeaders = document.querySelectorAll('.faq-header');

    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(x => x.classList.remove('active'));
            
            // Toggle active item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });


    // ==========================================
    // 10. CONTACT FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const email = document.getElementById('form-email').value;
            const message = document.getElementById('form-message').value;

            // Simple validation
            if (!name || !phone || !message) {
                alert('Silakan lengkapi kolom nama, nomor telepon, dan pesan.');
                return;
            }

            // Route details directly to WhatsApp for prompt follow up!
            const waMessage = `Halo Sinergi Solusi Digital, saya mengirimkan formulir kontak website:\n\n` +
                              `- Nama: ${name}\n` +
                              `- WhatsApp: ${phone}\n` +
                              `- Email: ${email || '-'}\n` +
                              `- Kebutuhan: ${message}`;
            
            const encodedWaMessage = encodeURIComponent(waMessage);
            const waUrl = `https://wa.me/6281387200061?text=${encodedWaMessage}`;

            // Open in new tab
            window.open(waUrl, '_blank');
            contactForm.reset();
        });
    }


    // ==========================================
    // 11. READ MORE ARTICLE MODALS
    // ==========================================
    const modal = document.querySelector('.modal');
    const modalClose = document.querySelector('.modal-close');
    const modalImg = document.querySelector('.modal-header-img');
    const modalMeta = document.querySelector('.modal-meta');
    const modalTitle = document.querySelector('.modal-title');
    const modalText = document.querySelector('.modal-content-text');

    const articleData = {
        1: {
            title: "Tren Teknologi Cloud Native di Tahun 2026",
            meta: "Sinergi Solusi Digital | 25 Juni 2026 | Software Development",
            img: "assets/hero_office.png",
            text: "Pengembangan software saat ini dituntut untuk memiliki keandalan tinggi, arsitektur microservices, dan kemampuan deployment instan tanpa mengganggu layanan pengguna. Tren cloud-native software development telah menguasai industri aplikasi di Indonesia.\n\nDalam membangun solusi custom bagi ruko, UMKM, hingga enterprise, Sinergi Solusi Digital memprioritaskan prinsip cloud native:\n\n1. Containerization (Docker & Kubernetes) untuk fleksibilitas deploy di server cloud apa pun.\n2. Serverless Architecture untuk menekan biaya tagihan cloud server bulanan hingga 60% dengan performa tetap andal saat traffic tinggi.\n3. CI/CD (Continuous Integration / Continuous Deployment) yang menjamin updates fitur aplikasi Anda selesai tanpa downtime.\n\nDiskusikan kebutuhan custom software Anda bersama tim analis kami dan nikmati arsitektur cloud paling efisien."
        },
        2: {
            title: "3 Merk CCTV Terbaik di Indonesia Saat Ini",
            meta: "Sentinel Security | 14 Juni 2026 | Review Merk",
            img: "assets/hero_home.png",
            text: "Keamanan properti Anda adalah hal yang tidak boleh ditawar. Saat hendak memasang CCTV, pemilihan merk menjadi salah satu faktor penentu ketahanan sistem, kejernihan gambar, serta kemudahan akses pemantauan online jarak jauh. Di Indonesia, pasar CCTV didominasi oleh tiga raksasa utama:\n\nHikvision\nSebagai pemimpin pasar global, Hikvision menawarkan ekosistem keamanan super lengkap. Mulai dari kamera analog HD-TVI hingga IP Camera tingkat lanjut. Keunggulan utama Hikvision terletak pada ketahanan perangkat keras yang luar biasa, teknologi ColorVu (merekam warna penuh dalam gelap gulita), dan garansi purnajual yang solid.\n\nDahua\nMenjadi kompetitor terdekat Hikvision, Dahua sangat inovatif dalam teknologi analitik video pintar. Lini produknya sangat tangguh dalam pemantauan outdoor skala besar seperti pabrik dan pergunungan. Dahua menawarkan kualitas gambar jernih dengan harga yang sangat kompetitif.\n\nHiLook\nBagi Anda yang membutuhkan sistem keamanan handal untuk rumah atau ruko dengan anggaran terbatas, HiLook adalah pilihan paling bijak. Didukung penuh oleh infrastruktur dan software Hikvision, HiLook menawarkan kemudahan instalasi, aplikasi mobile yang responsif (HiLookVision), dan sensor gambar tajam di kelasnya.\n\nSinergi Solusi Digital menyediakan paket pemasangan lengkap untuk ketiga merk di atas dengan garansi resmi dan gratis survei lokasi."
        },
        3: {
            title: "Pentingnya Integrasi Custom Software & Keamanan Fisik",
            meta: "Sinergi Solusi Digital | 10 Juni 2026 | IT Consulting",
            img: "assets/logo.png",
            text: "Banyak pemilik bisnis memisahkan tim IT developer software dengan tim pengadaan CCTV fisik. Padahal, keajaiban sesungguhnya terjadi ketika sistem software digabungkan dengan CCTV pintar Anda!\n\nBayangkan fungsionalitas berikut:\n1. Kamera CCTV di pabrik/toko Anda mendeteksi wajah karyawan, mencocokkannya dengan database cloud software, dan mencatat absensi kerja secara otomatis tanpa perlu sensor sidik jari manual.\n2. Saat gerbang palang parkir mendeteksi plat nomor kendaraan (License Plate Recognition), data langsung dicocokkan dengan sistem inventori ruko/kantor dan mencatat waktu masuk mobil.\n3. Alarm pembobolan pintu mengirimkan cuplikan video CCTV langsung ke bot WhatsApp atau aplikasi mobile internal perusahaan.\n\nSinergi Solusi Digital memiliki keunggulan unik: kami tidak hanya jago membuat software berkelas dunia, tapi juga ahli dalam instalasi perangkat keamanan fisik. Hubungi kami untuk membangun sistem terpadu yang cerdas."
        }
    };

    const readMoreBtns = document.querySelectorAll('.news-link');

    if (readMoreBtns.length > 0 && modal) {
        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.dataset.id;
                const data = articleData[id];

                if (data) {
                    modalImg.src = data.img;
                    modalMeta.textContent = data.meta;
                    modalTitle.textContent = data.title;
                    modalText.innerHTML = data.text.replace(/\n/g, '<br>');
                    modal.classList.add('active');
                }
            });
        });

        // Close Modal
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }
});
