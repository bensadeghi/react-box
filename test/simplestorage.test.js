const SimpleStorage = artifacts.require("./SimpleStorage.sol");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path: "../.env"});

contract("SimpleStorage", accounts => {

  it("...should store the value 89.", async () => {
    let simpleStorageInstance = await SimpleStorage.deployed();
    await simpleStorageInstance.set(89, { from: accounts[0] });
    return expect(simpleStorageInstance.get()).to.eventually.be.a.bignumber.equal(new BN(89));
  });

});
