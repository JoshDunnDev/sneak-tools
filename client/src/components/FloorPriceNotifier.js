import {useState} from 'react';
import SubmitBox from './SubmitBox.js';
import ErrorBox from './ErrorBox.js';
import MessageBox from './MessageBox.js';
import CollectionBox from './CollectionBox.js';
import NotificationBox from './NotificationBox.js';
import ReactGa from 'react-ga';
import {collectionRequest} from '../utils/http.js';
import InstructionBoxes from './InstructionBoxes.js';

const FloorPriceNotifier = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState('');
  const [message, setMessage] = useState('');
  const [collectionData, setCollectionData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [lowError, setLowError] = useState('');
  const [highError, setHighError] = useState('');

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
    let returnedCollection;
    const {collection: updatedCollection} =
      await collectionRequest(collection.slug);
    setCollectionData((data) => {
      const index = data.findIndex(c => c.id === collection.id);
      updatedCollection.id = collection.id;
      const updatedCollectionData = [...data];
      updatedCollectionData.splice(index, 1, updatedCollection);
      returnedCollection = updatedCollection;
      return updatedCollectionData;
    })
    return returnedCollection;
  }

  const removeCollection = (id) => {
    setMessage('');
    setInputError('');
    setIsSubmitDisabled(false);
    setCollectionData(collectionData.filter((data) => data.id !== id));
  }

  const updateNotifications = (notification) => {
    setNotifications((arr) => {
      const newNotification = {...notification};
      if(arr.length > 0) {
        const lastestNotification = arr[0];
        newNotification.id = lastestNotification.id + 1;
      } else {
        newNotification.id = 1;
      }
      return [newNotification, ...arr]
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

  if(lowError) {
    renderError = <>
      <ErrorBox
        error={lowError}
        setInputError={setLowError} />
    </>
    setTimeout(() => {
      setLowError('');
    }, 5000);
  }

  if(highError) {
    renderError = <>
      <ErrorBox
        error={highError}
        setInputError={setHighError} />
    </>
    setTimeout(() => {
      setHighError('');
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

  const renderNote = <>
    <div
      className="mx-auto mt-3 p-3 instructionBox"
      style={{maxWidth: '900px', fontWeight: 'bold'}}>
      NOTE: You must keep this window open in order to receive
      notifications.
    </div>
  </>

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
          setMessage={setMessage}
          highError={highError}
          lowError={lowError}
          setHighError={setHighError}
          setLowError={setLowError} />
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
            className="col-8 text-start px-0">
              Notifications
          </h4>
          <div
            className="col mb-2 pe-0 d-flex align-items-end justify-content-end"
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
        <InstructionBoxes />
        {renderNote}
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
