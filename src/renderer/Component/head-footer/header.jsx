import { useDataConfig } from '../../provider/configProvider';
import bgBlueTop from './../../../../assets/images/head-bott/blue-top.png';
const config = window.electron.ipcRenderer.getMyConfig();

export const Header = () => {
  const { titlePerusahaan } = useDataConfig();
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col bg-light text-dark fw-bold fs-5 text-start ps-4 py-2">
            TEMPLATE
          </div>
          <div className="col bg-light text-dark fw-bold fs-5 text-end pe-4 py-2">TEMPLATE</div>
        </div>
      </div>
    </>
  );
};
