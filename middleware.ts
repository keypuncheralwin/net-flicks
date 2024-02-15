import withAuth from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ req }) => {
      // verify token and return a boolean
      const sessionToken = req.cookies.get('next-auth.session-token');
      if (sessionToken) return true;
      else return false;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export const config = { matcher: ['/home/:path*'] };
