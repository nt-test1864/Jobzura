import React from "react";
import PlaceholderIc from "./../icons/Placeholder";

function JobStep3(props) {
  const { selectedJobImages } = props;
  
  return (
    <div>
      <div className="formRow">
        <div className="formCol">
          <h3>Images (up to 5)</h3>
          <p>Get noticed by the right buyers with visual examples of your services.</p>

          <div className="jobImagesGallery">
            <div className="jobImageBlock">
              <div className="jobImageBlockInner">
                <label htmlFor="jobImg1">
                  <i>
                    <PlaceholderIc />
                  </i>
                  <span>Browse</span>
                </label>
                <input type="file" id="jobImg1" />
              </div>
            </div>

            <div className="jobImageBlock">
              <div className="jobImageBlockInner">
                <label htmlFor="jobImg1">
                  <i>
                    <PlaceholderIc />
                  </i>
                  <span>Browse</span>
                </label>
                <input type="file" id="jobImg1" />
              </div>
            </div>

            <div className="jobImageBlock">
              <div className="jobImageBlockInner">
                <label htmlFor="jobImg1">
                  <i>
                    <PlaceholderIc />
                  </i>
                  <span>Browse</span>
                </label>
                <input type="file" id="jobImg1" />
              </div>
            </div>

            <div className="jobImageBlock">
              <div className="jobImageBlockInner">
                <label htmlFor="jobImg1">
                  <i>
                    <PlaceholderIc />
                  </i>
                  <span>Browse</span>
                </label>
                <input type="file" id="jobImg1" />
              </div>
            </div>

            <div className="jobImageBlock">
              <div className="jobImageBlockInner">
                <label htmlFor="jobImg1">
                  <i>
                    <PlaceholderIc />
                  </i>
                  <span>Browse</span>
                </label>
                <input type="file" id="jobImg1" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default JobStep3;
