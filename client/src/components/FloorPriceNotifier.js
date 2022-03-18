import {useState} from 'react';
import SubmitBox from './SubmitBox.js';
import ErrorBox from './ErrorBox.js';
import MessageBox from './MessageBox.js';
import CollectionBox from './CollectionBox.js';
import NotificationBox from './NotificationBox.js';
import ReactGa from 'react-ga';
import {collectionRequest} from '../utils/http.js';

const FloorPriceNotifier = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState('');
  const [message, setMessage] = useState('');
  const [collectionData, setCollectionData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const onClick = async () => {
    if(input) {
      ReactGa.event({
        category: 'Button',
        action: 'Floor Price Notifier Submit Clicked'
      });
      if(!isValidOpenseaUrl(input)) {
        setMessage('');
        return setInputError('Please enter a valid OpenSea collection URL.');
      }
      if(collectionData.length === 3) {
        setMessage('');
        return setInputError('You can only watch 3 collections at a time. ' +
          'Please remove one in order to add another.');
      }
      setLoading(true);
      try {
        const slug = input.split('/collection/').pop();
        if(collectionData.find((data) => data.slug === slug)) {
          setMessage('');
          return setInputError('You are already watching this collection.');
        }
        const {collection} = await collectionRequest(slug);
        addCollection(collection)
      } catch(e) {
        setMessage('');
        setInputError('An error occuring when adding this collection. Please ' +
          'try again.');
      } finally {
        setLoading(false);
        setInput('');
      }
    }
  };

  const handleClearAll = () => {
    ReactGa.event({
      category: 'Link',
      action: 'Clear All Clicked'
    });
    setNotifications([]);
  }

  const addCollection = (collection) => {
    const id = collectionData.length;
    const newCollection = {id, ...collection}
    if(collectionData.length === 2) {
      setIsSubmitDisabled(true);
    }
    setCollectionData([newCollection, ...collectionData]);
  }

  const updateCollection = async (collection) => {
    const index = collectionData.indexOf(collection.id);
  }

  const removeCollection = (id) => {
    setMessage('');
    setInputError('');
    setIsSubmitDisabled(false);
    setCollectionData(collectionData.filter((data) => data.id !== id));
  }

  const updateNotifications = (notification) => {
    setNotifications((arr) => {
      notification.id = arr.length;
      return [notification, ...arr]
    });
  }

  const removeNotification = (id) => {
    setNotifications(notifications.filter((data) => data.id !== id));
  }

  const isValidOpenseaUrl = (string) => {
    return string.includes('https://opensea.io/collection/');
  }

  let renderError;
  if(inputError) {
    renderError = <>
      <ErrorBox
        error={inputError}
        setInputError={setInputError} />
    </>
    setTimeout(() => {
      setInputError('');
    }, 5000);
  }

  let renderMessage;
  if(message) {
    renderError = <>
      <MessageBox
        message={message}
        setMessage={setMessage} />
    </>
    setTimeout(() => {
      setMessage('');
    }, 5000);
  }

  let renderCollections;
  let inputPlaceholder;
  let renderNotifications;
  let renderInstructions;
  if(collectionData.length > 0) {
    inputPlaceholder = 'Add Another OpenSea Collection URL'
    renderCollections = <>
      <h4
        className="text-left mx-auto mt-4"
        style={{maxWidth: '900px'}}>
          Collections
      </h4>
      {collectionData.map((collection) => (
        <CollectionBox
          key={collection.id}
          collection={collection}
          removeCollection={removeCollection}
          updateCollection={updateCollection}
          updateNotifications={updateNotifications}
          setInputError={setInputError}
          setMessage={setMessage} />
      ))}
    </>

    let renderNotificationData;
    if(notifications.length > 0) {
      renderNotificationData = <>
        {notifications.map((notification) => (
          <NotificationBox
            key={notification.id}
            notification={notification}
            removeNotification={removeNotification}
          />
        ))}
      </>
    } else {
      renderNotificationData = <>
        <div className="m-3">No notifications</div>
      </>
    }
    renderNotifications = <>
      <div className="mt-4">
        <div
          className="row mx-auto"
          style={{maxWidth: '900px'}}>
          <h4
            className="col text-start">
              Notifications
          </h4>
          <div
            className="col mb-2 d-flex align-items-end justify-content-end"
            style={{textDecoration: 'underline', cursor: 'pointer'}}
            onClick={handleClearAll}>
            Clear All
          </div>
        </div>
        <div
          className="mx-auto fullBox mt-2"
          style={{maxHeight: '400px', overflow: 'auto'}}>
            {renderNotificationData}
        </div>
      </div>
    </>
  } else {
    inputPlaceholder = 'OpenSea Collection URL'
    renderInstructions = <>
      <div className="mt-4">
        <h4
          className="text-left mx-auto"
          style={{maxWidth: '900px'}}>
            Instructions
        </h4>
        <div></div>
      </div>
    </>
  }
  if(collectionData.length === 3) {
    inputPlaceholder = 'You have added the maximum amount.'
  }

  return (
    <div className="p-3">
      <SubmitBox props={{
        title: 'Floor Price Notifier',
        placeholder: inputPlaceholder,
        buttonText: 'Add',
        inputError, loading, input, isSubmitDisabled,
        onClick, setInput, setInputError, setMessage
      }} />
      {renderMessage}
      {renderError}
      {renderInstructions}
      {renderCollections}
      {renderNotifications}
    </div>
  );
};

export default FloorPriceNotifier;
