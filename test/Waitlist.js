const { expect } = require("chai");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const EXAMPLE_COMMITMENT_1 = ethers.BigNumber.from("4382392797704465458689681080471165211673027182585861305038077659483609552615");  // For secret = 69
const EXAMPLE_COMMITMENT_2 = ethers.BigNumber.from("20303228544014408986638054140612126360870850460569288868228966842779811868675"); // For secret = 420
const EXAMPLE_COMMITMENT_3 = ethers.BigNumber.from("21149050476190125938046049458349759246088194254482667782552195612071171355023"); // For secret = 42069
const EXAMPLE_COMMITMENT_4 = ethers.BigNumber.from("7520705075767269653587126815629426321631492132326730479313166771059204398235");  // For secret = 69420
const EXAMPLE_COMMITMENT_5 = ethers.BigNumber.from("4062130046788682276592684126400580992160311099061031008181023682089773591896");  // For secret = 42

// Locker proof/pubsignals for waitlist containing commitments 1 through 4
const LOCKER_PROOF = "0x084d0c2e95d87bafa6a98239db41b5096e956b1bd89a3b10d17089c7e47236af20c0c9a244723614af2796c4341bf8388f6f0d0e897bf2e7b513b3b8e7a60bf0139e12f6e1b1db51eea998e1bb4ae3f0135cacd39d42dc14e08d10575f45f43b077ce4a3d06b4fcc30bc976e98b08d1cebad6426199f2c3526766d348560b8bb156039320fdd2df41906b389324877112e180f0ebed9490195b7c4e0e38b47c11ab179aacfbd5a722c3863bdc554ff5d78fabb3ac22e7218eb55e86a178dc7c11448a43d651c7d98267bf239aca8c5c226b49d872b892d58bc480d40a35b833e09648aa3f1ac06d1b01211f2065a70950d0fedbd7dcee02e959d366b6b7a40e21a5c029ea2a1cb7b182495cb6c208a6c649a6b021127c939226bbd122918e8a62acbb48ab40bbba3f8ee7a4c593229dd777e2e90b124f43b319bcf5ad218e89022f146b2d9e9117e680df3d6b005b53a1efc5b122b1eb953353634ff4c7ee8e91884771fa6c836e47184496436ba9a51767a77baa6435383d3f5635f8797a4470cf1f0af16032f352e9e4a9720bef40d9635f078ba56f18ec1a5c6b847858ea51b39adc392fbf4a3f40d33bb11f8478dc825a4908e367e5f5e3c682440852b81265323a8feb626684282b6814a2dc99220c66e776a4a652d73076a6c286b137f008bd5782f6e520919096fe9e93e42031fe909575468876013446d75dc0e0be018b4af8cc3395fd2d450dcd97c75dc7b04afea36a259beafcc743c86681bd9182bf05eb190b5453c8bfd5695e2f66c37b15004819145be3d944b9e469840ff1811d6357e94adfc4f0bda5d5254ca601dd7881d1dee30001dfaa231a575f5456620885d1b580c6a140478d2d4cd093626dfaaab424c07cd5321e14bed9a86c1302cde186372683567da6bfdd0409e170239f5a8d9d7105c501a467b1582de543d095aa603b8b0e5da7b31466bd6483234c90469a44d0097af55893c0d8b0e9a670f518dc1f46f77c2471dcdc3b492cd69f18bc1058f20c637dbb32261b5a372c329dfe2596af81b3e0b23e879daef5b6ac1c4b757ebb59df014d90759072c07540296458c3bef9b027728188210381ea4060b57f432b964ec9d8d21c6e8c7812d";
const LOCKER_PUBSIGNALS = [ethers.BigNumber.from("0x276c5816c9a819950b7342bf9045e5ddfa8054aa213fd823d6ac694f1de13bb1"),ethers.BigNumber.from("0x09b058af3321f00792224af1cdc560b782e5234e9bf8e8312268dbd8c874d6e7"),ethers.BigNumber.from("0x2ce33859f1553917933b7488018d4974fc19b905ead27ad1480f1c7e6fe67003"),ethers.BigNumber.from("0x2ec1f039132828ca4116e876e325a405a6da7772d794f9a6e00710423752718f"),ethers.BigNumber.from("0x10a091773ed3e36f95562528043567f8d68c0454405bc778ba876265cf559c9b")];
const INVALID_LOCKER_PUBSIGNALS_COMMITMENT = [ethers.BigNumber.from("0x276c5816c9a819950b7342bf9045e5ddfa8054aa213fd823d6ac694f1de13bb1"),ethers.BigNumber.from("0x19b058af3321f00792224af1cdc560b782e5234e9bf8e8312268dbd8c874d6e7"),ethers.BigNumber.from("0x2ce33859f1553917933b7488018d4974fc19b905ead27ad1480f1c7e6fe67003"),ethers.BigNumber.from("0x2ec1f039132828ca4116e876e325a405a6da7772d794f9a6e00710423752718f"),ethers.BigNumber.from("0x10a091773ed3e36f95562528043567f8d68c0454405bc778ba876265cf559c9b")];
const INVALID_LOCKER_PUBSIGNALS_ROOT = [ethers.BigNumber.from("0x376c5816c9a819950b7342bf9045e5ddfa8054aa213fd823d6ac694f1de13bb1"),ethers.BigNumber.from("0x09b058af3321f00792224af1cdc560b782e5234e9bf8e8312268dbd8c874d6e7"),ethers.BigNumber.from("0x2ce33859f1553917933b7488018d4974fc19b905ead27ad1480f1c7e6fe67003"),ethers.BigNumber.from("0x2ec1f039132828ca4116e876e325a405a6da7772d794f9a6e00710423752718f"),ethers.BigNumber.from("0x10a091773ed3e36f95562528043567f8d68c0454405bc778ba876265cf559c9b")];
const INVALID_LOCKER_PROOF = "0x3d4cb0fec38e255c7a4e18e529b79be70d695c3a3e792e1f81d20aacd41053821b25072be8f42790724287e6bc7ddb4de1ff2d84868a28c34202e4954e5430a6180b58627af31bfad2cf3ee199c9dc15918b54f8f1fe8f623507a3e16147ef21244d5d0c8e2d5e074ae15e7ce04aebd294e86cd4184503dc1b01816cf667f815199032eda2807adcbd1d567d5c9ebe8a21a88f383196270b48588ba39e0bde4d075ec591d0c8da41746d292374be47779e832d7971a66afe86912a96be5ca62218ffa4df87c67d086693b45a1355297b3886859f5a1daea17158551d175324de29b56b7212f334cabd4d4c8cd4d5fbf368b0aee404224734f8278e32b66978df2abd80ebfed85e27f1b061f84e156acddacb4e4fddfa360e187ab5188a445b4605861c24fce9721c55a1340dd63c6502cae74366fd7b283f71af7140a41616791572ac6fa9796867956844295979913d62bc7d028c44e4be717146efb84d726f1d50ac5cc83865551e1cc453c16825cd9ec881e1270a8e987feb39f625aac4e310085f55e4ae36da10b885baf84d32029a04308f6e7b61672df00d263f64048b25d8d1dc8f5786006c3a2ff50f8f766c6198a3fc93ad00cb88f0535f3ed9f3fc21f407e40ee30121f755c1380857d7fb50f01eef7c9893004ba5dc0c5cd34fc0274a259985341171c91f43d4fadf68e3315e9f03ef5bfc6470d04e3a177042f5144dd24b0500073b8ac78ca6973ddd9a324570323f65057030e000efd97facbb0f81a36fbbd2390e934ff5bdbeda5a617533ef9f8cbe7abbc2d3ac41902ab2511c838915c613010df7c16c3118fdaecce95b771be3f61edc6c8b3f7c703e488e2650cc3ec58543bf539a8d9794a2946acd4340bf3cf90328f60367a096bdce2a2af67b6bd5c65973e79b4274f36e2aeed782bab44e30f714b7ab777bd24e77a72c9b29e95ca4d7fa9da86b7ac5820caae9b6a3d19ea28ecd45109ec8d1d9c6b1169da61ebc05802984b89947507d0387eae6d2d7bdb0c0a9841a778af9d41ca4087a17b970d8f902b16d5b5271a780b758a0e1da468b4138c0d0cb8890a408e01fd959e45cd9536341de1d1565ba61a98a8e06d6a0ebf58e58a8d507922174c2";

