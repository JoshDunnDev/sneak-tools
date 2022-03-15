import {useState} from 'react';
import SubmitBox from './SubmitBox.js';
import ErrorBox from './ErrorBox.js';
import ReactGa from 'react-ga';
import {collectionRequest} from '../utils/http.js';

const FloorPriceNotifier = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [collectionData, setCollectionData] = useState([]);

  const onClick = async () => {
    if(input) {
      ReactGa.event({
        category: 'Button',
        action: 'Floor Price Notifier Submit Button Clicked'
      });
      if(!isValidOpenseaUrl(input)) {
        return setInputError(true);
      }
      setLoading(true);
      try {
        const slug = input.split('/collection/').pop();
        console.log(slug);
        const collection = await collectionRequest(slug);
        addCollection(collection)
      } catch(e) {
        setInputError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const addCollection = (collection) => {
    const id = collectionData.length;
    const newCollection = {id, ...collection}
    setCollectionData([...collectionData, newCollection]);
  }

  const isValidOpenseaUrl = (string) => {
    return string.includes('https://opensea.io/collection/');
  }

  let renderError;
  if(inputError) {
    renderError = <>
      <ErrorBox
        error={'Please enter a valid OpenSea collection URL.'}/>
    </>
  }

  let renderCollections;
  if(collectionData) {
    console.log(collectionData);
    console.log(collectionData.length);
    renderCollections = <>
      {collectionData.map((data) => (
        <div key={data.id}>{data.collection.name}</div>
      ))}
    </>
  }

  const reset = () => {
    setInput('');
    setInputError(false);
  };

  return (
    <div className="p-3">
      <SubmitBox props={{
        title: 'Floor Price Notifier',
        placeholder: 'OpenSea Collection URL',
        buttonText: 'Add',
        inputError, loading, input,
        onClick, reset, setInput, setInputError
      }} />
      {renderError}
      {renderCollections}
    </div>
  );
};

export default FloorPriceNotifier;
