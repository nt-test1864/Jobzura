import { useState } from "react";
import Link from "next/link";
import Button from "./../ui/Button";

import LinkExplorerIc from "./../icons/Explorer";
import CopyIc from "./../icons/Copy";
import CircleCheckIc from "./../icons/CircleCheck";

function AccountModel(props) {
  const currentAccount = props.currentAccount;

  const [copyText, setCopyText] = useState(false);

  function copyToClipboard(event) {
    navigator.clipboard.writeText(currentAccount);
    setCopyText(true);

    setTimeout(() => setCopyText(false), 500);
  }

  return (
    <div className="connectedAccount">
      <div className="accountBlock">
        <div className="blockTop">
          <div className="connectedWith">Connected with MetaMask</div>
          <div className="connectedActions">
            <Button classes="button rounded primary bordered small">
              Disconnect
            </Button>
          </div>
        </div>
        <div className="walletAddress">
          <div className="walletPic">
            <i></i>
          </div>
          <div className="walletID">{props.sortAddress}</div>
        </div>
        <div className="walletActions">
          {!copyText ? (
            <Button
              classes="button linkButton withIcon"
              onClick={copyToClipboard}
            >
              <i>
                <CopyIc />
              </i>
              <span>Copy Address</span>
            </Button>
          ) : (
            <Button classes="button linkButton withIcon">
              <i>
                <CircleCheckIc />
              </i>
              <span>Copied</span>
            </Button>
          )}
          <Link
            href={"https://polygonscan.com/address/" + currentAccount}
            passHref
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="button linkButton withIcon"
            >
              <i>
                <LinkExplorerIc size={18} />
              </i>
              <span>View on Explorer</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccountModel;
