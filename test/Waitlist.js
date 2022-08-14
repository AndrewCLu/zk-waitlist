const { expect } = require("chai");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Waitlist contract", function () {
  async function deploy4PersonWaitlist() {
    const LockerVerifier = await ethers.getContractFactory("LockerVerifier");
    const lockerVerifier = await LockerVerifier.deploy();

    const RedeemerVerifier = await ethers.getContractFactory("RedeemerVerifierDepth2");
    const redeemerVerifier = await RedeemerVerifier.deploy();

    const Waitlist = await ethers.getContractFactory("Waitlist");
    const waitlist = await Waitlist.deploy(4, lockerVerifier.address, redeemerVerifier.address);

    return waitlist;
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const verifier = await loadFixture(
        deploy4PersonWaitlist
      );
      expect(verifier.address).to.not.equal('0x0')
    });
  });
});