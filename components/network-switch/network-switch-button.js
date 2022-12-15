import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { IconContext } from "react-icons";
import { HandleNetworkSwitch } from '../../JS/local_web3_Moralis';
import Image from 'next/image'
import eth_icon from "../../public/images/eth.png"; // png
import bsc_icon from "../../public/images/bnb.png";
import polygon_icon from "../../public/images/polygon.svg";
import { IoIosGitNetwork } from "react-icons/io";


class NetworkSwitchButton extends React.Component {
  constructor() {
    super();

    this.state = {
      dropDownValue: /* "Switch Network"  */

        <IconContext.Provider
          value={{ size: '23px' }}
        >
          <div className='networkSwitch'>
            <IoIosGitNetwork />
            <span>Switch Network</span>
          </div>
        </IconContext.Provider>
    }
  }

  changeValue(text) {
    this.setState({ dropDownValue: text })
  }

  render() {
    return (
      <Menu as="div" className="menu">
        {/**
              <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            */}
        <Menu.Button className="menuButton">

          {this.state.dropDownValue == "Ethereum" ?
            <Image src={eth_icon} height={20} width={20} alt="" />
            : ""}

          {this.state.dropDownValue == "Polygon" ?
            <Image src={polygon_icon} height={20} width={20} alt="" />
            : ""}

          {this.state.dropDownValue == "BSC" ?
            <Image src={bsc_icon} height={20} width={20} alt="" />
            : ""}

          {this.state.dropDownValue}
          {/*  this.state.dropDownValue   */   /** add this if you want to display the name of the selected network next to the icon */}
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="menuItems">
            <div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={async (e) => await HandleNetworkSwitch("homestead") && this.changeValue(e.target.textContent)}
                  >
                    <Image src={eth_icon} height={20} width={20} alt="" />
                    <span>Ethereum</span>
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={async (e) => await HandleNetworkSwitch("polygon") && this.changeValue(e.target.textContent)}
                  >
                    <Image src={polygon_icon} height={20} width={20} alt="" />
                    <span>Polygon</span>
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={async (e) => await HandleNetworkSwitch("bsc") && this.changeValue(e.target.textContent)}
                  >
                    <Image src={bsc_icon} height={20} width={20} alt="" />
                    <span>BSC</span>
                  </button>
                )}
              </Menu.Item>

            </div>

          </Menu.Items>
        </Transition>
      </Menu>
    );
  }
}
export default NetworkSwitchButton;