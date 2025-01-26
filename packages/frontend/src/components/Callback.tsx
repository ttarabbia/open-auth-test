import { Challenge, Client, createClient } from '@openauthjs/openauth/client'
import { InvalidAuthorizationCodeError, InvalidRefreshTokenError } from '@openauthjs/openauth/error';


// const authUrl = import.meta.env.VITE_AUTH_URL
// // const authUrl = Resource.MyAuth.url;
// console.log("Auth URL", authUrl)
//
// const client = createClient({
//   clientID: "my-client",
//   issuer: authUrl,
// })
// const challenge = JSON.parse(localStorage.getItem("challenge"));
// const queryCode = new URLSearchParams(window.location.search).get('code') || "SENTINEL: FAILURE TO FIND CODE IN QUERY PARAM";
//
// const exchanged = await client.exchange(
//   queryCode,
//   "/other",
//   challenge.verifier)
//
// if (exchanged.err) throw new Error("Invalid code")
// localStorage.setItem("access_token", exchanged.tokens.access)
// localStorage.setItem("refresh_token", exchanged.tokens.refresh)



import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Callback({ client }: { client: Client }) {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let isProcessing = false;

    const handleCallback = async () => {
      if (!isMounted || isProcessing) return;
      isProcessing = true;
      const queryCode = new URLSearchParams(window.location.search).get('code');
      const storedChallenge: Challenge = JSON.parse(localStorage.getItem("challenge"));
      console.log("Authorization code:", queryCode);
      console.log("Verifier:", storedChallenge.verifier);

      if (!queryCode || !storedChallenge) {
        console.error("Missing queryCode or challenge verifier.");
        return;
      }

      // Verify the state parameter matches what we stored
      const queryState = new URLSearchParams(window.location.search).get('state');
      if (queryState !== storedChallenge.state) {
        console.error("State mismatch:", {
          queryState,
          storedState: storedChallenge.state
        });
        navigate("/?error=state_mismatch");
        return;
      }
      const verified = await client.verify({ userId: "1ewjk@gmail.com", workspaceId: "123" }, existingAccess);

      const redirect_uri = `${window.location.origin}/callback`

      try {
        // Check if we already have valid tokens
        const existingAccess = localStorage.getItem("access_token");
        const existingRefresh = localStorage.getItem("refresh_token");

        if (existingAccess && existingRefresh) {
          console.log("Found existing tokens - verifying...");

          // Verify tokens with the server
          const verified = await client.verify(
            { userId: "1ewjk@gmail.com", workspaceId: "123" },
            existingAccess,
            { refresh: existingRefresh }
          );

          if (verified.err) {
            if (verified.err instanceof InvalidRefreshTokenError) {
              console.log("Invalid refresh token - proceeding with exchange");
            } else {
              console.error("Verification error:", verified.err);
              navigate("/?error=verification_failed");
              return;
            }
          } else {
            // If verification succeeded and we got new tokens
            if (verified.tokens) {
              localStorage.setItem("access_token", verified.tokens.access);
              localStorage.setItem("refresh_token", verified.tokens.refresh);
            }
            console.log("Tokens verified - redirecting to dashboard");
            navigate("/dashboard");
            return;
          }
        }

        // If we get here, either no tokens or verification failed - proceed with exchange
        console.log("No valid tokens found - proceeding with exchange");
        const exchanged = await client.exchange(
          queryCode,
          redirect_uri,
          storedChallenge.verifier
        );

        if (exchanged.err) {
          if (exchanged.err instanceof InvalidAuthorizationCodeError) {
            console.error("Invalid authorization code:", exchanged.err);
            navigate("/?error=invalid_code");
            return;
          }
          throw new Error(`Exchange error: ${exchanged.err.message}`);
        }

        localStorage.setItem("access_token", exchanged.tokens.access);
        localStorage.setItem("refresh_token", exchanged.tokens.refresh);
        navigate("/dashboard");

      } catch (error) {
        console.error("Error:", error);
        navigate("/?error=unexpected_error");
      }
      // try {
      //   // Check if we already have valid tokens
      //   const existingAccess = localStorage.getItem("access_token");
      //   const existingRefresh = localStorage.getItem("refresh_token");
      //
      //   if (existingAccess && existingRefresh) {
      //     console.log("existingAccess", existingAccess);
      //     console.log("existingRefresh", existingRefresh);
      //     try {
      //       const payload = JSON.parse(atob(existingAccess.split('.')[1]));
      //       console.log("payload", payload)
      //
      //       if (payload.exp && payload.exp * 1000 > Date.now()) {
      //         console.log("Valid access token found - redirecting to dashboard");
      //         navigate("/dashboard");
      //         return;
      //       }
      //     } catch (e) {
      //       console.log("Invalid access token - proceeding with exchange", e);
      //       console.log(queryCode, redirect_uri, storedChallenge.verifier);
      //       const exchanged = await client.exchange(
      //         queryCode,
      //         redirect_uri,
      //         storedChallenge.verifier
      //       );
      //       console.log(exchanged);
      //
      //       if (exchanged.err) {
      //         if (exchanged.err instanceof InvalidAuthorizationCodeError) {
      //           console.error("Invalid authorization code:", exchanged.err);
      //           navigate("/?error=invalid_code");
      //           return;
      //         }
      //         throw new Error(`Exchange error: ${exchanged.err.message}`);
      //       }
      //
      //       localStorage.setItem("access_token", exchanged.tokens.access);
      //       localStorage.setItem("refresh_token", exchanged.tokens.refresh);
      //
      //       navigate("/dashboard");
      //
      //     };
      //   };
      // } catch (error) {
      //   console.error("Error exchanging code:", error);
      //   navigate("/?error=exchange_failed");

    }


    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, client]);

  return <div>Processing authentication...</div>;
};

