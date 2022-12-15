import { useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import Link from "next/link";
import Button from "../ui/Button";
import useOutsideClick from "../useOutsideClick";

function JobsRowsSeller(props) {
  const { agreement } = props;
  const [showModal, setShowModal] = useState(false);

  const jobLink = agreement.name.JobId;

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const moreOptionsRef = useRef();
  useOutsideClick(moreOptionsRef, () => {
    if (moreOptionsRef) setShowModal(false);
  });


  const deleteJob = async () => {
    const response = await fetch(`/api/general/deleteJob?jobID=${agreement.name.JobId}`);
    const data = await response.json();
    console.log(data);
  };

  return (
    <tr>
      <td align="left">
        <Link href={`/job/${agreement.name.JobId}`}>
          <div className="jobDetails" style={{ cursor: 'pointer'}}>
            {agreement.name.ImageLinks?.length > 0 ? (
              <img 
                src={agreement?.name?.ImageLinks} 
                alt="job" 
                style={{
                  width: '55px',
                  height: '42px',
                  marginRight: '10px',
                }}
              />
              ) : (
                <div
                  style={{
                    width: '55px',
                    height: '40px',
                    backgroundColor: '#D9D9D9',
                  }}></div>
              )
            }
            <div className="jobSortInfo">
              <h3>{agreement.name.Title}</h3>
              <p>{agreement.name.Description}</p>
            </div>
          </div>
        </Link>
      </td>
      <td align="left">
        <label className="mobileLabel">Orders</label>
        {
          // number of orders
        }
        0
      </td>
      <td align="left">
        <label className="mobileLabel">Cancellations</label>
        0%
      </td>
      <td align="right" ref={moreOptionsRef}>
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button classes="button dark" link={`/edit-job/${jobLink}`}>Edit Job</Button>
          {agreement.id && (
            <Button onClick={handleModal} classes="button bordered default moreButton ml-10">
              <FiMoreVertical
                style={{
                  fontSize: "1.2rem",
                  color: "grey",
                  cursor: "pointer",
                }}
                />
              {showModal ? (
                <div className="moreOptionDropdown">
                  <span
                    onClick={() => {
                      deleteJob();
                      console.log(`delete ${agreement.name.JobId}`);
                    }}
                    >Delete job</span>
                </div>
              ) : null}
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default JobsRowsSeller;
