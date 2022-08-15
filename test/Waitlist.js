const { expect } = require("chai");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const EXAMPLE_COMMITMENT_1 = ethers.BigNumber.from("4382392797704465458689681080471165211673027182585861305038077659483609552615");  // For secret = 69
const EXAMPLE_COMMITMENT_2 = ethers.BigNumber.from("20303228544014408986638054140612126360870850460569288868228966842779811868675"); // For secret = 420
const EXAMPLE_COMMITMENT_3 = ethers.BigNumber.from("21149050476190125938046049458349759246088194254482667782552195612071171355023"); // For secret = 42069
const EXAMPLE_COMMITMENT_4 = ethers.BigNumber.from("7520705075767269653587126815629426321631492132326730479313166771059204398235");  // For secret = 69420
const EXAMPLE_COMMITMENT_5 = ethers.BigNumber.from("4062130046788682276592684126400580992160311099061031008181023682089773591896");  // For secret = 42

const exampleCommitments = [EXAMPLE_COMMITMENT_1, EXAMPLE_COMMITMENT_2, EXAMPLE_COMMITMENT_3, EXAMPLE_COMMITMENT_4];

// Locker proof/pubsignals for waitlist containing commitments 1 through 4
const LOCKER_PROOF = "0x2d4cb0fec38e255c7a4e18e529b79be70d695c3a3e792e1f81d20aacd41053821b25072be8f42790724287e6bc7ddb4de1ff2d84868a28c34202e4954e5430a6180b58627af31bfad2cf3ee199c9dc15918b54f8f1fe8f623507a3e16147ef21244d5d0c8e2d5e074ae15e7ce04aebd294e86cd4184503dc1b01816cf667f815199032eda2807adcbd1d567d5c9ebe8a21a88f383196270b48588ba39e0bde4d075ec591d0c8da41746d292374be47779e832d7971a66afe86912a96be5ca62218ffa4df87c67d086693b45a1355297b3886859f5a1daea17158551d175324de29b56b7212f334cabd4d4c8cd4d5fbf368b0aee404224734f8278e32b66978df2abd80ebfed85e27f1b061f84e156acddacb4e4fddfa360e187ab5188a445b4605861c24fce9721c55a1340dd63c6502cae74366fd7b283f71af7140a41616791572ac6fa9796867956844295979913d62bc7d028c44e4be717146efb84d726f1d50ac5cc83865551e1cc453c16825cd9ec881e1270a8e987feb39f625aac4e310085f55e4ae36da10b885baf84d32029a04308f6e7b61672df00d263f64048b25d8d1dc8f5786006c3a2ff50f8f766c6198a3fc93ad00cb88f0535f3ed9f3fc21f407e40ee30121f755c1380857d7fb50f01eef7c9893004ba5dc0c5cd34fc0274a259985341171c91f43d4fadf68e3315e9f03ef5bfc6470d04e3a177042f5144dd24b0500073b8ac78ca6973ddd9a324570323f65057030e000efd97facbb0f81a36fbbd2390e934ff5bdbeda5a617533ef9f8cbe7abbc2d3ac41902ab2511c838915c613010df7c16c3118fdaecce95b771be3f61edc6c8b3f7c703e488e2650cc3ec58543bf539a8d9794a2946acd4340bf3cf90328f60367a096bdce2a2af67b6bd5c65973e79b4274f36e2aeed782bab44e30f714b7ab777bd24e77a72c9b29e95ca4d7fa9da86b7ac5820caae9b6a3d19ea28ecd45109ec8d1d9c6b1169da61ebc05802984b89947507d0387eae6d2d7bdb0c0a9841a778af9d41ca4087a17b970d8f902b16d5b5271a780b758a0e1da468b4138c0d0cb8890a408e01fd959e45cd9536341de1d1565ba61a98a8e06d6a0ebf58e58a8d507922174c2";
const LOCKER_PUBSIGNALS = [ethers.BigNumber.from("0x276c5816c9a819950b7342bf9045e5ddfa8054aa213fd823d6ac694f1de13bb1"),ethers.BigNumber.from("0x09b058af3321f00792224af1cdc560b782e5234e9bf8e8312268dbd8c874d6e7"),ethers.BigNumber.from("0x2ce33859f1553917933b7488018d4974fc19b905ead27ad1480f1c7e6fe67003"),ethers.BigNumber.from("0x2ec1f039132828ca4116e876e325a405a6da7772d794f9a6e00710423752718f"),ethers.BigNumber.from("0x10a091773ed3e36f95562528043567f8d68c0454405bc778ba876265cf559c9b")];
const INVALID_LOCKER_PROOF = "0x3d4cb0fec38e255c7a4e18e529b79be70d695c3a3e792e1f81d20aacd41053821b25072be8f42790724287e6bc7ddb4de1ff2d84868a28c34202e4954e5430a6180b58627af31bfad2cf3ee199c9dc15918b54f8f1fe8f623507a3e16147ef21244d5d0c8e2d5e074ae15e7ce04aebd294e86cd4184503dc1b01816cf667f815199032eda2807adcbd1d567d5c9ebe8a21a88f383196270b48588ba39e0bde4d075ec591d0c8da41746d292374be47779e832d7971a66afe86912a96be5ca62218ffa4df87c67d086693b45a1355297b3886859f5a1daea17158551d175324de29b56b7212f334cabd4d4c8cd4d5fbf368b0aee404224734f8278e32b66978df2abd80ebfed85e27f1b061f84e156acddacb4e4fddfa360e187ab5188a445b4605861c24fce9721c55a1340dd63c6502cae74366fd7b283f71af7140a41616791572ac6fa9796867956844295979913d62bc7d028c44e4be717146efb84d726f1d50ac5cc83865551e1cc453c16825cd9ec881e1270a8e987feb39f625aac4e310085f55e4ae36da10b885baf84d32029a04308f6e7b61672df00d263f64048b25d8d1dc8f5786006c3a2ff50f8f766c6198a3fc93ad00cb88f0535f3ed9f3fc21f407e40ee30121f755c1380857d7fb50f01eef7c9893004ba5dc0c5cd34fc0274a259985341171c91f43d4fadf68e3315e9f03ef5bfc6470d04e3a177042f5144dd24b0500073b8ac78ca6973ddd9a324570323f65057030e000efd97facbb0f81a36fbbd2390e934ff5bdbeda5a617533ef9f8cbe7abbc2d3ac41902ab2511c838915c613010df7c16c3118fdaecce95b771be3f61edc6c8b3f7c703e488e2650cc3ec58543bf539a8d9794a2946acd4340bf3cf90328f60367a096bdce2a2af67b6bd5c65973e79b4274f36e2aeed782bab44e30f714b7ab777bd24e77a72c9b29e95ca4d7fa9da86b7ac5820caae9b6a3d19ea28ecd45109ec8d1d9c6b1169da61ebc05802984b89947507d0387eae6d2d7bdb0c0a9841a778af9d41ca4087a17b970d8f902b16d5b5271a780b758a0e1da468b4138c0d0cb8890a408e01fd959e45cd9536341de1d1565ba61a98a8e06d6a0ebf58e58a8d507922174c2";

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

    it("Should fail to lock the waitlist if the number of users is not a power of 2", async function () {
      const {signers, waitlist} = await loadFixture(
        deploy4PersonWaitlist
      );

      await waitlist.connect(signers[0]).join(EXAMPLE_COMMITMENT_1);
      await waitlist.connect(signers[1]).join(EXAMPLE_COMMITMENT_2);
      await waitlist.connect(signers[2]).join(EXAMPLE_COMMITMENT_3);
      const lock = waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      await expect(lock).to.not.emit(waitlist, "Lock");
    });

    it("Should should correctly lock the waitlist if 4 people have joined", async function () {
      const {signers, waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      const lock = waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      await expect(lock).to.emit(waitlist, "Lock").withArgs(signers[0].address, 4, LOCKER_PUBSIGNALS[0]);
    });

    it("Should not allow a user to join the locked waitlist", async function () {
      const {signers, waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      const join = waitlist.connect(signers[4]).join(EXAMPLE_COMMITMENT_5);
      await expect(join).to.not.emit(waitlist, "Join");
    });
  });
});