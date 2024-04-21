import { MD5 } from 'crypto-js';
const config = window.electron.ipcRenderer.getMyConfig();
import axios from 'axios';
import Swal from 'sweetalert2';

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const FormatWaktuSekarang = () => {
  const waktuSekarang = new Date();
  const hari = waktuSekarang.toLocaleDateString('id-ID', { weekday: 'long' });
  const tanggal = waktuSekarang.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const jam = waktuSekarang.getHours().toString().padStart(2, '0');
  const menit = waktuSekarang.getMinutes().toString().padStart(2, '0');
  const detik = waktuSekarang.getSeconds().toString().padStart(2, '0');

  return `${hari}, ${tanggal} ${jam}:${menit}:${detik}`;
};

export const recursiveMD5 = (text, rounds) => {
  if (rounds === 0) {
    return text;
  } else {
    return recursiveMD5(MD5(text).toString(), rounds - 1);
  }
};

export const getConfigAPI = async () => {
  var newSecret = recursiveMD5(config.api_secretcode + '1678VMS1678', 3);
  await axios
    .get(`${config.api_url}?secretcode=${newSecret}&tipe=dataConfig`)
    .then((data) => {
      //set data
      localStorage.setItem('footer1', data.data.footer1);
      localStorage.setItem('footer2', data.data.footer2);
      localStorage.setItem('header', data.data.header);
      localStorage.setItem('subheader1', data.data.subheader1);
      localStorage.setItem('subheader2', data.data.subheader2);
      localStorage.setItem('urllogo', data.data.userllogo);
    })
    .catch((err) => {});
};

export const getDateAPI = async () => {
  try {
    var newSecret = recursiveMD5(config.api_secretcode + '1678VMS1678', 3);
    const response = await axios.get(
      `${config.api_url}?secretcode=${newSecret}&tipe=getDate`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDigitMD5Serial = (nilai) => {
  const onlyNumber = nilai.replace(/\D/g, '');

  // Mengambil 10 digit pertama (jika tersedia)
  const first10Digits = onlyNumber.slice(0, 10);

  // Mengisi dengan 0 jika panjangnya kurang dari 10
  const digitCount = first10Digits.length;
  if (digitCount < 10) {
    const sisaDigit = 10 - digitCount;
    const nol = '0'.repeat(sisaDigit);
    return first10Digits + nol;
  } else {
    return first10Digits;
  }
};

export const metodeTipeBayar = (metode) => {
  if (metode == '01') {
    return 'Mandiri eMoney Card';
  } else if (metode == '02') {
    return 'Mandiri E-money';
  } else if (metode == '03') {
    return 'BRI BRIZZI';
  } else if (metode == '04') {
    return 'BNI Tapcash';
  } else if (metode == '05') {
    return 'BCA FLAZZ';
  } else if (metode == '06') {
    return 'DKI JakCard';
  } else if (metode == '07') {
    return 'NOBU Card';
  } else if (metode == '08') {
    return 'MEGA MegaCash';
  } else if (metode == '09') {
    return 'QR Payment';
  } else {
    return '';
  }
};

export const Terbilang = (a) => {
  const bilangan = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];

  let kalimat = '';

  if (a < 12) {
    kalimat = bilangan[a];
  } else if (a < 20) {
    kalimat = bilangan[a - 10] + ' Belas';
  } else if (a < 100) {
    const utama = Math.floor(a / 10);
    const depan = parseInt(utama.toString().charAt(0));
    const belakang = a % 10;
    kalimat = bilangan[depan] + ' Puluh ' + bilangan[belakang];
  } else if (a < 1000) {
    const utama = Math.floor(a / 100);
    const depan = parseInt(utama.toString().charAt(0));
    const belakang = a % 100;
    kalimat = bilangan[depan] + ' Ratus ' + Terbilang(belakang);
  }
  // tambahkan bagian lain sesuai dengan kode asli yang Anda miliki

  return kalimat;
};

export const sToMs = (seconds) => {
  return seconds * 1000;
};

export const formatRupiah = (angka = '0') => {
  let reverse = angka.toString().split('').reverse().join('');
  let ribuan = reverse.match(/\d{1,3}/g);
  let hasil = ribuan.join(',').split('').reverse().join('');
  return hasil;
};

export const thnBulanTgl = () => {
  const sekarang = new Date();
  const tahun = sekarang.getFullYear();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, '0');
  const tanggal = String(sekarang.getDate()).padStart(2, '0');

  return `${tahun}-${bulan}-${tanggal}`;
};
