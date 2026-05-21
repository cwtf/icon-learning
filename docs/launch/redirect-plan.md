# PR 18 Redirect Plan

This is the launch redirect seed list for replacing the current Icon Learning site with the new Astro build.

Rules:
- Use 301 redirects for legacy public URLs.
- Preserve the final canonical trailing slash.
- Strip unknown tracking query strings.
- Re-run the legacy sitemap crawl before DNS cutover and add any missing high-value paths.

## Priority Redirects

| Legacy URL | New URL | Notes |
|---|---|---|
| `https://iconlearning.com.my/about-us/` | `https://www.iconlearning.com.my/about-us/` | Legacy WordPress/domain variant. |
| `https://www.iconlearning.com.my/about-us` | `https://www.iconlearning.com.my/about-us/` | Current no-slash variant. |
| `https://www.iconlearning.com.my/programs/supply-chain-management` | `https://www.iconlearning.com.my/programs/supply-chain-shipping-warehousing/` | Current program category renamed for the new IA. |
| `https://www.iconlearning.com.my/programs/social-media-marketing` | `https://www.iconlearning.com.my/programs/sales-marketing-customer-service/` | Legacy category consolidated into sales/service. |
| `https://www.iconlearning.com.my/programs/microsoft-and-systems` | `https://www.iconlearning.com.my/programs/microsoft-ai-digital-skills/` | Legacy category renamed. |
| `https://www.iconlearning.com.my/programs/osha` | `https://www.iconlearning.com.my/programs/safety-health-environment/` | Legacy OSHA bucket maps to SHE. |
| `https://www.iconlearning.com.my/programs/leadership-and-motivation` | `https://www.iconlearning.com.my/programs/leadership-management-coaching/` | Legacy category renamed. |
| `https://www.iconlearning.com.my/programs/human-resource-management` | `https://www.iconlearning.com.my/programs/hr-employment-law/` | Legacy category renamed. |
| `https://www.iconlearning.com.my/programs/finance-and-accounting` | `https://www.iconlearning.com.my/programs/finance-taxation/` | Legacy category renamed. |
| `https://www.iconlearning.com.my/programs/quality-management` | `https://www.iconlearning.com.my/programs/quality-lean-food-safety/` | Legacy quality bucket maps to the expanded category. |
| `https://www.iconlearning.com.my/programs/teambuilding` | `https://www.iconlearning.com.my/programs/communication-personal-effectiveness/` | Legacy teambuilding category maps to communication/effectiveness. |
| `https://iconlearning.com.my/2021/04/20/energy-management-standard-iso-50001/` | `https://www.iconlearning.com.my/programs/quality-lean-food-safety/` | Legacy ISO article; no one-to-one course page yet. |
| `https://iconlearning.com.my/2021/04/20/quality-management-system-in-industrial-iso-ts-16949/` | `https://www.iconlearning.com.my/programs/quality-lean-food-safety/` | Legacy ISO article; no one-to-one course page yet. |
| `https://iconlearning.com.my/cidb-green-card/` | `https://www.iconlearning.com.my/programs/safety-health-environment/` | Legacy construction/safety article. |
| `https://iconlearning.com.my/photos-gallery-2019/` | `https://www.iconlearning.com.my/clients/` | Legacy proof/gallery page. |

## Apache Example

```apache
Redirect 301 /about-us/ https://www.iconlearning.com.my/about-us/
Redirect 301 /programs/supply-chain-management https://www.iconlearning.com.my/programs/supply-chain-shipping-warehousing/
Redirect 301 /programs/social-media-marketing https://www.iconlearning.com.my/programs/sales-marketing-customer-service/
Redirect 301 /programs/microsoft-and-systems https://www.iconlearning.com.my/programs/microsoft-ai-digital-skills/
Redirect 301 /programs/osha https://www.iconlearning.com.my/programs/safety-health-environment/
Redirect 301 /programs/leadership-and-motivation https://www.iconlearning.com.my/programs/leadership-management-coaching/
Redirect 301 /programs/human-resource-management https://www.iconlearning.com.my/programs/hr-employment-law/
Redirect 301 /programs/finance-and-accounting https://www.iconlearning.com.my/programs/finance-taxation/
Redirect 301 /programs/quality-management https://www.iconlearning.com.my/programs/quality-lean-food-safety/
Redirect 301 /programs/teambuilding https://www.iconlearning.com.my/programs/communication-personal-effectiveness/
Redirect 301 /2021/04/20/energy-management-standard-iso-50001/ https://www.iconlearning.com.my/programs/quality-lean-food-safety/
Redirect 301 /2021/04/20/quality-management-system-in-industrial-iso-ts-16949/ https://www.iconlearning.com.my/programs/quality-lean-food-safety/
Redirect 301 /cidb-green-card/ https://www.iconlearning.com.my/programs/safety-health-environment/
Redirect 301 /photos-gallery-2019/ https://www.iconlearning.com.my/clients/
```

## Source Notes

This seed list was based on the current public search surface for `iconlearning.com.my`, including:
- `https://www.iconlearning.com.my/`
- `https://www.iconlearning.com.my/about-us`
- `https://iconlearning.com.my/about-us/`
- `https://www.iconlearning.com.my/programs/supply-chain-management`
- `https://www.iconlearning.com.my/accessibility-statement`
- `https://iconlearning.com.my/2021/04/20/energy-management-standard-iso-50001/`
- `https://iconlearning.com.my/2021/04/20/quality-management-system-in-industrial-iso-ts-16949/`
- `https://iconlearning.com.my/cidb-green-card/`
- `https://iconlearning.com.my/photos-gallery-2019/`
