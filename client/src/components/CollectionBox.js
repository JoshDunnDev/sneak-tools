import {useState, useEffect} from 'react';
import ReactGa from 'react-ga';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/fontawesome-free-solid';
import {faVolumeMute, faVolumeUp} from '@fortawesome/free-solid-svg-icons';
import logo from '../images/SAL_Logo.png';
import audioFile from '../audio/definite-555.mp3';

const CollectionBox = ({
  collection, updateCollection, removeCollection, updateNotifications,
  setInputError, setMessage
}) => {
  const [lowPrice, setLowPrice] = useState('');
  const [highPrice, setHighPrice] = useState('');
  const [intervalId, setIntervalId] = useState(null);
  const [isNotifying, setIsNotifying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [frequency, setFrequency] = useState(5000);
  const [isLimited, setIsLimited] = useState(true);

  const frequencyOptions = [
    {label: 'Only Once', value: 5000},
    {label: 'Every 5 Seconds', value: 5000},
    {label: 'Every 10 Seconds', value: 10000},
  ]

  useEffect(() => {
    const startUpdate = async () => {
      const newIntervalId = setInterval(async () => {
        update();
      }, frequency);
      setIntervalId(newIntervalId);
    }
    if(isNotifying && !intervalId) {
      startUpdate();
    }
  })

  const url = audioFile;
  const audio = new Audio(url);

  const handleLowInputClick = () => {
    ReactGa.event({
      category: 'Input',
      action: 'Low Price Clicked'
    });
  }

  const handleHighInputClick = () => {
    ReactGa.event({
      category: 'Input',
      action: 'High Price Clicked'
    });
  }

  const handleMuteClick = () => {
    ReactGa.event({
      category: 'Button',
      action: 'Muted Clicked'
    });
    setIsMuted(!isMuted);
  }

  const handleOnChange = (e) => {
    const index = e.target.selectedIndex;
    ReactGa.event({
      category: 'Option',
      action: `${frequencyOptions[index].label} Clicked`
    });
    setFrequency(e.target.value);
    if(frequencyOptions[index].label === 'One Time') {
      setIsLimited(true);
    } else {
      setIsLimited(false);
    }
  }

  const createNotification = (text, image) => {
    const notification = {
      image,
      text,
      time: new Date().toLocaleTimeString()
    }
    const desktopNotification = new Notification(notification.text, {
      icon: logo,
      timestamp: notification.time,
      vibrate: [200, 100, 200]
    });
    setIsMuted((isMuted) => {
      if(!isMuted) {
        audio.play();
      }
      return isMuted;
    })
    desktopNotification.onclick = function () {
      window.focus();
    }
    updateNotifications(notification);
    if(isLimited) {
      reset();
    }
  }

  const update = async () => {
    await updateCollection(collection);
    const image = collection.image_url;
    if(lowPrice && collection.stats.floor_price < lowPrice) {
      const text = `${collection.name} is below ${lowPrice} ETH`;
      createNotification(text, image);
    }
    if(highPrice && collection.stats.floor_price > highPrice) {
      const text = `${collection.name} is above ${highPrice} ETH`;
      createNotification(text, image);
    }
  }

  const reset = () => {
    setIsNotifying(false);
    setIntervalId((id) => {
      clearInterval(id);
      return null;
    });
  }

  const notify = async () => {
    if(isNotifying) {
      reset();
      return;
    }

    if(!lowPrice && !highPrice) {
      reset();
      return;
    }

    if(!("Notification" in window)) {
      setMessage('');
      setInputError('This browser does not support desktop notification');
    }

    const permission = await Notification.requestPermission();
    if(permission === 'granted') {
      setIsNotifying(true);
      setMessage(`You are now watching ${collection.name}`);
      setInputError('');
      await updateCollection(collection);
    } else {
      setMessage('');
      setInputError('Permission not granted. You must allow notifications ' +
        'for this website for the tool to work.');
    }
  }

  let renderSoundButton;
  if(isMuted) {
    renderSoundButton = <>
      <button
        className="btn btn-secondary resetButton no-focus px-2"
        onClick={handleMuteClick} >
        <FontAwesomeIcon
          icon={faVolumeMute}
          size="1x" />
      </button>
    </>
  } else {
    renderSoundButton = <>
      <button
        className="btn btn-secondary resetButton no-focus px-2"
        onClick={handleMuteClick} >
        <FontAwesomeIcon
          icon={faVolumeUp}
          size="1x" />
      </button>
    </>
  }

  let renderNotifyButton;
  if(isNotifying) {
    renderNotifyButton = <>
      <button
        className="btn btn-danger no-focus px-2"
        style={{width: '100%', fontWeight: 'bold'}}
        onClick={notify} >
        Cancel
      </button>
    </>
  } else {
    renderNotifyButton = <>
      <button
        className="btn btn-primary no-focus px-2"
        style={{width: '100%', fontWeight: 'bold'}}
        onClick={notify} >
        Notify
      </button>
    </>
  }

  return (
    <div className="mt-2">
      <div className="mx-auto pb-3 fullBox">
        <div className="row justify-content-between mx-3 collectionTitle">
          <div
            className="col d-flex align-items-center mt-3 pb-3">
            <img
              src={collection.image_url}
              alt=""
              style={{width: '35px'}} />
            <div
              className="col d-flex align-items-center ms-3"
              style={{fontSize: '24px'}}>
              {collection.name}
            </div>
          </div>
          <div
            className="col-1 mt-3"
            style={{width: 'initial'}}>
            <button
              className="btn btn-danger no-focus px-0
                d-flex align-items-center justify-content-center"
              style={{width: '34px', height: '34px'}}
              onClick={() => {
                clearInterval(intervalId);
                removeCollection(collection.id);
              }} >
              <FontAwesomeIcon
                icon={faTimes}
                size="1x" />
            </button>
          </div>
        </div>
        <div className="row justify-content-between mx-3">
          <div className="col mt-3">
            <div className="mb-1">Floor Price</div>
            <div
              className="d-flex align-items-center"
              style={{height: '38px', fontSize: '18px'}}>
              {collection.stats.floor_price} ETH
            </div>
          </div>
          <div className="col mt-3">
            <div className="mb-1">Low Price (ETH)</div>
            <div className="floorPricePlaceholder" data-placeholder="ETH">
              <input
                type="text"
                value={lowPrice}
                disabled={isNotifying}
                onChange={(e) => {
                  const val = e.target.value;
                  setLowPrice(val);
                }}
                onClick={handleLowInputClick}
                placeholder="Price"
                className="form-control input"
                style={{
                  height: '38px', width: '150px'
                }} />
            </div>
          </div>
          <div className="col mt-3">
            <div className="mb-1">High Price (ETH)</div>
            <div className="floorPricePlaceholder" data-placeholder="ETH">
              <input
                type="text"
                value={highPrice}
                disabled={isNotifying}
                onChange={(e) => {
                  const val = e.target.value;
                  setHighPrice(val);
                }}
                onClick={handleHighInputClick}
                placeholder="Price"
                className="form-control input"
                style={{
                  height: '38px', width: '150px'
                }} />
            </div>
          </div>
          <div className="col mt-3">
            <div className="mb-1">Frequency</div>
            <select
              disabled={isNotifying}
              className="form-select form-select-secondary
                form-select-disabled-dark select"
              style={{width: '180px'}}
              onChange={handleOnChange} >
              {frequencyOptions.map((option, index) => (
                <option
                  key={index}
                  value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col mt-3 d-flex align-items-end">
              {renderNotifyButton}
          </div>
          <div
            className="col-1 mt-3 d-flex align-items-end"
            style={{width: 'initial'}}>
              {renderSoundButton}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionBox;
