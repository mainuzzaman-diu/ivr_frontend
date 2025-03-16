// // pages/_app.js
// import { SessionProvider } from "next-auth/react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles/globals.css";


// function MyApp({ Component, pageProps: { session, ...pageProps } }) {
//   return (
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//     </SessionProvider>
//   );
// }

// export default MyApp;
// pages/_app.js
import { SessionProvider, useSession } from "next-auth/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      {/* Prevent showing the layout on login pages */}
      {Component.noLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout session={session}>
          <Component {...pageProps} />
        </Layout>
      )}
    </SessionProvider>
  );
}

export default MyApp;
