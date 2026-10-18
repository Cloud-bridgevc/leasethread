# HubSpot integration plan (not yet implemented)

1. **Prospect capture** — `/request-demo` form → `POST /api/leads` Lambda → HubSpot Contacts API (upsert by email) + associate Company. Private-app token in Secrets Manager. Honour consent; store UTM params.
2. **Lead management** — property-management leads get `lifecyclestage=lead`, custom properties `unit_count`, `portfolio_type`; routing workflow assigns an owner by unit-count band.
3. **Demo scheduling** — embed HubSpot Meetings link on the success state (or create meetings via API), webhook back to mark `demo_scheduled`.
4. **Onboarding tracking** — Deal pipeline "Onboarding": Kickoff → Data import → Lease upload → Team trained → Live. App events (first property added, first lease extracted) update deal properties via webhook-driven Lambda.
5. **Safety** — no tenant PII or lease content is sent to HubSpot; only company/prospect data.
