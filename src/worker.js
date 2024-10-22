var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId)
      return new Response("Missing orderId parameter", { status: 400 });

    const accessToken = env.ACCESS_TOKEN;
    const webhookUrl = "https://backoffice.banana-moon-clothing.co.uk/incoming-webhook/ORDER_PAYMENT";

    const shopifyResponse = await fetch(`https://62c5eb-2.myshopify.com/admin/api/2023-10/orders/${orderId}.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken
      }
    });

    if (!shopifyResponse.ok)
      return new Response(`Failed to fetch order from Shopify: ${shopifyResponse.statusText}`, { status: shopifyResponse.status });

    const orderData = await shopifyResponse.json();

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData.order)
    });

    if (webhookResponse.ok)
      return new Response("Webhook triggered successfully!", { status: 200 });
    else
      return new Response(`Failed to trigger webhook: ${webhookResponse.statusText}`, { status: webhookResponse.status });
  }
};

export {
  src_default as default
};