import React, { useEffect, useState, useRef } from 'react';
import { Footer, Header } from '../../Component';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { bootstrap } from 'bootstrap';
import { getDigitMD5Serial, recursiveMD5 } from '../../Utils/globalfunction';
import { useDataConfig } from '../../provider/configProvider';
const config = window.electron.ipcRenderer.getMyConfig();

export const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="Header fixed-top row justify-content-center">
        <Header />
      </header>
      <main
        className="Content bg-dark"
        style={{
          backgroundImage: `url(${config.url_background}`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse
            mollitia quod eveniet, et at corrupti minus quisquam odit blanditiis
            animi, officia repellat. Eos fuga ea excepturi exercitationem
            obcaecati! Quibusdam, corporis?
          </div>
        </div>
      </main>
      <footer className="Footer">
        <Footer />
      </footer>
    </div>
  );
};
