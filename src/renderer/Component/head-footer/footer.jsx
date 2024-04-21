import React, { useEffect, useState } from 'react';
import { FormatWaktuSekarang } from '../../Utils/globalfunction';
export const Footer = () => {
  const [waktu, setWaktu] = useState(FormatWaktuSekarang);

  useEffect(() => {
    // Fungsi ini akan dijalankan setiap 1 detik untuk memperbarui waktu
    const timer = setInterval(() => {
      setWaktu(FormatWaktuSekarang());
    }, 1000);

    // Membersihkan interval saat komponen tidak lagi digunakan
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col bg-light text-dark fw-bold fs-5 text-start ps-4 py-2">
             TEMPLATE
          </div>
          <div className="col bg-light text-dark fw-bold fs-5 text-end pe-4 py-2">{waktu}</div>
        </div>
      </div>
    </>
  );
};
