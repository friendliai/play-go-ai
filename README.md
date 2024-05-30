# play.go.ai

play.go.ai is an AI-powered Go code editor built with [Next.js](https://nextjs.org) and [Vercel AI SDK](https://sdk.vercel.ai/) using [FriendliAI](https://friendli.ai).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fminpeter%2Fplay.go.ai&env=FRIENDLI_API_KEY&envDescription=Token%20issuance%20from%20friendli%20suite%20for%20AI%20text%20generation&envLink=https%3A%2F%2Fsuite.friendli.ai%2Fuser-settings%2Ftokens&project-name=play-go-ai&repository-name=play.go.ai)

## Developing

- Clone the repository
- Create a `.env.local` file with `FRIENDLI_API_KEY=your-api-key` where `your-api-key` is your friendli suite API key from [suite.friendli.ai](https://suite.friendli.ai/user-settings/tokens).
- Run `pnpm install` to install dependencies.
- Run `pnpm dev` to start the development server.
