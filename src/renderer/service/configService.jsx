import axios from 'axios';
const config = window.electron.ipcRenderer.getMyConfig();
import { useNavigate } from 'react-router-dom';
import { recursiveMD5 } from '../Utils/globalfunction';

export async function getConfigService(data) {
  try {
    const response = await axios.get(
      `${config.api_url}?secretcode=${config.api_secretcode}&tipe=getDataConfig`,
    );
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      // Handle timeout error
      throw 'Request Timeout! Please try again.';
    } else {
      // Handle other errors
      throw error;
    }
  }
}
