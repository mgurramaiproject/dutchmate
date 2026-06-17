# Google Cloud Cost Monitoring Checklist

Last updated: 2026-06-18

Use this checklist before sharing DutchMate with a broader WhatsApp group. The goal is to confirm that Google Cloud Translation costs are visible and that budget alerts are active before more people can generate real translation traffic.

## Current Status

Status: **Budget alerts and spend dashboard verified**

Known setup from [google-cloud-translation-setup.md](google-cloud-translation-setup.md):

- Google Cloud account: `dutchmate.project@gmail.com`
- Google Cloud project: `dutchmate-production`
- Free trial credit was active on 2026-06-16.
- A Google Cloud budget alert was created on 2026-06-16.
- Cloud Translation API is enabled.
- Render uses `TRANSLATION_PROVIDER=google-translate`.

This repo environment now has authenticated `gcloud` CLI access as `dutchmate.project@gmail.com`, but it does not have Google Cloud Console UI access. Budget alert configuration is verified through the Cloud Billing Budget API. Current spend and free-trial status were verified manually in the Google Cloud Console.

## Manual Verification Steps

1. Sign in to Google Cloud as `dutchmate.project@gmail.com`.
2. Select project `dutchmate-production`.
3. Open **Billing**.
4. Confirm the free trial credit is still active.
5. Confirm the full paid account has not been activated unless explicitly approved.
6. Open **Billing > Budgets & alerts**.
7. Confirm at least one budget exists for the DutchMate project or billing account.
8. Confirm budget alert thresholds are configured.
9. Confirm alert recipients include an email address that will actually be checked.
10. Open the cost dashboard or reports page.
11. Confirm current spend is visible.
12. Filter or inspect costs for **Cloud Translation API** usage.
13. Confirm the Cloud Translation API key is still restricted to **Cloud Translation API** only.
14. Confirm Render still stores the Google API key only as an environment variable.

## Suggested Pre-Share Threshold

Before sharing with the WhatsApp group, choose a simple owner-facing stop point:

```text
If Google Cloud spend or projected spend looks surprising, pause sharing and disable or reduce traffic before inviting more users.
```

Budget alerts are useful warnings, but they are not hard spending caps. Keep the WhatsApp share gentle and moderate until real usage and cost are understood.

## Verification Log

Add the newest entry first after checking the Google Cloud Console.

```text
Date: 2026-06-18
Verifier: MGurram via production /health check
Project: dutchmate-production
Free trial status: Not checked in this step
Budget alert status: Previously verified
Alert recipients checked: Previously partially verified
Current spend: Not checked in this step
Cloud Translation API cost visible: Not checked in this step
API key restriction checked: Previously verified; key dutchmate-render-translation-key is restricted to translate.googleapis.com
Result: Pass for backend runtime visibility
Notes: Production https://dutchmate-backend.onrender.com/health returned runtime summary after deploy. Backend process started at 2026-06-17T22:09:57.558Z. It reported 12 accepted translate requests, 130 requested source characters, 12 successes, 0 failures, 0 client rate-limit hits, 0 provider errors, 0 provider rate-limit events, and hover-only traffic in this process window.

Date: 2026-06-17
Verifier: MGurram via Google Cloud Console
Project: dutchmate-production
Free trial status: Pass; EUR 257.72 credit remaining and 89 days remaining
Budget alert status: Previously verified by CLI; budget dutchmate-mvp-budget exists
Alert recipients checked: Previously partially verified by CLI; project-level recipients are enabled
Current spend: Pass; June 1-16, 2026 total cost is EUR 0.00
Cloud Translation API cost visible: Pass; Translate shows EUR 0.02 usage cost, EUR -0.02 other savings, EUR 0.00 subtotal
API key restriction checked: Previously verified; key dutchmate-render-translation-key is restricted to translate.googleapis.com
Result: Pass for MVP WhatsApp-group cost visibility
Notes: Console reports free trial credits at EUR 257.72 remaining out of EUR 257.72. The full account is not activated; Console still shows the prompt to activate the full account. Forecast for June 1-30, 2026 says there is not enough historical data to project cost.

Date: 2026-06-17
Verifier: Codex via Cloud Billing Budget API
Project: dutchmate-production
Free trial status: Not verified from CLI
Budget alert status: Pass; budget dutchmate-mvp-budget exists
Alert recipients checked: Partial; project-level recipients are enabled, exact email recipients not listed in API response
Current spend: Not verified from CLI
Cloud Translation API cost visible: Not verified from CLI
API key restriction checked: Previously verified; key dutchmate-render-translation-key is restricted to translate.googleapis.com
Result: Partial pass
Notes: Billing Budget API returned one monthly budget scoped to projects/905309153931. Budget amount is EUR 5. Threshold alerts are configured at 50%, 90%, and 100% of current spend. notificationsRule.enableProjectLevelRecipients is true.

Date: 2026-06-17
Verifier: Codex via gcloud CLI
Project: dutchmate-production
Free trial status: Not verified from CLI
Budget alert status: Not verified from CLI; Billing Budget API is disabled for dutchmate-production
Alert recipients checked: Not verified from CLI
Current spend: Not verified from CLI
Cloud Translation API cost visible: Not verified from CLI
API key restriction checked: Pass; key dutchmate-render-translation-key is restricted to translate.googleapis.com
Result: Partial
Notes: Project billing is enabled on billingAccounts/012249-79A8E9-0418CF. Cloud Translation API is enabled. Billing account is open. Listing budgets through billingbudgets.googleapis.com returned SERVICE_DISABLED, so budget alert details require Google Cloud Console verification or explicit approval to enable Cloud Billing Budget API.

Date:
Verifier:
Project:
Free trial status:
Budget alert status:
Alert recipients checked:
Current spend:
Cloud Translation API cost visible:
API key restriction checked:
Result:
Notes:
```

## Before Public Store Release

- Decide whether to keep the free trial only or explicitly approve paid Google Cloud usage.
- Decide what monthly spend level is acceptable for DutchMate MVP testing.
- Keep backend rate limits active.
- Keep provider keys server-side only.
- Review Render usage and logs alongside Google Cloud cost.
