/**
 * Cloudflare Worker - Contact Form Proxy
 * 
 * Recibe datos del formulario y notifica a Telegram
 * Sin exponer el token del bot en el cliente
 * 
 * Variables de entorno requeridas:
 * - TELEGRAM_BOT_TOKEN
 * - TELEGRAM_CHAT_ID
 * 
 * @security Valida Origin header para prevenir abuso desde otros dominios
 */

export default {
  async fetch(request, env) {
    const allowedOrigins = getAllowedOrigins(env);
    // CORS headers para permitir peticiones desde el sitio
    const baseCorsHeaders = {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      const origin = request.headers.get('Origin');
      if (!isAllowedOrigin(origin, allowedOrigins)) {
        return new Response('Forbidden', { status: 403, headers: baseCorsHeaders });
      }
      return new Response(null, {
        status: 204,
        headers: { ...baseCorsHeaders, 'Access-Control-Allow-Origin': origin }
      });
    }

    // Solo permitir POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: baseCorsHeaders
      });
    }

    // Validar Origin para prevenir abuso desde otros dominios
    const origin = request.headers.get('Origin');
    if (!isAllowedOrigin(origin, allowedOrigins)) {
      console.error('Blocked request from origin:', origin || 'none');
      return new Response('Forbidden', {
        status: 403,
        headers: baseCorsHeaders
      });
    }
    const corsHeaders = { ...baseCorsHeaders, 'Access-Control-Allow-Origin': origin };

    try {
      // Parsear datos del formulario
      const data = await request.json();
      const { name, email, subject, message } = data;

      // Validar campos requeridos
      if (!name || !email || !message) {
        return new Response(JSON.stringify({ 
          error: 'Missing required fields' 
        }), { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Sanitizar input básico (prevenir XSS en Telegram)
      const sanitizedName = escapeMarkdown(name);
      const sanitizedEmail = escapeMarkdown(email);
      const sanitizedSubject = escapeMarkdown(subject || 'Sin asunto');
      const sanitizedMessage = escapeMarkdown(message);

      // Formatear mensaje para Telegram (sin emojis)
      const telegramMessage = `NUEVO MENSAJE DE CONTACTO

Nombre: ${sanitizedName}
Email: ${sanitizedEmail}
Asunto: ${sanitizedSubject}

Mensaje:
${sanitizedMessage}`;

      // Enviar a Telegram
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'Markdown'
          })
        }
      );

      const telegramResult = await telegramResponse.json();

      if (!telegramResult.ok) {
        console.error('Telegram error:', telegramResult);
        return new Response(JSON.stringify({ 
          error: 'Failed to send to Telegram' 
        }), { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Éxito
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Message sent successfully'
      }), { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error' 
      }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * Escapa caracteres especiales de Markdown
 * @param {string} text - Texto a escapar
 * @returns {string} - Texto escapado
 */
function escapeMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/~/g, '\\~')
    .replace(/>/g, '\\>')
    .replace(/#/g, '\\#')
    .replace(/\+/g, '\\+')
    .replace(/-/g, '\\-')
    .replace(/=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/!/g, '\\!')
    .replace(/`/g, '\\`');
}

function getAllowedOrigins(env) {
  const raw = env.ALLOWED_ORIGINS || '';
  const fromEnv = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (fromEnv.length > 0) {
    return fromEnv;
  }

  return [
    'https://connordarghaoui.github.io',
    'https://luisboniche.com',
    'https://www.luisboniche.com'
  ];
}

function isAllowedOrigin(origin, allowedOrigins) {
  if (!origin) return false;
  return allowedOrigins.includes(origin);
}
