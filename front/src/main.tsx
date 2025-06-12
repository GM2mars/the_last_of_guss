import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css'

import { LoginPage } from '@/pages/Login';
import { RoundsListPage } from '@/pages/RoundsList';
import { RoundPage } from '@/pages/Round';
import { ProtectedRoute } from '@/hoc/ProtectedRoute';
import { WsConnector } from '@/components/WsConnector';


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/rounds" element={<RoundsListPage />} />
          <Route path="/rounds/:id" element={<RoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <WsConnector />
  </>
  // </StrictMode>,
)
