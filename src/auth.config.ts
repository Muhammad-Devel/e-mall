import type { NextAuthConfig } from "next-auth";

// Edge-safe subset of the Auth.js config (no Prisma/bcrypt — those are
// Node-only and would break Next.js Middleware's Edge runtime). Used by
// middleware.ts to read the session; the full config with the Credentials
// provider lives in auth.ts and is used everywhere else (Node runtime).
export const authConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  // A shared domain is needed when the production app uses app.e-mall.uz and
  // e-mall.uz together. Vercel deployment URLs must use a host-only cookie:
  // browsers reject Domain=.e-mall.uz when the current host is *.vercel.app.
  //
  // The "-v2" suffix is deliberate: browsers that logged in before this
  // domain-wide scoping existed are still holding the old host-only
  // "__Secure-authjs.session-token" cookie (no Domain attribute) alongside
  // whatever this scoped one they get now — same name, different scope,
  // and the server has no way to tell the two apart (Domain/Path aren't
  // included in the Cookie header the browser sends). Which one gets read
  // was a coin flip on every request, flipping signed-in identity mid-
  // session. Every attempt to clean that up server-side (deleting one
  // variant, deduping the incoming header, even rewriting the parsed
  // cookie jar directly) got undermined by some cache or internal request
  // reconstruction still seeing the old ambiguous pair. Renaming the
  // cookie sidesteps all of that: old browsers' stale cookie just becomes
  // inert under a name nothing reads anymore, and every fresh login starts
  // clean under the new name with no possible collision.
  ...(process.env.NODE_ENV === "production" && {
    cookies: {
      sessionToken: {
        name: "__Secure-authjs.session-token-v2",
        options: {
          httpOnly: true,
          sameSite: "lax" as const,
          path: "/",
          secure: true,
          ...(process.env.AUTH_COOKIE_DOMAIN ? { domain: process.env.AUTH_COOKIE_DOMAIN } : {}),
        },
      },
    },
  }),
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.storeId = user.storeId ?? null;
        token.phone = user.phone;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.storeId = (token.storeId as string | null) ?? null;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
