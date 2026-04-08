/**
 * @fileoverview Maneja el envío del formulario de contacto
 *               hacia Cloudflare Worker que notifica a Telegram
 * @module ContactForm
 * @version 1.0.0
 *
 * @description
 * El formulario se envía a un Cloudflare Worker que actúa como proxy
 * para no exponer el token de Telegram en el cliente.
 *
 * Dependencias del DOM:
 * - #contact-form: Elemento form
 * - #form-status: Elemento para mensajes de estado
 * - data-worker-url: URL del Worker en el elemento form
 *
 * Efectos laterales:
 * - Registra un listener de submit en #contact-form
 * - Modifica texto, clases y estado disabled de elementos del formulario
 */

(function() {
    'use strict';

    /**
     * Mensajes de la UI por idioma
     * @typedef {Object} ContactMessages
     * @property {string} required
     * @property {string} success
     * @property {string} error
     * @property {string} emailDirect
     * @property {string} sending
     */

    /**
     * Mapa de mensajes por locale.
     * @type {{ en: ContactMessages, es: ContactMessages }}
     */
    var MESSAGES = {
        en: {
            required: 'Please fill in all required fields.',
            success: 'Message sent successfully! I\'ll get back to you soon.',
            error: 'Error: ',
            emailDirect: '. Please email me directly.',
            sending: 'Sending...'
        },
        es: {
            required: 'Por favor completá todos los campos requeridos.',
            success: '¡Mensaje enviado! Te responderé lo antes posible.',
            error: 'Error: ',
            emailDirect: '. Por favor escribime directamente.',
            sending: 'Enviando...'
        }
    };

    /**
     * Sanitiza input de usuario para prevenir XSS
     * @param {string} str - Input a sanitizar
     * @returns {string} - Input sanitizado
     *
     * @description
     * Crea un elemento temporal y usa textContent para escapar
     * cualquier HTML. Esto previene inyección de scripts.
     */
    function sanitizeInput(str) {
        if (!str) {
            return '';
        }
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Obtiene los mensajes según el idioma
     * @param {string} lang - Código de idioma ('en' o 'es')
     * @returns {Object} - Objeto de mensajes
     */
    function getMessages(lang) {
        return MESSAGES[lang] || MESSAGES.en;
    }

    /**
     * Maneja el envío del formulario
     * @param {Event} e - Evento de submit
     * @param {HTMLFormElement} form - Elemento form
     * @param {HTMLElement} statusEl - Elemento de estado
     * @param {HTMLButtonElement} submitBtn - Botón de submit
     * @param {string} lang - Idioma actual
     * @returns {void}
     * @throws {Error} Si la respuesta HTTP es inválida o el Worker devuelve error
     */
    function handleSubmit(e, form, statusEl, submitBtn, lang) {
        e.preventDefault();

        var name = sanitizeInput(form.name.value.trim());
        var email = sanitizeInput(form.email.value.trim());
        var subject = sanitizeInput(form.subject.value.trim()) || 'Contact Form Submission';
        var message = sanitizeInput(form.message.value.trim());

        var messages = getMessages(lang);

        // Validar campos requeridos
        if (!name || !email || !message) {
            statusEl.textContent = messages.required;
            statusEl.className = 'font-label text-[10px] tracking-widest text-error';
            return;
        }

        // Deshabilitar botón durante envío
        submitBtn.disabled = true;
        submitBtn.textContent = messages.sending;
        statusEl.textContent = '';

        // Obtener URL del Worker desde data-attribute
        var workerUrl = form.dataset.workerUrl;

        if (!workerUrl) {
            statusEl.textContent = messages.error + 'Worker URL not configured' + messages.emailDirect;
            statusEl.className = 'font-label text-[10px] tracking-widest text-error';
            submitBtn.disabled = false;
            submitBtn.textContent = lang === 'es' ? 'Enviar Mensaje' : 'Send Message';
            return;
        }

        // Enviar al Worker
        fetch(workerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, subject, message })
        })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                return response.text().then(function(body) {
                    var detail = body && body.trim() ? body.trim() : ('HTTP ' + response.status);
                    throw new Error(detail);
                });
            }
        })
        .then(function(data) {
            if (data.success) {
                statusEl.textContent = messages.success;
                statusEl.className = 'font-label text-[10px] tracking-widest text-tertiary';
                form.reset();
            } else {
                throw new Error(data.error || 'Failed to send');
            }
        })
        .catch(function(error) {
            statusEl.textContent = messages.error + error.message + messages.emailDirect;
            statusEl.className = 'font-label text-[10px] tracking-widest text-error';
        })
        .finally(function() {
            submitBtn.disabled = false;
            submitBtn.textContent = lang === 'es' ? 'Enviar Mensaje' : 'Send Message';
        });
    }

    /**
     * Inicializa el formulario de contacto
     * @returns {void}
     *
     * @description
     * Busca el formulario por ID y agrega el listener de submit.
     * Si no existe el formulario, no hace nada (página sin formulario).
     */
    function init() {
        var form = document.getElementById('contact-form');
        var statusEl = document.getElementById('form-status');
        var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

        if (!form || !statusEl || !submitBtn) {
            return;
        }

        // Obtener idioma desde Liquid (se inyecta en el HTML)
        var lang = form.dataset.lang || 'en';

        if (form.dataset.contactInitialized === 'true') {
            return;
        }
        form.dataset.contactInitialized = 'true';

        form.addEventListener('submit', function(e) {
            handleSubmit(e, form, statusEl, submitBtn, lang);
        });
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
