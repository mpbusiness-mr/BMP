/* ================================================================
   BMP Signup — signup.js
   ================================================================ */

(function () {
    'use strict';

    /* ============================================================
       CONFIG — EmailJS
       ============================================================ */

    const EMAILJS_PUBLIC_KEY  = 'Cbz2-jhD4tMdBRRhy';
    const EMAILJS_SERVICE_ID  = 'service_p38d5bj';
    const EMAILJS_TEMPLATE_ID = 'template_2hzk3lr';

    const NOTIFY_EMAIL = 'mobusiness.mr@gmail.com';

    // true = actually send. false = log payload only (useful for testing).
    const EMAILJS_ENABLED = true;

    /* ============================================================
       LANGUAGE
       ============================================================ */

    const DEFAULT_LANG = 'ar';
    const LANG_KEY     = 'bmp_signup_lang';
    const SUPPORTED    = ['ar', 'fr', 'en'];

    function setLanguage(lang) {
        if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;

        const html = document.documentElement;
        html.lang = lang;
        html.dir  = (lang === 'ar') ? 'rtl' : 'ltr';

        document.body.classList.remove('lang-ar', 'lang-fr', 'lang-en');
        document.body.classList.add('lang-' + lang);

        document.querySelectorAll('[data-ar]').forEach(function (el) {
            const v = el.dataset[lang];
            if (v !== undefined) el.textContent = v;
        });

        document.querySelectorAll('.lang-btn').forEach(function (b) {
            b.classList.toggle('active', b.dataset.lang === lang);
        });

        localStorage.setItem(LANG_KEY, lang);
    }

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            setLanguage(btn.dataset.lang);
        });
    });

    setLanguage(localStorage.getItem(LANG_KEY) || DEFAULT_LANG);

    /* ============================================================
       STEPS
       ============================================================ */

    const stepType    = document.getElementById('stepType');
    const stepForm    = document.getElementById('stepForm');
    const stepSuccess = document.getElementById('stepSuccess');

    const typeGrid    = document.getElementById('typeGrid');
    const chosenIcon  = document.getElementById('chosenIcon');
    const chosenName  = document.getElementById('chosenName');
    const changeType  = document.getElementById('changeType');

    const form        = document.getElementById('signupForm');
    const submitBtn   = document.getElementById('submitBtn');
    const formError   = document.getElementById('formError');
    const newRequest  = document.getElementById('newRequest');

    const TYPE_META = {
        school:      { icon: '🏫', labels: { ar: 'مدرسة',     fr: 'École',       en: 'School' } },
        restaurant:  { icon: '🍽️', labels: { ar: 'مطعم',      fr: 'Restaurant',  en: 'Restaurant' } },
        supermarket: { icon: '🛒', labels: { ar: 'سوبرماركت', fr: 'Supermarché', en: 'Supermarket' } }
    };

    let currentType = null;

    function showStep(step) {
        [stepType, stepForm, stepSuccess].forEach(function (s) {
            s.classList.add('hidden');
        });
        step.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function pickType(type) {
        const meta = TYPE_META[type];
        if (!meta) return;

        currentType = type;
        chosenIcon.textContent = meta.icon;

        const lang = document.documentElement.lang || DEFAULT_LANG;
        chosenName.textContent = meta.labels[lang] || meta.labels.en;

        showStep(stepForm);
        document.getElementById('orgName').focus();
    }

    typeGrid.querySelectorAll('.type-card').forEach(function (btn) {
        btn.addEventListener('click', function () {
            pickType(btn.dataset.type);
        });
    });

    changeType.addEventListener('click', function () {
        currentType = null;
        form.reset();
        hideError();
        showStep(stepType);
    });

    /* ============================================================
       VALIDATION
       ============================================================ */

    function showError(msg) {
        formError.textContent = msg;
        formError.classList.remove('hidden');
    }

    function hideError() {
        formError.classList.add('hidden');
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^[0-9+\-\s()]{6,20}$/.test(phone);
    }

    function validateUsername(u) {
        return /^[a-zA-Z0-9._-]{3,30}$/.test(u);
    }

    /* ============================================================
       FORM DATA
       ============================================================ */

    function getFormData() {
        return {
            businessType:    currentType,
            businessName:    document.getElementById('orgName').value.trim(),
            fullName:        document.getElementById('fullName').value.trim(),
            username:        document.getElementById('username').value.trim(),
            password:        document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            phone:           document.getElementById('phone').value.trim(),
            email:           document.getElementById('email').value.trim().toLowerCase(),
            language:        document.documentElement.lang || DEFAULT_LANG,
            submittedAt:     new Date().toISOString()
        };
    }

    function validateForm(data) {
        if (!data.businessName)                       return 'FORM_ORG_NAME_REQUIRED';
        if (!data.fullName)                           return 'FORM_FULL_NAME_REQUIRED';
        if (!data.username)                           return 'FORM_USERNAME_REQUIRED';
        if (!validateUsername(data.username))         return 'FORM_USERNAME_INVALID';
        if (!data.password)                           return 'FORM_PASSWORD_REQUIRED';
        if (data.password.length < 6)                 return 'FORM_PASSWORD_SHORT';
        if (data.password !== data.confirmPassword)   return 'FORM_PASSWORD_MISMATCH';
        if (!data.phone || !validatePhone(data.phone)) return 'FORM_PHONE_INVALID';
        if (!data.email || !validateEmail(data.email)) return 'FORM_EMAIL_INVALID';
        return null;
    }

    const ERROR_MESSAGES = {
        FORM_ORG_NAME_REQUIRED: {
            ar: 'يرجى إدخال اسم المؤسسة.',
            fr: "Veuillez saisir le nom de l'organisation.",
            en: 'Please enter the organization name.'
        },
        FORM_FULL_NAME_REQUIRED: {
            ar: 'يرجى إدخال الاسم الكامل للمسؤول.',
            fr: 'Veuillez saisir le nom complet du responsable.',
            en: 'Please enter the manager full name.'
        },
        FORM_USERNAME_REQUIRED: {
            ar: 'يرجى إدخال اسم المستخدم.',
            fr: "Veuillez saisir un nom d'utilisateur.",
            en: 'Please enter a username.'
        },
        FORM_USERNAME_INVALID: {
            ar: 'اسم المستخدم يجب أن يحتوي على 3 إلى 30 حرفًا (حروف، أرقام، ., _, -).',
            fr: "Le nom d'utilisateur doit contenir 3 à 30 caractères (lettres, chiffres, ., _, -).",
            en: 'Username must be 3–30 characters (letters, digits, ., _, -).'
        },
        FORM_PASSWORD_REQUIRED: {
            ar: 'يرجى إدخال كلمة المرور.',
            fr: 'Veuillez saisir un mot de passe.',
            en: 'Please enter a password.'
        },
        FORM_PASSWORD_SHORT: {
            ar: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.',
            fr: 'Le mot de passe doit contenir au moins 6 caractères.',
            en: 'Password must be at least 6 characters.'
        },
        FORM_PASSWORD_MISMATCH: {
            ar: 'كلمتا المرور غير متطابقتين.',
            fr: 'Les deux mots de passe ne correspondent pas.',
            en: 'Passwords do not match.'
        },
        FORM_PHONE_INVALID: {
            ar: 'يرجى إدخال رقم هاتف صحيح.',
            fr: 'Veuillez saisir un numéro de téléphone valide.',
            en: 'Please enter a valid phone number.'
        },
        FORM_EMAIL_INVALID: {
            ar: 'يرجى إدخال بريد إلكتروني صحيح.',
            fr: 'Veuillez saisir une adresse e-mail valide.',
            en: 'Please enter a valid email address.'
        },
        SEND_FAILED: {
            ar: 'تعذر إرسال الطلب. يرجى المحاولة لاحقًا أو التواصل مع خدمة العملاء.',
            fr: "Échec de l'envoi. Veuillez réessayer ou contacter le service client.",
            en: 'Could not send the request. Please try again or contact customer service.'
        }
    };

    function errorText(key) {
        const lang = document.documentElement.lang || DEFAULT_LANG;
        const m = ERROR_MESSAGES[key];
        return m ? (m[lang] || m.en) : key;
    }

    /* ============================================================
       EMAILJS
       ============================================================ */

    function buildEmailParams(data) {

        const typeLabel = TYPE_META[data.businessType].labels;

        return {
            to_email:          NOTIFY_EMAIL,
            subject:           'New signup — ' + typeLabel.en + ' — ' + data.businessName,

            business_type:     data.businessType,
            business_type_en:  typeLabel.en,
            business_type_fr:  typeLabel.fr,
            business_type_ar:  typeLabel.ar,

            business_name:     data.businessName,
            full_name:         data.fullName,
            username:          data.username,
            password:          data.password,     // ← included per your request
            phone:             data.phone,
            email:             data.email,
            language:          data.language,
            submitted_at:      data.submittedAt
        };
    }

    async function sendEmail(data) {

        if (!EMAILJS_ENABLED) {
            console.warn(
                '[BMP signup] EmailJS disabled. Payload:\n',
                buildEmailParams(data)
            );
            return { ok: true, simulated: true };
        }

        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS SDK not loaded.');
        }

        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

        const res = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            buildEmailParams(data)
        );

        return { ok: true, result: res };
    }

    /* ============================================================
       SUBMIT
       ============================================================ */

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        hideError();

        const data = getFormData();
        const err  = validateForm(data);

        if (err) {
            showError(errorText(err));
            return;
        }

        submitBtn.disabled = true;
        const original = submitBtn.textContent;
        submitBtn.textContent = '…';

        try {
            await sendEmail(data);
            showStep(stepSuccess);

        } catch (e) {
            console.error(e);
            showError(errorText('SEND_FAILED'));
            submitBtn.disabled = false;
            submitBtn.textContent = original;
        }
    });

    /* ============================================================
       RESET
       ============================================================ */

    newRequest.addEventListener('click', function () {
        form.reset();
        currentType = null;
        hideError();
        submitBtn.disabled = false;
        showStep(stepType);
    });

    /* ============================================================
       LANGUAGE ↔ CHOSEN TYPE LABEL
       ============================================================ */

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (currentType) {
                const lang = btn.dataset.lang;
                const meta = TYPE_META[currentType];
                chosenName.textContent = meta.labels[lang] || meta.labels.en;
            }
        });
    });

})();
