import './App.css';
import React from 'react';
import FadeLoader from 'react-spinners/FadeLoader';
import { useMemo } from 'react';
import {BsArrowClockwise} from 'react-icons/bs';
import {ImWarning, ImInfo} from 'react-icons/im';
import axios from 'axios';
function App() {
  let page_height = window.innerHeight;
  let page_width = window.innerWidth; 
  //get json from backend
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [current_image_md5, setCurrentImageMd5] = React.useState(null);
  const [current_image_filename, setCurrentImageFilename] = React.useState(null);
  const [current_image_url, setCurrentImageUrl] = React.useState(null);
  const [firstLoad, setFirstLoad] = React.useState(true);

  const [showRefreshTooltip, setShowRefreshTooltip] = React.useState(false);
  const [showWarningTooltip, setShowWarningTooltip] = React.useState(false);

  const contactBackend = async () => {
    setLoading(true);
    const response = await fetch('http://10.247.1.134:3000/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const json = await response.json();
    setCurrentImageUrl(json.image);
    setCurrentImageMd5(json.md5);
    setCurrentImageFilename(json.filename);
    setLoading(false);
  }

  const firstRender = useMemo(
    () => contactBackend(),
    []
  );

  const sendReport = async () => {
    setLoading(true);
    //send post request with axios
    const response = await axios.post('http://10.247.1.134:3000/', {
      md5: current_image_md5,
      filename: current_image_filename,
      image: current_image_url,
    });
    //wait for 3 seconds
    setTimeout(() => {
      setLoading(false);
    }
    , 3000);
    //show message box to user
    alert('Report sent successfully');
    contactBackend();

    setLoading(false);
  }


  //create styling
  const style = {
    backgroundImage: `url(${current_image_url})`,
  
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: page_height,
    width: page_width,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  }
  const absoluteCenter = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }
  const refreshTooltip = {
    position: 'absolute',
    top: '90%',
    left: '52%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: '5px',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#000',
    zIndex: 1,
  }
  const warningTooltip = {
    position: 'absolute',
    top: '90%',
    left: '7%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: '5px',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#000',
    zIndex: 1,
  }

  const refreshButtonBackground = {
  
    //absolute footer
    position: 'absolute',
    bottom: 0,
    left: '50%',


    opacity: 0.5,
  }
  const refreshButton = {
  
    //absolute footer
    position: 'absolute',
    bottom: 0,
    left: '50%',
    opacity: 1,
  }
  const reportButton = {
    position: 'absolute',
    bottom: 3,
    left: '5%',
  }
  const reportButtonBackground = {
    position: 'absolute',
    bottom: 0,
    left: '5%',
    opacity: 0.5,
  }

  const header = {
    position: 'absolute',
    top: 25,
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000',
    zIndex: 1,
  }
 
  return (
    <div className="Page" style={{}}>
      <div className="header" style={header}>
        <span>
          Crime.CX <br/>
          {current_image_filename}
        </span>
      </div>

      <div className="Kitten" style={style}>
        {loading && (
          <div style={absoluteCenter}>
          <FadeLoader
            size={150}
            color={'black'}
            loading={loading}
          />
          </div>
        )}
        
        {!loading && (
          <img src={current_image_url} alt="kitten" style={style} />
        )}
        
        {!loading && (
          <div style={refreshButton} onClick={contactBackend} onMouseEnter={() => setShowRefreshTooltip(true)} onMouseLeave={() => setShowRefreshTooltip(false)}>
            <BsArrowClockwise size={150} color={'black'} onMouseEnter={() => setShowRefreshTooltip(true)} onMouseLeave={() => setShowRefreshTooltip(false)} onClick={contactBackend} />
          </div>
          )}

        {!loading && (
          <div style={reportButton} onClick={sendReport} onMouseEnter={() => setShowWarningTooltip(true)} onMouseLeave={() => setShowWarningTooltip(false)}>
              <ImWarning style={{opacity:1}} size={130} color={'black'} />
            </div>
         
        )}



        {showRefreshTooltip && (
          <div style={refreshTooltip} onClick={() => setShowRefreshTooltip(false)}>
            Click to load a new image
          </div>
        )}
        {showWarningTooltip && (
          <div style={warningTooltip} onClick={() => setShowWarningTooltip(false)}>
            Click to report this image
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
