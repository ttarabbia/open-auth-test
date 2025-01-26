import { useNavigate } from "react-router-dom";
import { AuthorizeResult, Client } from '@openauthjs/openauth/client'

export default function Other({ client }: { client: Client }) {
  const navigate = useNavigate();

  const handleAuthentication = async () => {
    // Check for existing valid tokens
    const existingAccess = localStorage.getItem("access_token");
    const existingRefresh = localStorage.getItem("refresh_token");

    if (existingAccess && existingRefresh) {
      try {
        const payload = JSON.parse(atob(existingAccess.split('.')[1]));
        const expirationDate = new Date(payload.exp * 1000);
        const currentDate = new Date();

        console.log('Token expiration:', expirationDate.toLocaleString());
        console.log('Current time:', currentDate.toLocaleString());
        console.log('Expiration timestamp:', payload.exp);
        console.log('Current timestamp:', Date.now());

        if (payload.exp && payload.exp * 1000 > Date.now()) {
          console.log("Valid tokens found - redirecting to dashboard");
          navigate("/dashboard");
          return;
        }
      } catch (e) {
        console.log("Existing tokens invalid - proceeding with authentication");
      }
    }

    // If no valid tokens, start new auth flow
    const redirect_uri = `${window.location.origin}/callback`;
    const { challenge, url }: AuthorizeResult = await client.authorize(redirect_uri, "code", { pkce: true });
    localStorage.setItem("challenge", JSON.stringify(challenge));
    console.log(challenge);
    window.location.href = url;
  }
  return (
    <>
      <div className="Other">
        <a href={window.location.origin}><h1>I am other</h1></a>
        <meter value={75} min={0} max={100} low={30} high={70} optimum={85}></meter>
        <div className="card">
          <button onClick={handleAuthentication}>
            Login
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
    </>
  )
}