const REDEEMER_PROOF_1 = "0x1ea5409f9eb56c5ad1dcefa119206c8ecd4ffc363a3f09166d3482612326b73412c7151358f31008212b221e9ea5a2ee57388eccd1e47f324cc2ee7f252170a90b56361b83cc33e61d2b3be8a2c07b0ae36afbe09d431c7435d93cd5e79844670353da0ba7486f396aadb845ca707151c6438ebe8e5eaf4035d42f66522fbf622eba87c799d54d9b28b04566269e1103f9e44ad5d6b5d628be895bcc14c960702b54f2922ceb557d40f98b5b61bc053236b04750ba26e3f6bad32f93996680d425672eb27f423d78a1cfc962c277d58e9ee9cb4ca9a95a5ddbd51f7672d1fc08191eec3252e443f25532ed7af23181643237cb8e869859247e5dd10202dd37781f1a0a9ee68d1e7d8091fbbd5b7697be100785f6711999c7ec58e65a8e1fccf10ba6c5c4cc6c1cf43fa154fbe3555c199466542c3ae413f220c527cfc98d13ca2f10f9e5f99c7bd9a0ffd8ea78d8560784720f9c24afa14ff299591b498339022f57e55f1eeb55c84fd20b9fd33a9edfb9f9aac3db6163c85494240bd0113366057873c6c38f5b223a5535d154d50d402c800206eff7a4d59b63317464c628cf0e7562af7056026e58ddf719100e4058d116dc8bb607352144e0fe9977f59edb10b1da5ad37c68cc6935ed7023f4316e3a6352e2ee3f37e5a4984e47323c98641caab5b461729b13202cb27589e2c65b02898670cb5a45911d7990de9fbf35c3117a426397ea33408141773e0cf67b607cbfd6157fcb691926a2db4dcbe3831e01516906d745f699df44c7776506bdb831ff64059bedaad0d0f318fc86a5c22708f3b71cbc5dbcec1527e32a7c66335aa43a771f9dc89c0163de2c5a20f855712282dd5c3fd105201bc54b56fd1407c679c7f59a10508c884aaf2a7d50df764717a1339d40922beb5255c1890d8629b43aba8f9399ab0165469e25f18a069b91111a8716b35daf3974d5a9e3e111fb6d41cd808e5d97cb32a65a69a3903aa7e62df3005c4f217afa91475a7c96d8a334a1bec54cdc677f2b37ac5efd4220b2121a3d4c8559b3f804da65460fd27a682401b15d6068ac5abcebcd399fbb97746d06049ae81f4008ad27242b89776de99330b3efb137b3c97fb0f0489524152100";
const REDEEMER_PUBSIGNALS_1 = ["0x15d43e90d1f4eb13959d17eb6453778007b6f24127495e0d49a0d43e1479b206","0x276c5816c9a819950b7342bf9045e5ddfa8054aa213fd823d6ac694f1de13bb1"];
const REDEEMER_NULLIFIER_1 = "9873573210598455208457313175829381551573461038946183954309349153209518240262";
const INVALID_REDEEMER_PROOF = "0x2ea5409f9eb56c5ad1dcefa119206c8ecd4ffc363a3f09166d3482612326b73412c7151358f31008212b221e9ea5a2ee57388eccd1e47f324cc2ee7f252170a90b56361b83cc33e61d2b3be8a2c07b0ae36afbe09d431c7435d93cd5e79844670353da0ba7486f396aadb845ca707151c6438ebe8e5eaf4035d42f66522fbf622eba87c799d54d9b28b04566269e1103f9e44ad5d6b5d628be895bcc14c960702b54f2922ceb557d40f98b5b61bc053236b04750ba26e3f6bad32f93996680d425672eb27f423d78a1cfc962c277d58e9ee9cb4ca9a95a5ddbd51f7672d1fc08191eec3252e443f25532ed7af23181643237cb8e869859247e5dd10202dd37781f1a0a9ee68d1e7d8091fbbd5b7697be100785f6711999c7ec58e65a8e1fccf10ba6c5c4cc6c1cf43fa154fbe3555c199466542c3ae413f220c527cfc98d13ca2f10f9e5f99c7bd9a0ffd8ea78d8560784720f9c24afa14ff299591b498339022f57e55f1eeb55c84fd20b9fd33a9edfb9f9aac3db6163c85494240bd0113366057873c6c38f5b223a5535d154d50d402c800206eff7a4d59b63317464c628cf0e7562af7056026e58ddf719100e4058d116dc8bb607352144e0fe9977f59edb10b1da5ad37c68cc6935ed7023f4316e3a6352e2ee3f37e5a4984e47323c98641caab5b461729b13202cb27589e2c65b02898670cb5a45911d7990de9fbf35c3117a426397ea33408141773e0cf67b607cbfd6157fcb691926a2db4dcbe3831e01516906d745f699df44c7776506bdb831ff64059bedaad0d0f318fc86a5c22708f3b71cbc5dbcec1527e32a7c66335aa43a771f9dc89c0163de2c5a20f855712282dd5c3fd105201bc54b56fd1407c679c7f59a10508c884aaf2a7d50df764717a1339d40922beb5255c1890d8629b43aba8f9399ab0165469e25f18a069b91111a8716b35daf3974d5a9e3e111fb6d41cd808e5d97cb32a65a69a3903aa7e62df3005c4f217afa91475a7c96d8a334a1bec54cdc677f2b37ac5efd4220b2121a3d4c8559b3f804da65460fd27a682401b15d6068ac5abcebcd399fbb97746d06049ae81f4008ad27242b89776de99330b3efb137b3c97fb0f0489524152100";
const INVALID_REDEEMER_PUBSIGNALS_NULLIFIER = ["0x25d43e90d1f4eb13959d17eb6453778007b6f24127495e0d49a0d43e1479b206","0x276c5816c9a819950b7342bf9045e5ddfa8054aa213fd823d6ac694f1de13bb1"];
const INVALID_REDEEMER_PUBSIGNALS_ROOT = ["0x15d43e90d1f4eb13959d17eb6453778007b6f24127495e0d49a0d43e1479b206","0x376c5816c9a819950b7342bf9045e5ddfa8054aa213fd823d6ac694f1de13bb1"];

