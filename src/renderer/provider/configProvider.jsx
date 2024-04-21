import { createContext, useContext, useEffect, useState } from 'react';
import { getConfigService } from '../service/configService';

const AppContext = createContext();

export function useDataConfig() {
  return useContext(AppContext);
}

export function ConfigProvider({ children }) {
  const initialState = {
    titlePerusahaan: 'SCANMATIC PARKING',
  };

  const [dataConfig, setDataConfig] = useState(initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resConfig = await getConfigService();
        setDataConfig((prevData) => ({
          ...prevData,
          ...resConfig // Merge with API response
        }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []); // Menjalankan sekali pada saat komponen dipasang

  const updateDataConfig = (updatedValues) => {
    setDataConfig((prevData) => ({
      ...prevData,
      ...updatedValues,
    }));
  };

  // Jika dataConfig masih null atau kosong, tampilkan indikator loading atau sesuai kebutuhan
  if (!dataConfig || Object.keys(dataConfig).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <AppContext.Provider value={{ ...dataConfig, updateDataConfig }}>
      {children}
    </AppContext.Provider>
  );
}
