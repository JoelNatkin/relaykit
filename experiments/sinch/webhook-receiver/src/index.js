export default {
  async fetch(request) {
    const captured = {
      timestamp: new Date().toISOString(),
      method: request.method,
      path: new URL(request.url).pathname,
      headers: Object.fromEntries(request.headers.entries()),
      body: await safeBody(request),
    };
    console.log(JSON.stringify(captured, null, 2));
    return new Response('', { status: 200 });
  }
};

async function safeBody(req) {
  const text = await req.text();
  try { return JSON.parse(text); } catch { return text; }
}