const REDEEMER_PROOF_2 = "0x07fdb104dab9993bb50a69618832ab8b6a29e75006e08f0c991b43006f5b137d0dab650d2b3a64fc58bbeb95b9c95399fa7826e113e3cb7ac1f35fb3db266b1b100a3654ac1074809aea15aed5c704bc015121a6b5a65575a4b7c37da7fd17d722afeb0d4f31199b6b573c281e6dd193e8e13c0217b72672ff9f8c622e2186f426d1ca16c45622b2e6f9c8f948e64fec9d22f17b66e3e22b3ec0594513e5783e007e4672f33f7f5cb9a778a8987d602cf179121510ea8ccd3a5e6cbb4b56c04a22213aa10fa71871ea395e69db9dd268ae74a1bea04892fcf402d53c33d6b0f2122123dab810cde476dcad7b482ae04bed394918b58ec71cd79e4f45b33009001bab1ccc762ba0b77dc815880719f7038ca34b8dd8217259c9314d3187a6b6461a8261ef8a613168495b7c645ebdfe2a1f390ad0682e432ecc4f618230a22f1604769bb15c7ec260a6da39cf8290025d2688e207e7094fea96b1392058442edb1a889906c885829438ee1cbbca83e92e72e3f9879c08df2530f00a6d5f14744e18972ef0793186d6a23879bce13ce4a5fc051008d07ae7799d4dce11c2d60bda0b45c84b20eb7cca7f56b40f83243bd243c649739bbf81de9ac9ad6b16cc91a7035abc05c858c5d161e61e3464262c51cde8ee810952ba1495871298be4d0e6806c3e970aaf82e602edaf9eaebd967723c032a24debb7962233c4ed395dbb815178954ea0f1682ed8026d8bcbef73a4f91713f15e1e21f6135f53dd2835f2a0627f766f1e063898f95e389b89380296ba56597dc9419b42812b83ab8d989b4c7271179e02b76045181c4be86fc105c90f0f453a334b893adc96e1331e794b6191da2b3630a2e0f83e1076e25d66347617604e4023a6be9dc8ec67a617192f762029699a40b7e55877c5b9f45cbdb107957e9305cabfc4590112580bff24a4fd50d664e816488bd204c2417a70abc3b1c65612115a31a6f55bed1e5bfed6f0e1d2cc0e8bb20ee0b3b11a94a2d0bd1ba8f04c6ac0b9ddeabf185d4701ebb65a55d15432e13147dd6bb4c605e6a95982d44b43bb0850d26875b74efe4b1bfb70eaa12c8d6f121b9db29a2192373e0a12fdcf47fbd389762fddb42ee690ee8a86906";
const REDEEMER_PUBSIGNALS_2 = ["0x16dbe0601ada0d685f0d64ac6d5b82c9fe20f7dd9dd16900148141e9072434bc","0x276c5816c9a819950b7342bf9045e5ddfa8054aa213fd823d6ac694f1de13bb1"];
const REDEEMER_NULLIFIER_2 = "10339370758182708972242003821912733314943307639842654974179105599767554831548";

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
      const {waitlist} = await loadFixture(
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
      await expect(join2).to.be.revertedWith("User has already signed up for waitlist.");
    });

    it("Should not allow the same commitment to be used twice", async function () {
      const {signers, waitlist} = await loadFixture(
        deploy4PersonWaitlist
      );

      const join1 = waitlist.connect(signers[0]).join(EXAMPLE_COMMITMENT_1);
      await expect(join1).to.emit(waitlist, "Join").withArgs(signers[0].address, 1, EXAMPLE_COMMITMENT_1);
      const join2 = waitlist.connect(signers[1]).join(EXAMPLE_COMMITMENT_1);
      await expect(join2).to.be.revertedWith("Commitment has already been used.");
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
      await expect(join5).to.be.revertedWith("Waitlist is full.");
    });
  });

  describe("Lock", function () {
    it("Should fail to lock the waitlist if nobody has joined", async function () {
      const {waitlist} = await loadFixture(
        deploy4PersonWaitlist
      );

      const lock = waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      await expect(lock).to.be.revertedWith("Waitlist must have a number of users equal to a nonzero power of 2 to be locked.");
    });

    it("Should fail to lock the waitlist if the number of users is not a power of 2", async function () {
      const {signers, waitlist} = await loadFixture(
        deploy4PersonWaitlist
      );

      await waitlist.connect(signers[0]).join(EXAMPLE_COMMITMENT_1);
      await waitlist.connect(signers[1]).join(EXAMPLE_COMMITMENT_2);
      await waitlist.connect(signers[2]).join(EXAMPLE_COMMITMENT_3);
      const lock = waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      await expect(lock).to.be.revertedWith("Waitlist must have a number of users equal to a nonzero power of 2 to be locked.");
    });

    it("Should should correctly lock the waitlist if 4 people have joined", async function () {
      const {signers, waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      const lockedBefore = await waitlist.isLocked();
      expect(lockedBefore).to.equal(false);
      const lock = waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      await expect(lock).to.emit(waitlist, "Lock").withArgs(signers[0].address, 4, LOCKER_PUBSIGNALS[0]);
      const lockedAfter = await waitlist.isLocked();
      expect(lockedAfter).to.equal(true);
    });

    it("Should not allow a user to join the locked waitlist", async function () {
      const {signers, waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      const join = waitlist.connect(signers[4]).join(EXAMPLE_COMMITMENT_5);
      await expect(join).to.be.revertedWith("Waitlist is locked.");
    });

    it("Should not lock the waitlist if claimed commitments are incorrect", async function () {
      const {waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      const lock = waitlist.lock(LOCKER_PROOF, INVALID_LOCKER_PUBSIGNALS_COMMITMENT);
      await expect(lock).to.be.revertedWith("Wrong commitments used to generate locking proof.");
    });

    it("Should not lock the waitlist if claimed Merkle root is incorrect", async function () {
      const {waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      const lock = waitlist.lock(LOCKER_PROOF, INVALID_LOCKER_PUBSIGNALS_ROOT);
      await expect(lock).to.be.revertedWith("Locking proof is invalid.");
    });

    it("Should not lock the waitlist if proof is invalid", async function () {
      const {waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      const lock = waitlist.lock(INVALID_LOCKER_PROOF, LOCKER_PUBSIGNALS);
      await expect(lock).to.be.revertedWith("Locking proof is invalid.");
    });
  });

  describe("Redeem", function () {
    it("Should fail to redeem if the waitlist is not yet locked", async function () {
      const {waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      const redeem = waitlist.redeem(REDEEMER_PROOF_1, REDEEMER_PUBSIGNALS_1);
      await expect(redeem).to.be.revertedWith("Waitlist has not been locked.");
    });

    it("Should successfully redeem a valid waitlist spot", async function () {
      const {signers, waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      const redeem = waitlist.redeem(REDEEMER_PROOF_1, REDEEMER_PUBSIGNALS_1);
      await expect(redeem).to.emit(waitlist, "Redeem").withArgs(signers[0].address, REDEEMER_NULLIFIER_1);
    });

    it("Should successfully handle a second redemption", async function () {
      const {signers, waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      const redeem = waitlist.redeem(REDEEMER_PROOF_1, REDEEMER_PUBSIGNALS_1);
      await expect(redeem).to.emit(waitlist, "Redeem").withArgs(signers[0].address, REDEEMER_NULLIFIER_1);
      const redeem_2 = waitlist.connect(signers[1]).redeem(REDEEMER_PROOF_2, REDEEMER_PUBSIGNALS_2);
      await expect(redeem_2).to.emit(waitlist, "Redeem").withArgs(signers[1].address, REDEEMER_NULLIFIER_2);
    });

    it("Should allow the same user to redeem twice", async function () {
      const {signers, waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      const redeem = waitlist.redeem(REDEEMER_PROOF_1, REDEEMER_PUBSIGNALS_1);
      await expect(redeem).to.emit(waitlist, "Redeem").withArgs(signers[0].address, REDEEMER_NULLIFIER_1);
      const redeem_2 = waitlist.redeem(REDEEMER_PROOF_2, REDEEMER_PUBSIGNALS_2);
      await expect(redeem_2).to.emit(waitlist, "Redeem").withArgs(signers[0].address, REDEEMER_NULLIFIER_2);
    });

    it("Should not redeem if a nullifier has been used already", async function () {
      const {signers, waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      waitlist.connect(signers[0]).redeem(REDEEMER_PROOF_1, REDEEMER_PUBSIGNALS_1);
      const redeem_2 = waitlist.connect(signers[1]).redeem(REDEEMER_PROOF_1, REDEEMER_PUBSIGNALS_1);
      await expect(redeem_2).to.be.revertedWith("Nullifier has already been used.");
    });

    it("Should not redeem if the proof is invalid", async function () {
      const {waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      const redeem = waitlist.redeem(INVALID_REDEEMER_PROOF, REDEEMER_PUBSIGNALS_1);
      await expect(redeem).to.be.revertedWith("Redeeming proof is invalid.");
    });

    it("Should not redeem if the claimed nullifier is invalid", async function () {
      const {waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      const redeem = waitlist.redeem(REDEEMER_PROOF_1, INVALID_REDEEMER_PUBSIGNALS_NULLIFIER);
      await expect(redeem).to.be.revertedWith("Redeeming proof is invalid.");
    });

    it("Should not redeem if the claimed Merkle root is invalid", async function () {
      const {waitlist} = await loadFixture(
        deployAndAdd4PeopleToWaitlist
      );

      waitlist.lock(LOCKER_PROOF, LOCKER_PUBSIGNALS);
      const redeem = waitlist.redeem(REDEEMER_PROOF_1, INVALID_REDEEMER_PUBSIGNALS_ROOT);
      await expect(redeem).to.be.revertedWith("Merkle root used in proof is incorrect.");
    });
  });
});