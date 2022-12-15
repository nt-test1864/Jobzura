import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import MobileMenuIc from "../icons/MobileMenu";
import Button from "../ui/Button";
import JobsRowsSeller from "./JobsRows-seller";

const JobsTabsSeller = (props) => {
  const { agreements } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [tabListOpen, setTabListOpen] = useState(false);
  const numberOfAgreements = agreements?.length;

  const options = [
    { value: "LastYear", label: "Last 1 Year" },
    { value: "Last6Months", label: "Last 6 Months" },
    { value: "Last30Days", label: "Last 30 Days" },
    { value: "LastWeek", label: "Last Week" },
  ];

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  // getting each state of the agreement to display the counter on the tabs
  // const completeOrders = agreements?.filter(
  //   (agreement) => agreement.name.State === "complete"
  // );
  // const completeOrdersCount = completeOrders?.length;

  // const inProgressOrders = agreements?.filter(
  //   (agreement) => agreement.name.State === "in progress"
  // );
  // const inProgressOrdersCount = inProgressOrders?.length;

  // const activeOrders = agreements?.filter(
  //   (agreement) => agreement.name.State === "buyer_initialized_and_paid"
  // );
  // const activeOrdersCount = activeOrders?.length;

  // const inDisputeOrders = agreements?.filter(
  //   (agreement) => agreement.name.State === "in dispute"
  // );
  // const inDisputeOrdersCount = inDisputeOrders?.length;

  // const cancelledOrders = agreements?.filter(
  //   (agreement) => agreement.name.State === "canceled"
  // );
  // const cancelledOrdersCount = cancelledOrders?.length;

  // Responsive TabList function
  function tabListHandler() {
    setTabListOpen(!tabListOpen);
  }

  return (
    <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
      <div className="wrapper">
        <div className="tableContainer jobsTableGrid">
          <TabPanel>
            <div className="tableGridUi">
              <table width="100%" cellSpacing="0" cellPadding="0" border="0">
                <thead>
                  <tr>
                    <th
                      colSpan="7"
                      align="left"
                      className="tableGridHeaderWithActions"
                    >
                      <div className="tableGridHeader">
                        <div className="tableHeaderTitle">
                          <h3>All Jobs</h3>
                        </div>
                        <div className="tableHeaderActions">
                          <Button link="/seller/jobs/create-job" classes="button dark">
                            Create a Job
                          </Button>
                        </div>
                      </div>
                    </th>
                  </tr>
                  <tr className="subHeader">
                    <th align="left">Jobs</th>
                    <th align="left">Orders</th>
                    <th align="left">Cancellations</th>
                    <th align="left"></th>
                  </tr>
                </thead>
                <tbody>
                  {agreements?.map((agreement, index) => (
                    <JobsRowsSeller key={index} agreement={agreement} />
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
                      <h3>Pending Approval Jobs</h3>
                    </th>
                  </tr>
                  <tr className="subHeader">
                    <th align="left">Jobs</th>
                    <th align="left">Orders</th>
                    <th align="left">Cancellations</th>
                    <th align="left"></th>
                  </tr>
                </thead>
                <tbody>
                  {agreements?.map((agreement, index) => (
                    <JobsRowsSeller key={index} agreement={agreement} />
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
                      <h3>Requires Modification Jobs</h3>
                    </th>
                  </tr>
                  <tr className="subHeader">
                    <th align="left">Jobs</th>
                    <th align="left">Orders</th>
                    <th align="left">Cancellations</th>
                    <th align="left"></th>
                  </tr>
                </thead>
                <tbody>
                  {agreements?.map((agreement, index) => (
                    <JobsRowsSeller key={index} agreement={agreement} />
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
                      <h3>Draft Jobs</h3>
                    </th>
                  </tr>
                  <tr className="subHeader">
                    <th align="left">Jobs</th>
                    <th align="left">Orders</th>
                    <th align="left">Cancellations</th>
                    <th align="left"></th>
                  </tr>
                </thead>
                <tbody>
                  {agreements?.map((agreement, index) => (
                    <JobsRowsSeller key={index} agreement={agreement} />
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
                      <h3>Denied Jobs</h3>
                    </th>
                  </tr>
                  <tr className="subHeader">
                    <th align="left">Jobs</th>
                    <th align="left">Orders</th>
                    <th align="left">Cancellations</th>
                    <th align="left"></th>
                  </tr>
                </thead>
                <tbody>
                  {agreements?.map((agreement, index) => (
                    <JobsRowsSeller key={index} agreement={agreement} />
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

export default JobsTabsSeller;
