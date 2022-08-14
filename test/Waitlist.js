const { expect } = require("chai");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const EXAMPLE_COMMITMENT_1 = ethers.BigNumber.from("4382392797704465458689681080471165211673027182585861305038077659483609552615");  // For secret = 69
const EXAMPLE_COMMITMENT_2 = ethers.BigNumber.from("20303228544014408986638054140612126360870850460569288868228966842779811868675"); // For secret = 420
const EXAMPLE_COMMITMENT_3 = ethers.BigNumber.from("21149050476190125938046049458349759246088194254482667782552195612071171355023"); // For secret = 42069
const EXAMPLE_COMMITMENT_4 = ethers.BigNumber.from("7520705075767269653587126815629426321631492132326730479313166771059204398235");  // For secret = 69420
const EXAMPLE_COMMITMENT_5 = ethers.BigNumber.from("4062130046788682276592684126400580992160311099061031008181023682089773591896");  // For secret = 42

const exampleCommitments = [EXAMPLE_COMMITMENT_1, EXAMPLE_COMMITMENT_2, EXAMPLE_COMMITMENT_3, EXAMPLE_COMMITMENT_4];

// Locker proof/pubsignals for waitlist containing commitments 1 through 4
const LOCKER_PROOF = "0x156d61a8f6ff109d3beacc78a52e46806c2554b45f3fed8ecfb63155835f103f297b5dd3934ba0751a2172df9aca1e71bba6efbdd4373c965300c9ff1efa02c702d5abbf88ba4825553daf5ae83f2263512f6e176c138ed1b6a980700f8c53e101511852b6c47a126dd45ab1a237d68fcc2c7698b6b0e048abadce71d7313d941363bdbcf0912a335ecc5e5f4ee5cf714354e75d954e7ff6258546ec85fdff662cd6d1bbe82621c12d5769f5a2b4419fa2693c55233ab0c5d908add23ce6857008ce94e9db3f4b59d21de3ba6b9074f5f95f955c914270a3b11f0ec7f82633fa137e1ee6a10a700a6d264d10135d607144c91271b7ca433bad13cdece8cc21220fb1de4eb7392a207d700c127ac0a58c729c45c9ddaa32ebafbc01c01dc2c3e101c39f92d5b90f3f827337fde7ee3ccda905a77d86354382838e365d6a08049c097dd10e20d93b694673ac293f761f3e6de914d1be45fad351f9462fbccee62e1bc608ac45f43655ee2a722b1be5d65c291432a26c70616e521a11e0c669dabc196f0972d656db6b4b2b72ca882556e6735e85d46694e7025f0e869559c707b8137bdde915b0abd77b033d762781e00369b041b44f6c70a74399d20aa8c633a811b38d83996aa3ddd44a2b68a51cd0b041de12c6f9ea313c7cb0ecc7f572f31e13863573ae7684790f3f2b0423c2fa84f7f8d0b33b6c5fbaf67b73ede0850b73282cd518eec49c9a1e101876d1c021dac7f64b3acab830e25bf86df37322ade5033409ac55d4e4e13164a5edeaefd69f35975a576b69ba54ca6ce22b60f3d7c612f8d84a2cc434dc8f0b5d70251f554afe71dc1115490dfee943a2f3ff6d19931e7fdb58b31b78496cb9d7e31c993f59be480c4e13db4d0dc1c042c516dacb552c8cea7ca43841c8d4928c19135bbad3ccaad0783e462dc8df9836d48e8ce6da04d02fd4c7b7ae6326e95195cf75d567a3086ce783ecceee0abde27bf577928d05f2a78ef9cc822fbc9adfed43f1345a06bdb423d63f81e19e94c3045945fb3f01e078552c21c1c43bc32c76073ef8ffb7ea35a314dd9a5f5d99168f3d058fbc07d3b2c3954eec68efd750c29e42fd32818d1530c484193fad2877162f13978e";
const LOCKER_PUBSIGNALS = [ethers.BigNumber.from("0x21681a8eaf42b4a49d4cbb94c01ceb296d4d981f5b6b7564646eb98a21ebf35c"),ethers.BigNumber.from("0x09b058af3321f000000000000000000000000000000000000000000000000000","0x2ce33859f1553a00000000000000000000000000000000000000000000000000"),ethers.BigNumber.from("0x2ec1f03913282800000000000000000000000000000000000000000000000000"),ethers.BigNumber.from("0x10a091773ed3e300000000000000000000000000000000000000000000000000")];
const INVALID_LOCKER_PROOF = "0x256d61a8f6ff109d3beacc78a52e46806c2554b45f3fed8ecfb63155835f103f297b5dd3934ba0751a2172df9aca1e71bba6efbdd4373c965300c9ff1efa02c702d5abbf88ba4825553daf5ae83f2263512f6e176c138ed1b6a980700f8c53e101511852b6c47a126dd45ab1a237d68fcc2c7698b6b0e048abadce71d7313d941363bdbcf0912a335ecc5e5f4ee5cf714354e75d954e7ff6258546ec85fdff662cd6d1bbe82621c12d5769f5a2b4419fa2693c55233ab0c5d908add23ce6857008ce94e9db3f4b59d21de3ba6b9074f5f95f955c914270a3b11f0ec7f82633fa137e1ee6a10a700a6d264d10135d607144c91271b7ca433bad13cdece8cc21220fb1de4eb7392a207d700c127ac0a58c729c45c9ddaa32ebafbc01c01dc2c3e101c39f92d5b90f3f827337fde7ee3ccda905a77d86354382838e365d6a08049c097dd10e20d93b694673ac293f761f3e6de914d1be45fad351f9462fbccee62e1bc608ac45f43655ee2a722b1be5d65c291432a26c70616e521a11e0c669dabc196f0972d656db6b4b2b72ca882556e6735e85d46694e7025f0e869559c707b8137bdde915b0abd77b033d762781e00369b041b44f6c70a74399d20aa8c633a811b38d83996aa3ddd44a2b68a51cd0b041de12c6f9ea313c7cb0ecc7f572f31e13863573ae7684790f3f2b0423c2fa84f7f8d0b33b6c5fbaf67b73ede0850b73282cd518eec49c9a1e101876d1c021dac7f64b3acab830e25bf86df37322ade5033409ac55d4e4e13164a5edeaefd69f35975a576b69ba54ca6ce22b60f3d7c612f8d84a2cc434dc8f0b5d70251f554afe71dc1115490dfee943a2f3ff6d19931e7fdb58b31b78496cb9d7e31c993f59be480c4e13db4d0dc1c042c516dacb552c8cea7ca43841c8d4928c19135bbad3ccaad0783e462dc8df9836d48e8ce6da04d02fd4c7b7ae6326e95195cf75d567a3086ce783ecceee0abde27bf577928d05f2a78ef9cc822fbc9adfed43f1345a06bdb423d63f81e19e94c3045945fb3f01e078552c21c1c43bc32c76073ef8ffb7ea35a314dd9a5f5d99168f3d058fbc07d3b2c3954eec68efd750c29e42fd32818d1530c484193fad2877162f13978e";

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

  async function deployAndAdd4PeopleToWaitlist() {
    const { signers, waitlist } = await loadFixture(
      deploy4PersonWaitlist
    );
    await waitlist.connect(signers[0]).join(EXAMPLE_COMMITMENT_1);
    await waitlist.connect(signers[1]).join(EXAMPLE_COMMITMENT_2);
    await waitlist.connect(signers[2]).join(EXAMPLE_COMMITMENT_3);
    await waitlist.connect(signers[3]).join(EXAMPLE_COMMITMENT_4);

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

      const join = waitlist.join(EXAMPLE_COMMITMENT_1);
      await expect(join).to.emit(waitlist, "Join").withArgs(signers[0].address, 1, EXAMPLE_COMMITMENT_1);
    });

    it("Should not allow a user to join the waitlist twice", async function () {
      const {signers, waitlist} = await loadFixture(
        deploy4PersonWaitlist
      );

      const join1 = waitlist.join(EXAMPLE_COMMITMENT_1);
      await expect(join1).to.emit(waitlist, "Join").withArgs(signers[0].address, 1, EXAMPLE_COMMITMENT_1);
      const join2 = waitlist.join(EXAMPLE_COMMITMENT_2);
      await expect(join2).to.not.emit(waitlist, "Join");
    });

    it("Should not allow the same commitment to be used twice", async function () {
      const {signers, waitlist} = await loadFixture(
        deploy4PersonWaitlist
      );

      const join1 = waitlist.connect(signers[0]).join(EXAMPLE_COMMITMENT_1);
      await expect(join1).to.emit(waitlist, "Join").withArgs(signers[0].address, 1, EXAMPLE_COMMITMENT_1);
      const join2 = waitlist.connect(signers[1]).join(EXAMPLE_COMMITMENT_1);
      await expect(join2).to.not.emit(waitlist, "Join");
    });

    it("Should not allow a user to join the waitlist if it is full", async function () {
      const {signers, waitlist} = await loadFixture(
        deploy4PersonWaitlist
      );

      const join1 = waitlist.connect(signers[0]).join(EXAMPLE_COMMITMENT_1);
      await expect(join1).to.emit(waitlist, "Join").withArgs(signers[0].address, 1, EXAMPLE_COMMITMENT_1);
      const join2 = waitlist.connect(signers[1]).join(EXAMPLE_COMMITMENT_2);
      await expect(join2).to.emit(waitlist, "Join").withArgs(signers[1].address, 2, EXAMPLE_COMMITMENT_2);
      const join3 = waitlist.connect(signers[2]).join(EXAMPLE_COMMITMENT_3);
      await expect(join3).to.emit(waitlist, "Join").withArgs(signers[2].address, 3, EXAMPLE_COMMITMENT_3);
      const join4 = waitlist.connect(signers[3]).join(EXAMPLE_COMMITMENT_4);
      await expect(join4).to.emit(waitlist, "Join").withArgs(signers[3].address, 4, EXAMPLE_COMMITMENT_4);
      const join5 = waitlist.connect(signers[4]).join(EXAMPLE_COMMITMENT_5);
      await expect(join5).to.not.emit(waitlist, "Join");
    });
  });

  describe("Lock", function () {
    it("Should fail to lock the waitlist if nobody has joined", async function () {
      const {signers, waitlist} = await loadFixture(
        deploy4PersonWaitlist
      );

      const lock = waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      await expect(lock).to.not.emit(waitlist, "Lock");
    });

    it("Should should correctly lock the waitlist if 4 people have joined", async function () {
      const {signers, waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      const lock = waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      await expect(lock).to.emit(waitlist, "Lock").withArgs(signers[0].address, 4, 15110259390159278225988621501098076913785868244705342942113820808756371125084);
    });
  });
});