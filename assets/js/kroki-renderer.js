/**
 * @fileoverview Renderiza diagramas de arquitectura desde bloques de código
 *               a imágenes SVG usando el servicio Kroki.io
 * @module KrokiDiagramRenderer
 * @version 1.0.0
 * @requires pako - Biblioteca de compresión deflate (CDN)
 * @see https://kroki.io
 * @see https://github.com/nodeca/pako
 *
 * @example
 * // En markdown:
 * ```plantuml
 * @startuml
 * Alice -> Bob: Hello
 * @enduml
 * ```
 * // El script convierte el bloque en una imagen SVG
 */

(function() {
    'use strict';

    /**
     * @typedef {Object} KrokiConfig
     * @property {string} baseUrl - URL base del servicio Kroki
     * @property {number} compressionLevel - Nivel de compresión deflate (1-9)
     * @property {string[]} supportedTypes - Tipos de diagramas soportados
     * @property {string} imageClass - Clases CSS para imágenes normales
     * @property {string} coverClass - Clases CSS para imagen tipo portada
     */

    /**
     * Configuración del renderer
     * @type {KrokiConfig}
     */
    var CONFIG = {
        baseUrl: 'https://kroki.io',
        compressionLevel: 3,
        supportedTypes: [
            'plantuml',
            'mermaid',
            'excalidraw',
            'graphviz',
            'c4plantuml',
            'structurizr',
            'dbml',
            'erd',
            'nomnoml',
            'bpmn'
        ],
        imageClass: 'w-full max-w-4xl mx-auto rounded-lg shadow-sm my-12 object-contain bg-white px-8 py-6 mix-blend-multiply',
        coverClass: 'w-full max-w-4xl mx-auto rounded-lg shadow-lg my-8 object-cover bg-white mix-blend-multiply block'
    };

    /**
     * Codifica texto de diagrama a formato Kroki-compatible (base64 URL-safe)
     *
     * @param {string} text - Código fuente del diagrama
     * @returns {string} - String base64 encodeado y URL-safe
     *
     * @description
     * El proceso es:
     * 1. Codificar texto a UTF-8 bytes
     * 2. Comprimir con deflate (nivel configurable)
     * 3. Convertir a binary string
     * 4. Codificar a base64
     * 5. Hacer URL-safe (+ → -, / → _, quitar =)
     *
     * @see https://kroki.io/api.html
     */
    function encodeDiagram(text) {
        var encoder = new TextEncoder('utf-8');
        var data = encoder.encode(text);
        var compressed = pako.deflate(data, { level: CONFIG.compressionLevel });
        var binary = '';
        var i;

        for (i = 0; i < compressed.length; i++) {
            binary += String.fromCharCode(compressed[i]);
        }

        return window.btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    /**
     * Extrae el tipo de diagrama desde las clases del elemento code
     *
     * @param {HTMLCodeElement} codeBlock - Elemento <code> a inspeccionar
     * @returns {string|null} - Tipo de diagrama soportado o null si no es diagrama
     *
     * @description
     * Busca clases con prefijo 'language-' y verifica si el tipo
     * está en la lista de soportados.
     *
     * @example
     * // <code class="language-plantuml"> → 'plantuml'
     * // <code class="language-mermaid highlight"> → 'mermaid'
     * // <code class="language-javascript"> → null
     */
    function getDiagramType(codeBlock) {
        var classes = codeBlock.classList;
        var i, lang;

        for (i = 0; i < classes.length; i++) {
            if (classes[i].indexOf('language-') === 0) {
                lang = classes[i].replace('language-', '');
                if (CONFIG.supportedTypes.indexOf(lang) !== -1) {
                    return lang;
                }
            }
        }

        return null;
    }

    /**
     * Encuentra el elemento padre que debe ser reemplazado por la imagen
     *
     * @param {HTMLCodeElement} codeBlock - Elemento <code> procesado
     * @returns {HTMLElement|null} - Elemento a reemplazar o null si no se encuentra
     *
     * @description
     * La estructura típica de Jekyll/Kramdown es:
     * div.highlighter-rouge > div.highlight > pre > code
     *
     * Esta función navega hacia arriba para encontrar el contenedor
     * más externo que debe ser reemplazado.
     */
    function getParentToReplace(codeBlock) {
        var parent = codeBlock.parentElement;

        if (!parent || parent.tagName !== 'PRE') {
            return parent;
        }

        if (parent.parentElement && parent.parentElement.classList.contains('highlight')) {
            parent = parent.parentElement;

            if (parent.parentElement && parent.parentElement.classList.contains('highlighter-rouge')) {
                parent = parent.parentElement;
            }
        }

        return parent;
    }

    /**
     * Crea elemento <img> para el diagrama renderizado
     *
     * @param {string} type - Tipo de diagrama (plantuml, mermaid, etc.)
     * @param {string} base64 - Diagrama codificado en base64 URL-safe
     * @param {boolean} isCover - Si es true, usa clases de portada
     * @returns {HTMLImageElement} - Elemento de imagen configurado
     *
     * @description
     * La imagen apunta al endpoint SVG de Kroki.io con el diagrama
     * codificado en la URL. Incluye loading="lazy" para performance.
     *
     * Si isCover=true, la imagen aparece como portada centrada.
     * Incluye manejo de errores: si Kroki falla, muestra fallback.
     */
    function createDiagramImage(type, base64, isCover) {
        var img = document.createElement('img');
        img.src = CONFIG.baseUrl + '/' + type + '/svg/' + base64;
        img.className = isCover ? CONFIG.coverClass : CONFIG.imageClass;
        img.alt = type + ' architecture diagram';
        img.loading = 'lazy';
        
        // Manejo de errores - fallback si Kroki falla
        img.onerror = function() {
            var fallback = document.createElement('div');
            fallback.className = 'bg-surface-container-low p-6 text-center rounded-lg border border-outline-variant/20';
            fallback.innerHTML = '<p class="text-on-surface-variant text-sm font-body">Diagrama no disponible</p>' +
                '<p class="text-outline text-xs font-mono mt-2">' + type + ' diagram</p>';
            
            if (img.parentNode) {
                img.parentNode.replaceChild(fallback, img);
            }
        };
        
        return img;
    }

    /**
     * Procesa un bloque de código y lo reemplaza con su diagrama renderizado
     *
     * @param {HTMLCodeElement} codeBlock - Elemento <code> a procesar
     * @param {boolean} isCover - Si es true, usa estilo de portada
     * @returns {void}
     *
     * @description
     * Si el bloque contiene un diagrama soportado:
     * 1. Extrae el tipo de diagrama
     * 2. Obtiene el texto y lo codifica
     * 3. Crea la imagen (como portada o normal)
     * 4. Reemplaza el bloque de código
     *
     * Si no es un diagrama, no hace nada.
     */
    function processDiagram(codeBlock, isCover) {
        var type = getDiagramType(codeBlock);
        var text, base64, img, parent;

        if (!type) {
            return;
        }

        text = codeBlock.textContent.trim();
        base64 = encodeDiagram(text);
        img = createDiagramImage(type, base64, isCover);
        parent = getParentToReplace(codeBlock);

        if (parent) {
            parent.replaceWith(img);
        }
    }

    /**
     * Inicializa el renderizado de diagramas en la página
     *
     * @returns {void}
     *
     * @description
     * Escanea todos los bloques <pre><code> y procesa
     * solo los que contienen diagramas soportados.
     *
     * El PRIMER diagrama de cada artículo <article> se muestra
     * como portada centrada. Los siguientes como imágenes normales.
     *
     * Se ejecuta inmediatamente porque el HTML ya está
     * completamente parseado (script al final del body).
     */
    function init() {
        // Encontrar todos los artículos con contenido
        var articles = document.querySelectorAll('article');
        var i, article, codeBlocks, j;

        for (i = 0; i < articles.length; i++) {
            article = articles[i];
            codeBlocks = article.querySelectorAll('pre code');
            
            for (j = 0; j < codeBlocks.length; j++) {
                // El primer diagrama de cada artículo es portada
                var isCover = (j === 0);
                processDiagram(codeBlocks[j], isCover);
            }
        }

        // También procesar diagramas fuera de artículos (fallback)
        var standaloneCodeBlocks = document.querySelectorAll('main > *:not(article) pre code');
        for (i = 0; i < standaloneCodeBlocks.length; i++) {
            processDiagram(standaloneCodeBlocks[i], true);
        }
    }

    // Ejecutar inmediatamente - el HTML ya está listo
    init();
})();
