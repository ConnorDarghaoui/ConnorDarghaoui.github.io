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
    // Validar Origin para prevenir abuso desde otros dominios
    const allowedOrigin = 'https://connordarghaoui.github.io';
    const origin = request.headers.get('Origin');
    
    // Permitir requests sin Origin (curl, testing) o del dominio permitido
    if (origin && origin !== allowedOrigin) {
      console.error('Blocked request from origin:', origin);
      return new Response('Forbidden', { 
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Solo permitir POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // CORS headers para permitir peticiones desde el sitio
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

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
    .replace(/`/g, '\\`');
}
