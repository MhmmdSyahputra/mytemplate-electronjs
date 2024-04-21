import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { DashboardPage } from './Views';
import { getConfigAPI } from './Utils/globalfunction';
import { useEffect, useState } from 'react';
import './../../assets/css/bootstrap.min.css';
import { ConfigProvider } from './provider/configProvider';
const getSerialNumber = window.electron.ipcRenderer.getSerialNumber();

export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getConfigAPI();
    setLoading(false);
  }, []);

  window.addEventListener('keydown', (e) => {
    const { key, altKey } = e;
    //disable alt+f4 for close
    if (key === 'F4' && altKey) {
      e.preventDefault();
    }
    //disable f for taskbar
    if (key === 'f' && altKey) {
      e.preventDefault();
    }
    //disable F12 for minimize
    if (key === 'F11') {
      e.preventDefault();
    }

    if (key == 'r' && e.ctrlKey) {
      e.preventDefault();
      location.reload();
    }
  });

  return (
    <div>
      {!loading ? (
        <Router>
          <ConfigProvider>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
            </Routes>
          </ConfigProvider>
        </Router>
      ) : null}
    </div>
  );
}
