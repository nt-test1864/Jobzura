import { BsPerson } from 'react-icons/bs'
import Moment from 'react-moment';

const Sidebar = (props) => {
  const { contractDetails, currentAccount } = props;
  const lowerCaseCurrentAccount = currentAccount?.toLowerCase();

  const Seller = contractDetails?.SellerWallet?.stringValue;
  const Buyer = contractDetails?.BuyerWallet?.stringValue;

  const truncateSeller = Seller?.substring(0, 6) + "..." + Seller?.substring(38, 42);
  const truncateBuyer = Buyer?.substring(0, 6) + "..." + Buyer?.substring(38, 42);

  const Description = contractDetails?.Description?.stringValue;
  const Title = contractDetails?.Title?.stringValue;
  const orderBought = contractDetails?.createdAt?.stringValue;
  const orderState = contractDetails?.State?.stringValue;

  const TimeToDeliver = contractDetails?.TimeToDeliver?.stringValue;
  const createdAt = contractDetails?.createdAt?.stringValue;
  const date = new Date(createdAt);
  const dueOn = new Date(date.getTime() + TimeToDeliver * 24 * 60 * 60 * 1000);

  return (
    <div className="sidebar">
      <div className="sidebarContainer">
        <div className="sidebarHeader">
          <h2>Order Details</h2>
          <div className="sidebarDetails">
            <div className="sidebarThumb"></div>
            <h3>{Title}</h3>
          </div>
        </div>

        <div className="sidebarInfos">
          <div className="row">
            <div className="left">
              <BsPerson 
                size={18}
                color="#000000"
              />
              <label>Seller</label>
            </div>

            <div className="right">
              <span>{truncateSeller}</span>
            </div>
          </div>
          <div className="row">
            <div className="left">
              <BsPerson 
                size={18}
                color="#000000"
              />
              <label>Buyer</label>
            </div>

            <div className="right">
              <span>{truncateBuyer}</span>
            </div>
          </div>
        </div>
        
        <div className="sidebarInfos">
          <div className="row">
            <div className="left">
              <BsPerson 
                size={18}
                color="#000000"
              />
              <label>Buyer bought</label>
            </div>

            <div className="right">
              <Moment 
                format="DD MMM YYYY"
                date={orderBought}
              />
            </div>
          </div>
          <div className="row">
            <div className="left">
              <BsPerson 
                size={18}
                color="#000000"
              />
              <label>Seller accepted</label>
            </div>

            <div className="right">
            <Moment 
              format="DD MMM YYYY"
              date={dueOn}
            />
            </div>
          </div>
          <div className="row">
            <div className="left">
              <BsPerson 
                size={18}
                color="#000000"
              />
              <label>Order state</label>
            </div>

            <div className="right">
              <span>{orderState}</span>
            </div>
          </div>
          {/* <div className="row">
            <div className="left">
              <BsPerson 
                size={18}
                color="#000000"
              />
              <label>Dispute started</label>
            </div>

            <div className="right">
              <span>14 Sep 2022</span>
            </div>
          </div> */}
        </div>

        <div className="sidebarInfos">
          <h3>Description</h3>
          <p>
            {Description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar