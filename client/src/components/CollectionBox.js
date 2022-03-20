import {useState, useEffect} from 'react';
import ReactGa from 'react-ga';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/fontawesome-free-solid';
import {faVolumeMute, faVolumeUp} from '@fortawesome/free-solid-svg-icons';
import logo from '../images/SAL_Logo.png';
import audioFile from '../audio/definite-555.mp3';
import {round} from '../utils/helpers.js';

const CollectionBox = ({
  collection, updateCollection, removeCollection, updateNotifications,
  setInputError, setMessage, setLowError, setHighError, lowError, highError
}) => {
  const [lowPrice, setLowPrice] = useState('');
  const [highPrice, setHighPrice] = useState('');
  const [intervalId, setIntervalId] = useState(null);
  const [isNotifying, setIsNotifying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [frequency, setFrequency] = useState(60000);
  const [isLimited, setIsLimited] = useState(true);

  const frequencyOptions = [
    {label: 'Only Once', value: 60000},
    {label: 'Every Minute', value: 60000},
    {label: 'Every Hour', value: 3600000},
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

  const handleNameClick = (slug) => {
    window.open(`https://opensea.io/collection/${slug}`, '_blank')
  }

  const createNotification = (text, image, floorPrice) => {
    const notification = {
      image,
      text,
      floorPrice,
      time: new Date().toLocaleTimeString()
    }
    let desktopNotification;
    if(!("Notification" in window)) {
      desktopNotification = new Notification(notification.text, {
        icon: logo,
        timestamp: notification.time,
        vibrate: [200, 100, 200]
      });
    }
    setIsMuted((isMuted) => {
      if(!isMuted) {
        audio.play();
      }
      return isMuted;
    })
    if(desktopNotification) {
      desktopNotification.onclick = function () {
        window.focus();
      }
    }
    updateNotifications(notification);
    if(isLimited) {
      reset();
    }
  }

  const update = async () => {
    const updatedCollection = await updateCollection(collection);
    const image = updatedCollection.image_url;
    if(lowPrice && updatedCollection.stats.floor_price < lowPrice) {
      const text = `${updatedCollection.name} is below
        ${round(lowPrice, 1e4)} ETH`;
      createNotification(text, image, updatedCollection.stats.floor_price);
    }
    if(highPrice && updatedCollection.stats.floor_price > highPrice) {
      const text = `${updatedCollection.name} is above
        ${round(highPrice, 1e4)} ETH`;
      createNotification(text, image, updatedCollection.stats.floor_price);
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

    if((!lowPrice && !highPrice)) {
      reset();
      return;
    }

    if(isNaN(lowPrice)) {
      reset();
      setLowError('Low Price must be a number.');
      return;
    }

    if(isNaN(highPrice)) {
      reset();
      setHighError('High Price must be a number.');
      return;
    }

    if(lowPrice && lowPrice > collection.stats.floor_price) {
      reset();
      setLowError('Low Price cannot be above floor price.');
      return;
    }

    if(highPrice && highPrice < collection.stats.floor_price) {
      reset();
      setHighError('High Price cannot be below floor price.');
      return;
    }

    if(!("Notification" in window)) {
      setIsNotifying(true);
      setMessage(`You are now watching ${collection.name}`);
      setInputError('This browser does not support desktop notifications but ' +
        'notifications will be available on this page.');
      return updateCollection(collection);
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

  let lowClasses;
  if(lowError) {
    lowClasses = 'form-control input priceInput errorInput';
  } else {
    lowClasses = 'form-control input priceInput';
  }

  let highClasses;
  if(highError) {
    highClasses = 'form-control input priceInput errorInput';
  } else {
    highClasses = 'form-control input priceInput';
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
              className="d-none d-sm-block"
              style={{width: '35px'}} />
            <div
              className="d-flex align-items-center ms-0 ms-sm-3 collectionName"
              onClick={() => {
                handleNameClick(collection.slug);
              }}>
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
                size="1x"
                style={{width: '12px'}} />
            </button>
          </div>
        </div>
        <div className="row justify-content-between mx-3">
          <div className="col-12 col-md-2 mt-3 pe-md-1 pe-lg-2">
            <div className="mb-1">Floor Price</div>
            <div
              className="d-flex align-items-center"
              style={{height: '38px', fontSize: '18px'}}>
              {round(collection.stats.floor_price, 1e4)} ETH
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md mt-3 pe-sm-2 px-md-1 px-lg-2">
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
                className={lowClasses} />
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md mt-3 ps-sm-2 px-md-1 px-lg-2">
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
                className={highClasses} />
            </div>
          </div>
          <div className="col mt-3 px-md-1 px-lg-2">
            <div className="mb-1">Frequency</div>
            <select
              disabled={isNotifying}
              className="form-select form-select-secondary
                form-select-disabled-dark select frequencySelect"
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
          <div className="col-12 col-md mt-3 d-flex
            align-items-end order-last order-md-0 px-md-1 px-lg-2">
              {renderNotifyButton}
          </div>
          <div
            className="col-1 mt-3 d-flex align-items-end ps-1 ps-lg-2"
            style={{width: 'initial'}}>
              {renderSoundButton}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionBox;
