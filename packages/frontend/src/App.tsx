import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { createClient } from '@openauthjs/openauth/client'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Callback from './components/Callback'
import Other from './components/Other'
import MainPageLayout from './containers/MainPageLayout'




// const challenge = JSON.parse(localStorage.getItem("challenge"))
// const queryCode = new URLSearchParams(window.location.search).get('code') || "SENTINEL: FAILURE TO FIND CODE IN QUERY PARAM";
//
// const exchanged = await client.exchange(
//   queryCode,
//   redirect_uri,
//   challenge.verifier)
//
// if (exchanged.err) throw new Error("Invalid code")
// localStorage.setItem("access_token", exchanged.tokens.access)
// localStorage.setItem("refresh_token", exchanged.tokens.refresh)


function App() {
  const authUrl = import.meta.env.VITE_AUTH_URL
  console.log("Auth URL", authUrl)
  const client = createClient({
    clientID: "my-client",
    issuer: authUrl,
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/callback" element={<Callback client={client} />} />
        <Route path="/dashboard" element={<MainPageLayout />} />
        <Route path="/" element={<Other client={client} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
