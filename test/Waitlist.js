const { expect } = require("chai");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const EXAMPLE_COMMITMENT_1 = ethers.BigNumber.from("4382392797704465458689681080471165211673027182585861305038077659483609552615");  // For secret = 69
const EXAMPLE_COMMITMENT_2 = ethers.BigNumber.from("20303228544014408986638054140612126360870850460569288868228966842779811868675"); // For secret = 420
const EXAMPLE_COMMITMENT_3 = ethers.BigNumber.from("21149050476190125938046049458349759246088194254482667782552195612071171355023"); // For secret = 42069
const EXAMPLE_COMMITMENT_4 = ethers.BigNumber.from("7520705075767269653587126815629426321631492132326730479313166771059204398235");  // For secret 69420
const exampleCommitments = [EXAMPLE_COMMITMENT_1, EXAMPLE_COMMITMENT_2, EXAMPLE_COMMITMENT_3, EXAMPLE_COMMITMENT_4];

describe("Waitlist contract", function () {
  async function deploy4PersonWaitlist() {
    const signers = await ethers.getSigners();
    const LockerVerifier = await ethers.getContractFactory("LockerVerifier");
    const lockerVerifier = await LockerVerifier.deploy();

    const RedeemerVerifier = await ethers.getContractFactory("RedeemerVerifierDepth2");
    const redeemerVerifier = await RedeemerVerifier.deploy();

    const Waitlist = await ethers.getContractFactory("Waitlist");
    const waitlist = await Waitlist.deploy(4, lockerVerifier.address, redeemerVerifier.address);

    return { signers, waitlist };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const {signers, waitlist} = await loadFixture(
        deploy4PersonWaitlist
      );

      expect(waitlist.address).to.not.equal('0x0');
      expect(await waitlist.maxWaitlistSpots()).to.equal(4);
    });
  });

  describe("Join", function () {
    it("Should allow a user to join an empty waitlist", async function () {
      const {signers, waitlist} = await loadFixture(
        deploy4PersonWaitlist
      );

      const joinResult = await waitlist.callStatic.join(1)
      expect(joinResult).to.equal(true);
    });
  })
});