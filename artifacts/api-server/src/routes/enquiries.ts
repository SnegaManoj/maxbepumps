import { Router, type IRouter, type Request } from "express";
import { SubmitEnquiryBody, SubmitEnquiryResponse } from "@workspace/api-zod";

const router: IRouter = Router();
const windowMs = 15 * 60 * 1000;
const maxRequests = 5;
const requestsByIp = new Map<string, number[]>();
const businessTypes = new Set(["retailer", "distributor", "installer", "other"]);
function readText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function getClientIp(request: Request): string {
  return request.ip || request.socket.remoteAddress || "unknown";
}

function isRateLimited(ip: string, now: number): boolean {
  const recentRequests = (requestsByIp.get(ip) ?? []).filter(timestamp => now - timestamp < windowMs);
  if (recentRequests.length >= maxRequests) {
    requestsByIp.set(ip, recentRequests);
    return true;
  }
  recentRequests.push(now);
  requestsByIp.set(ip, recentRequests);
  if (requestsByIp.size > 10000) {
    for (const [knownIp, timestamps] of requestsByIp) {
      if (!timestamps.some(timestamp => now - timestamp < windowMs)) requestsByIp.delete(knownIp);
    }
    if (requestsByIp.size > 10000) {
      const oldestIp = requestsByIp.keys().next().value;
      if (oldestIp) requestsByIp.delete(oldestIp);
    }
  }
  return false;
}

router.post("/enquiries", async (request, response) => {
  if (!request.is("application/json")) {
    response.status(415).json({ error: "Submit the enquiry as JSON." });
    return;
  }

  const now = Date.now();
  if (isRateLimited(getClientIp(request), now)) {
    response.setHeader("Retry-After", String(Math.ceil(windowMs / 1000)));
    response.status(429).json({ error: "Too many requests. Please try again later." });
    return;
  }

  const parsedBody = SubmitEnquiryBody.safeParse(request.body);
  if (!parsedBody.success) {
    response.status(400).json({ error: "Check the required enquiry fields and try again." });
    return;
  }

  if (readText(parsedBody.data.website, 200)) {
    response.status(202).json(SubmitEnquiryResponse.parse({ ok: true }));
    return;
  }

  const body = parsedBody.data;
  const enquiry = {
    name: readText(body.name, 120),
    businessName: readText(body.businessName, 160),
    phone: readText(body.phone, 40),
    email: readText(body.email, 254).toLowerCase(),
    state: readText(body.state, 80),
    city: readText(body.city, 100),
    businessType: readText(body.businessType, 80),
    enquiryType: readText(body.enquiryType, 20),
    category: readText(body.category, 100),
    model: readText(body.model, 100),
    message: readText(body.message, 2000),
  };
  const phoneDigits = enquiry.phone.replace(/\D/g, "").length;
  const phoneFormatIsValid = !enquiry.phone || /^[+()\d.\-\s]+$/.test(enquiry.phone);
  const dealerDetailsAreValid = enquiry.enquiryType !== "dealer" || (
    enquiry.businessName.length > 0
    && enquiry.state.length > 0
    && enquiry.city.length > 0
    && businessTypes.has(enquiry.businessType)
    && phoneDigits >= 7
    && phoneDigits <= 15
  );

  if (
    !enquiry.name
    || !enquiry.message
    || !phoneFormatIsValid
    || (enquiry.phone && (phoneDigits < 7 || phoneDigits > 15))
    || !dealerDetailsAreValid
  ) {
    response.status(400).json({ error: "Check the required enquiry fields and try again." });
    return;
  }

  const webhookValue = process.env.ENQUIRY_WEBHOOK_URL;
  let webhookUrl: URL;
  try {
    if (!webhookValue) throw new Error("Missing webhook configuration");
    webhookUrl = new URL(webhookValue);
    if (webhookUrl.protocol !== "https:") throw new Error("Webhook must use HTTPS");
  } catch {
    response.status(503).json({ error: "Online enquiries are not configured yet. Please contact the factory by phone or email." });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const delivery = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...enquiry, receivedAt: new Date(now).toISOString() }),
      signal: controller.signal,
    });
    if (!delivery.ok) {
      response.status(502).json({ error: "The enquiry could not be delivered. Please try again or contact the factory directly." });
      return;
    }
    response.status(201).json(SubmitEnquiryResponse.parse({ ok: true }));
  } catch {
    response.status(502).json({ error: "The enquiry could not be delivered. Please try again or contact the factory directly." });
  } finally {
    clearTimeout(timeout);
  }
});

export default router;