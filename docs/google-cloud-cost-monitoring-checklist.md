# Google Cloud Cost Monitoring Checklist

Last updated: 2026-06-17

Use this checklist before sharing DutchMate with a broader WhatsApp group. The goal is to confirm that Google Cloud Translation costs are visible and that budget alerts are active before more people can generate real translation traffic.

## Current Status

Status: **Needs manual Google Cloud Console verification**

Known setup from [google-cloud-translation-setup.md](google-cloud-translation-setup.md):

- Google Cloud account: `dutchmate.project@gmail.com`
- Google Cloud project: `dutchmate-production`
- Free trial credit was active on 2026-06-16.
- A Google Cloud budget alert was created on 2026-06-16.
- Cloud Translation API is enabled.
- Render uses `TRANSLATION_PROVIDER=google-translate`.

This repo environment does not currently have authenticated Google Cloud Console access or the `gcloud` CLI, so the dashboard and alert state must be confirmed manually.

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
