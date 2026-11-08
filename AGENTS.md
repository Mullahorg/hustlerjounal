<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Keep private work in authenticated server functions with role/ownership validation, because page guards are not authorization.
- Unnest full-page detail routes with trailing underscores, so section content never hides child pages.
- Preserve router-derived sitemap decisions and public-source pagination, so maps never silently omit later batches.
- Resolve legacy seed cover references through bundled WebP assets, including Markdown body images.
- Never claim newsletter delivery before a verified sender and send adapter exist.
