/**
 * @fileoverview Controla el menú móvil de navegación
 * @module MobileMenu
 * @version 1.0.0
 */

(function() {
    'use strict';

    /**
     * Inicializa el toggle del menú móvil
     * @returns {void}
     *
     * @description
     * Busca los elementos del menú móvil y agrega listeners
     * para mostrar/ocultar el menú al hacer click en el botón.
     *
     * Dependencias del DOM:
     * - #mobile-menu-btn: Botón toggle
     * - #mobile-menu: Panel del menú
     * - #icon-menu: Ícono de menú (hamburguesa)
     * - #icon-close: Ícono de cierre (X)
     */
    function init() {
        var btn = document.getElementById('mobile-menu-btn');
        var menu = document.getElementById('mobile-menu');
        var iconMenu = document.getElementById('icon-menu');
        var iconClose = document.getElementById('icon-close');

        if (!btn || !menu) {
            return;
        }

        btn.addEventListener('click', function() {
            var isOpen = !menu.classList.contains('hidden');
            menu.classList.toggle('hidden');
            btn.setAttribute('aria-expanded', String(!isOpen));
            
            if (iconMenu && iconClose) {
                iconMenu.classList.toggle('hidden');
                iconClose.classList.toggle('hidden');
            }
        });
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
