import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import MobileMenuIc from "../icons/MobileMenu";
import OrdersRowsSeller from "./OrdersRows-seller";

const MultiTabsSeller = (props) => {
  const { agreements } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [tabListOpen, setTabListOpen] = useState(false);
  const numberOfAgreements = agreements?.length;
  const agreementId = agreements?.map((agreement) => agreement.name.JobId);

  // getting each state of the agreement to display the counter on the tabs
  const completeOrders = agreements?.filter(
    (agreement) => agreement.name.State === "complete"
  );
  const completeOrdersCount = completeOrders?.length;

  const inProgressOrders = agreements?.filter(
    (agreement) => agreement.name.State === "in progress"
  );
  const inProgressOrdersCount = inProgressOrders?.length;

  const waitingConfirmationOrders = agreements?.filter(
    (agreement) => agreement.name.State === "buyer_initialized_and_paid"
  );
  const waitingConfirmationOrdersCount = waitingConfirmationOrders?.length;

  const inDisputeOrders = agreements?.filter(
    (agreement) => agreement.name.State === "in dispute"
  );
  const inDisputeOrdersCount = inDisputeOrders?.length;

  const cancelledOrders = agreements?.filter(
    (agreement) => agreement.name.State === "canceled"
  );
  const cancelledOrdersCount = cancelledOrders?.length;

  // Responsive TabList function
  function tabListHandler() {
    setTabListOpen(!tabListOpen);
  }

  return (
    <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
      <div className="tableNav">
        <div className="wrapper relative">
          <TabList
            className={`tabList-ul ${tabListOpen ? "showFullList" : ""}`}
          >
            <Tab className="tabList-li" selectedClassName="active">
              <h3>Waiting Confirmation</h3>
              {waitingConfirmationOrdersCount > 0 ? (
                <span>{waitingConfirmationOrdersCount}</span>
              ) : (
                <span>0</span>
              )}
            </Tab>
            <Tab className="tabList-li" selectedClassName="active">
              <h3>Active</h3>
              {inProgressOrdersCount > 0 ? (
                <span>{inProgressOrdersCount}</span>
              ) : (
                <span>0</span>
              )}
            </Tab>
            <Tab className="tabList-li" selectedClassName="active">
              <h3>Complete</h3>
              {completeOrdersCount > 0 ? (
                <span>{completeOrdersCount}</span>
              ) : (
                <span>0</span>
              )}
            </Tab>
            <Tab className="tabList-li" selectedClassName="active">
              <h3>Dispute</h3>
              {inDisputeOrdersCount > 0 ? (
                <span>{inDisputeOrdersCount}</span>
              ) : (
                <span>0</span>
              )}
            </Tab>
            <Tab className="tabList-li" selectedClassName="active">
              <h3>Cancelled</h3>
              {cancelledOrdersCount > 0 ? (
                <span>{cancelledOrdersCount}</span>
              ) : (
                <span>0</span>
              )}
            </Tab>
            <Tab className="tabList-li" selectedClassName="active">
              <h3>All</h3>
              {numberOfAgreements > 0 ? (
                <span>{numberOfAgreements}</span>
              ) : (
                <span>0</span>
              )}
            </Tab>
          </TabList>

          <div className="mobileTabListTrigger">
            <i>
              <MobileMenuIc onClick={tabListHandler} />
            </i>
          </div>
        </div>
      </div>

      <div className="wrapper">
        <div className="tableContainer ordersTableGrid">
          <TabPanel>
            <div className="tableGridUi">
              <table width="100%" cellSpacing="0" cellPadding="0" border="0">
                <thead>
                  <tr>
                    <th colSpan="7" align="left">
                      <h3>Waiting Orders</h3>
                    </th>
                  </tr>
                  <tr className="subHeader">
                    <th align="left">Order</th>
                    <th align="left">Buyer</th>
                    <th align="left">Order date</th>
                    <th align="left">Due on</th>
                    <th align="left">Price</th>
                    <th align="left">Status</th>
                    <th align="left"></th>
                  </tr>
                </thead>
                <tbody>
                  {agreements?.map((agreement, index) => (
                    <>
                      {agreement.name.State === "buyer_initialized_and_paid" && (
                        <OrdersRowsSeller
                          key={index}
                          agreement={agreement}
                          showModal={showModal}
                          setShowModal={setShowModal}
                        />
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>



          <TabPanel>
            <div className="tableGridUi">
              <table width="100%" cellSpacing="0" cellPadding="0" border="0">
                <thead>
                  <tr>
                    <th colSpan="7" align="left">
                      <h3>Active Orders</h3>
                    </th>
                  </tr>
                  <tr className="subHeader">
                    <th align="left">Order</th>
                    <th align="left">Buyer</th>
                    <th align="left">Order date</th>
                    <th align="left">Due on</th>
                    <th align="left">Price</th>
                    <th align="left">Status</th>
                    <th align="left"></th>
                  </tr>
                </thead>
                <tbody>
                  {agreements?.map((agreement, index) => (
                    <>
                      {agreement.name.State === "in progress" && (
                        <OrdersRowsSeller key={index} agreement={agreement} />
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tableGridUi">
              <table width="100%" cellSpacing="0" cellPadding="0" border="0">
                <thead>
                  <tr>
                    <th colSpan="7" align="left">
                      <h3>Complete Orders</h3>
                    </th>
                  </tr>
                  <tr className="subHeader">
                    <th align="left">Order</th>
                    <th align="left">Buyer</th>
                    <th align="left">Order date</th>
                    <th align="left">Due on</th>
                    <th align="left">Price</th>
                    <th align="left">Status</th>
                    <th align="left"></th>
                  </tr>
                </thead>
                <tbody>
                  {agreements?.map((agreement, index) => (
                    <>
                      {agreement.name.State === "complete" && (
                        <OrdersRowsSeller key={index} agreement={agreement} />
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tableGridUi">
              <table width="100%" cellSpacing="0" cellPadding="0" border="0">
                <thead>
                  <tr>
                    <th colSpan="7" align="left">
                      <h3>Dispute Orders</h3>
                    </th>
                  </tr>
                  <tr className="subHeader">
                    <th align="left">Order</th>
                    <th align="left">Buyer</th>
                    <th align="left">Order date</th>
                    <th align="left">Due on</th>
                    <th align="left">Price</th>
                    <th align="left">Status</th>
                    <th align="left"></th>
                  </tr>
                </thead>
                <tbody>
                  {agreements?.map((agreement, index) => (
                    <>
                      {agreement.name.State === "in dispute" && (
                        <OrdersRowsSeller key={index} agreement={agreement} />
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tableGridUi">
              <table width="100%" cellSpacing="0" cellPadding="0" border="0">
                <thead>
                  <tr>
                    <th colSpan="7" align="left">
                      <h3>Cancelled Orders</h3>
                    </th>
                  </tr>
                  <tr className="subHeader">
                    <th align="left">Order</th>
                    <th align="left">Buyer</th>
                    <th align="left">Order date</th>
                    <th align="left">Due on</th>
                    <th align="left">Price</th>
                    <th align="left">Status</th>
                    <th align="left"></th>
                  </tr>
                </thead>
                <tbody>
                  {agreements?.map((agreement, index) => (
                    <>
                      {agreement.name.State === "canceled" && (
                        <OrdersRowsSeller key={index} agreement={agreement} />
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="tableGridUi">
              <table width="100%" cellSpacing="0" cellPadding="0" border="0">
                <thead>
                  <tr>
                    <th colSpan="7" align="left">
                      <h3>All Orders</h3>
                    </th>
                  </tr>
                  <tr className="subHeader">
                    <th align="left">Order</th>
                    <th align="left">Buyer</th>
                    <th align="left">Order date</th>
                    <th align="left">Due on</th>
                    <th align="left">Price</th>
                    <th align="left">Status</th>
                    <th align="left"></th>
                  </tr>
                </thead>
                <tbody>
                  {agreements?.map((agreement, index) => (
                    <OrdersRowsSeller key={index} agreement={agreement} />
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>
        </div>
      </div>
    </Tabs>
  );
};

export default MultiTabsSeller;
