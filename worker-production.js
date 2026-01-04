/**
 * JOBSEED API WORKER
 * Ce code doit être collé dans ton Cloudflare Worker (jobseed-api)
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // --- 1. GESTION CORS (Sécurité Cross-Origin) ---
    // Indispensable car le frontend (Bunny) et le backend (Cloudflare) sont sur des domaines différents
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://www.jobseed.online', // Autorise ton site
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Répondre immédiatement aux requêtes "Preflight" (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Fonction helper pour répondre en JSON avec les headers CORS
    const jsonResponse = (data, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders // On ajoute toujours les headers CORS
        }
      });
    };

    try {
      // --- 2. ROUTAGE ---

      // Route: /search (Recherche d'emploi via Perplexity)
      if (path === '/search' && request.method === 'POST') {
        return await handleSearch(request, env, jsonResponse);
      }

      // Route: /analyze (Analyse d'offre via Perplexity)
      if (path === '/analyze' && request.method === 'POST') {
        return await handleAnalyze(request, env, jsonResponse);
      }

      // Route: /suggestions (Suggestions carrière via Perplexity)
      if (path === '/suggestions' && request.method === 'POST') {
        return await handleSuggestions(request, env, jsonResponse);
      }

      // Route: /create-checkout (Paiement Stripe)
      if (path === '/create-checkout' && request.method === 'POST') {
        return await handleCheckout(request, env, jsonResponse);
      }

      // Route: /health (Vérification santé)
      if (path === '/health') {
        return jsonResponse({ status: 'ok', worker: 'jobseed-api' });
      }

      return jsonResponse({ error: 'Route not found' }, 404);

    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  }
};

// --- 3. LOGIQUE MÉTIER (Fonctions) ---

async function handleSearch(request, env, jsonResponse) {
  const body = await request.json();
  const { query, location, type } = body;

  if (!env.PERPLEXITY_API_KEY) return jsonResponse({ error: "Missing API Key" }, 500);

  const systemPrompt = `Tu es un expert en recrutement suisse.
  Trouve des offres d'emploi RÉELLES et ACTUELLES.
  Réponds UNIQUEMENT en JSON strict : une liste d'objets avec id, title, company, location, salary, type, url, postedAt, description.
  Si rien trouvé : [].`;

  const userPrompt = `Offres pour "${query}" à "${location || 'Suisse Romande'}". Type: ${type || 'Tous'}.`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      temperature: 0.1
    })
  });

  const data = await response.json();
  let content = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
  
  try {
    return jsonResponse({ jobs: JSON.parse(content) });
  } catch (e) {
    return jsonResponse({ error: "AI Parsing Error", raw: content }, 502);
  }
}

async function handleAnalyze(request, env, jsonResponse) {
  const { url } = await request.json();
  if (!url) return jsonResponse({ error: "URL missing" }, 400);

  const systemPrompt = `Coach carrière expert. Analyse cette offre.
  Réponds UNIQUEMENT en JSON strict : { "summary": "...", "insights": "...", "pros": [], "cons": [], "matchScore": 85 }`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.PERPLEXITY_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: `Analyse : ${url}` }],
      temperature: 0.2
    })
  });

  const data = await response.json();
  let content = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
  try {
    return jsonResponse(JSON.parse(content));
  } catch (e) {
    return jsonResponse({ summary: "Erreur analyse", insights: content });
  }
}

async function handleSuggestions(request, env, jsonResponse) {
  const { testResults } = await request.json();
  const riasec = testResults?.riasec?.result?.code || "Inconnu";

  const systemPrompt = `Conseiller orientation. Suggère 5 métiers précis en Suisse selon profil.
  Réponds UNIQUEMENT un tableau JSON de strings. Ex: ["Métier A", "Métier B"]`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.PERPLEXITY_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: `Profil RIASEC: ${riasec}` }],
      temperature: 0.2
    })
  });

  const data = await response.json();
  let content = data.choices[0].message.content.replace(/```json/g, '').replace(/```/g, '').trim();
  try {
    return jsonResponse(JSON.parse(content));
  } catch (e) {
    return jsonResponse(["Erreur suggestion"], 200);
  }
}

async function handleCheckout(request, env, jsonResponse) {
  const { priceId, successUrl, cancelUrl, mode } = await request.json();
  if (!env.STRIPE_SECRET_KEY) return jsonResponse({ error: "Stripe Config Missing" }, 500);

  // Pour la prod, on peut forcer les URLs de retour si nécessaire
  // const finalSuccess = "https://www.jobseed.online/dashboard?payment=success";
  // const finalCancel = "https://www.jobseed.online/dashboard?payment=cancelled";

  const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY.trim()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'payment_method_types[]': 'card',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'mode': mode || 'payment',
      'success_url': successUrl, // Ou finalSuccess
      'cancel_url': cancelUrl,   // Ou finalCancel
    })
  });

  const session = await stripeResponse.json();
  if (session.error) return jsonResponse({ error: session.error.message }, 500);
  
  return jsonResponse({ url: session.url });
}
