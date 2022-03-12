import PropTypes from 'prop-types';
import {abbrNum} from '../utils/helpers.js';

const CollectionStats = ({collectionStats}) => {


  return (
    <div className="mx-auto p-4 mt-4 fullBox">
      <div style={{display: 'flex'}}>
        <img
          className="mx-auto"
          src={collectionStats.imgUrl}
          alt=""
          style={{borderRadius: '50%', border: '2px solid'}} />
      </div>
      <h2 className="text-center mt-3">{collectionStats.name}</h2>
      <div className="container" style={{maxWidth: '600px'}}>
        <div className="row">
          <div className="col-12 col-sm mt-3">
            <div className="row">
              <div className="col">
                <h4 className="text-center mb-0">
                  {abbrNum(collectionStats.supply, 1)}
                </h4>
                <div className="text-center">Items</div>
              </div>
              <div className="col">
                <h4 className="text-center mb-0">
                  {abbrNum(collectionStats.owners, 1)}
                </h4>
                <div className="text-center">Owners</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm mt-3">
            <div className="row">
              <div className="col">
                <h4 className="text-center mb-0">
                  {Math.floor((collectionStats.floorPrice) * 1e4) / 1e4}
                </h4>
                <div className="text-center">Floor Price</div>
              </div>
              <div className="col">
                <h4 className="text-center mb-0">
                  {abbrNum(collectionStats.volume, 1)}
                </h4>
                <div className="text-center">Volume Traded</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CollectionStats.propTypes = {
  collectionStats: PropTypes.object
};

export default CollectionStats;
