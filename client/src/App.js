import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, tempValue: 0, storageValue: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.contract = new this.web3.eth.Contract(
        SimpleStorageContract.abi,
        SimpleStorageContract.networks[this.networkId] && SimpleStorageContract.networks[this.networkId].address,
      );

      // Set the state and run getter function
      this.setState({ loaded: true }, this.handleGetValue);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSetValue = async () => {
    // Set the value to the contract
    await this.contract.methods.set(this.state.tempValue).send({ from: this.accounts[0] });
    this.handleGetValue();
  }

  handleGetValue = async () => {
    // Get the value from the contract
    const response = await this.contract.methods.get().call();
    // Update state with the result.
    this.setState({ storageValue: response });
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        Set stored value: <input type="text" name="tempValue" value={this.state.tempValue} onChange={this.handleInputChange} />
        <button type="button" onClick={this.handleSetValue}>Set</button>
        <br></br>
        <br></br>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
