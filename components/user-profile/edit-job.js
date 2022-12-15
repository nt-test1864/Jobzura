import { useState } from "react";
import Button from "../ui/Button";

function EditJob(props) {
  const { item, saveJobDetailFn, closeModelFn } = props;

  const [title,setTitle] = useState(item.name.Title);
  const [description, setDescription] = useState(item.name.Description);
  const [price,setPrice] = useState(item.name.Price);
  const [timeToDeliver, setTimeToDeliver] = useState(item.name.TimeToDeliver);
  const jobLink = item.name.JobId;

  const [errorTitle, setErrorTitle] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorPrice, setErrorPrice] = useState(false);
  const [errorTimeToDeliver, setErrorTimeToDeliver] = useState(false);

  const handleSaveHadline = () => {
    if (title) {
      setErrorTitle(false);
    } else {
      setErrorTitle(true);
    }
    
    if(description){
      setErrorDescription(false);
    }else{
      setErrorDescription(true);
    }

    if(price){
      setErrorPrice(false);
    }else{
      setErrorPrice(true);
    }

    if(timeToDeliver!='' && timeToDeliver!=undefined){
      setErrorTimeToDeliver(false);
    }else{
      setErrorTimeToDeliver(true);
      timeToDeliver='-';
    }

    if(!errorTitle && !errorDescription && !errorPrice && !errorTimeToDeliver){
      saveJobDetailFn(title,description,price,timeToDeliver);
      // setUserHeadline(iptval);
    }
  };

  return (
    <div>
      <div>
        <label>Job title</label>
        <input
          type="text"
          className="formControl"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errorTitle === true && (
          <div className="errorText mt-5">Job title should not be empty.</div>
        )}
      </div>

      <div className="mt-10">
        <label>Job price</label>
        <input
          type="text"
          className="formControl"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errorPrice === true && (
          <div className="errorText mt-5">Job price should not be empty.</div>
        )}
      </div>

      <div className="mt-10">
        <label>Time to deliver</label>
        <input
          type="text"
          className="formControl"
          value={timeToDeliver}
          onChange={(e) => setTimeToDeliver(e.target.value)}
        />
        {errorTimeToDeliver === true && (
          <div className="errorText mt-5">Job time to deliver should not be empty.</div>
        )}
      </div>

      <div className="mt-10">
        <label>Job description</label>
        <textarea
          rows="8"
          className="formControl textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errorDescription === true && (
          <div className="errorText mt-5">Job description should not be empty.</div>
        )}
      </div>

      <div className="editActions">
        <Button classes="button dark small" onClick={handleSaveHadline}>
          Save Changes
        </Button>
        <Button classes="button default small" onClick={closeModelFn}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default EditJob;