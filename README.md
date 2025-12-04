<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1G5bkBj4v5cxBlymHWGAGr0p5snV2VQsX

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Add your Supabase credentials in [.env.local](.env.local):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Run the app:
   `npm run dev`

## Testing / Build

To verify the bundle, run `npm run build`. This requires access to the npm registry to download `three`, `@react-three/drei`, and other client rendering dependencies.

## Push changes to GitHub / open a PR

If you are developing locally and need to publish your branch to GitHub before opening a pull request:

1. Verify you are on the correct branch: `git status -sb`.
2. Add and commit your changes: `git add . && git commit -m "your message"`.
3. Push to the remote (replace `branch-name` with your branch): `git push origin branch-name`.
4. Open a pull request from that branch in the GitHub UI.

If `git push origin branch-name` fails, make sure the remote is set (`git remote -v`) and that you have permission to push to the repository.
