const { expect } = require("chai");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Locker verifier contract", function () {
  async function deployTokenFixture() {
    const Verifier = await ethers.getContractFactory("LockerVerifier");
    const verifier = await Verifier.deploy();

    return verifier;
  }

  describe("Verification", function () {
    it("Should verify a correct proof", async function () {
      const verifier = await loadFixture(
        deployTokenFixture
      );
      // This is a valid proof
      const proof = '0x1ca17acb1266b1c499fab83d0d02b9271c23a3090abbe21f1bfe9c615d0ac2e02e5642796e8585e48a40caebd8b2297645848e6c6abeebea74817cb0bff1a8a52be725d108ed4cd5633a238d6118a2766d9bca3e682f40295d33f157cb0d95f8005dce2def33032b377e75d63262c2a0406dff6f9de0f52e9dbd27c72b3d44481244fe078242bf7cada0d441e2cece378da9d7eaa792b719d6d22a9c963f76b50d6293624e9d2b9c095f528512507e06f79e52cf7d28004c6aa04a505da0a75d2eae05cb3fee3fa2e3063e8d136facf7c8bbf0ee7906f30fb91f89c8ffd6b9b523069f1b76e1a3bed4bccbfefa86b1f8f8813a434dcc85b851aa355c9612a6d129f7ba1d3470179ff7af5ef4245ace950a6c6866b2e1cfea9bff6b519dc0300a2ee17d8094ae9312177efb3b35310b8eefd5bd77d8d7157f6f73a329ae8dc9991776c46186b104dbe0544f2000779dd5b944f76b5cafea014ff5233f2054b631094272b186a488f06430996402a3e088209afefd83272ce8e75a5f4a2ba60cbb28f83fd2b6c602fdb5e36de9044d8611a3f64dbbc659fb9a042e6b68e972b1d41990dc5c3200360395b3cce646bd8933072b068dba2ee6b94ebe49bb96e8cd0f0a57c51c096a64b3e541b6ab65d194c95d34daaa4393c3d0bbdcf14077f7efbf204a9c4a8e5a0a0bb251862c6c7c7e610bfa4cf4c539a1456bb05ab063c090e0170eba32bb4eb838b277c973120df14afd90b5557b7cf1adc6c75fdcefdda22d14ff188ed4aeaa291119c41d47cec47d6774fa84b54ff5ee37430919e6702e8224fcb92d9b65e3778ae061c6b98de97bacbea51a65af1202c28652bdf70738311cf3c7cc8f1d55cd97a52cf56dc9464539a137f1c8d58fc8666ed1ecd46c6114223dcf55ebe04068cd977aeb6fa6f1d99e3a747d4770af183f98e001c4879ca41bd8521cd9074bfd12ea1e3e1ca25a90f86ebf6e0622e35809f06dfc80ce092d255c1fb58f316e56cdb6f9d9195076f9e8f591693424fb03f1026fe6fac94ada22c43e2ee53c320c8527e4fb6a53f56261e7f865c7627109180922536bb58c6c10684ec6c5f9717b187e055cb2e02d735a328f43a45b41f0364326e2a83a83c5';
      const pubSignals = ["0x0ae35a1d69b5edf22c9c8f3c516e71844d314d2783e6be55ecbb4041dd0f4da8","0x0000000000000000000000000000000000000000000000000000000000000001","0x0000000000000000000000000000000000000000000000000000000000000002","0x0000000000000000000000000000000000000000000000000000000000000003","0x0000000000000000000000000000000000000000000000000000000000000004"];
      expect(await verifier.verifyProof(proof, pubSignals)).to.equal(true)
    });

    it("Should fail to verify an incorrect proof", async function () {
      const verifier = await loadFixture(
        deployTokenFixture
      );
      // This is a invalid proof
      const proof = '0x2ca17acb1266b1c499fab83d0d02b9271c23a3090abbe21f1bfe9c615d0ac2e02e5642796e8585e48a40caebd8b2297645848e6c6abeebea74817cb0bff1a8a52be725d108ed4cd5633a238d6118a2766d9bca3e682f40295d33f157cb0d95f8005dce2def33032b377e75d63262c2a0406dff6f9de0f52e9dbd27c72b3d44481244fe078242bf7cada0d441e2cece378da9d7eaa792b719d6d22a9c963f76b50d6293624e9d2b9c095f528512507e06f79e52cf7d28004c6aa04a505da0a75d2eae05cb3fee3fa2e3063e8d136facf7c8bbf0ee7906f30fb91f89c8ffd6b9b523069f1b76e1a3bed4bccbfefa86b1f8f8813a434dcc85b851aa355c9612a6d129f7ba1d3470179ff7af5ef4245ace950a6c6866b2e1cfea9bff6b519dc0300a2ee17d8094ae9312177efb3b35310b8eefd5bd77d8d7157f6f73a329ae8dc9991776c46186b104dbe0544f2000779dd5b944f76b5cafea014ff5233f2054b631094272b186a488f06430996402a3e088209afefd83272ce8e75a5f4a2ba60cbb28f83fd2b6c602fdb5e36de9044d8611a3f64dbbc659fb9a042e6b68e972b1d41990dc5c3200360395b3cce646bd8933072b068dba2ee6b94ebe49bb96e8cd0f0a57c51c096a64b3e541b6ab65d194c95d34daaa4393c3d0bbdcf14077f7efbf204a9c4a8e5a0a0bb251862c6c7c7e610bfa4cf4c539a1456bb05ab063c090e0170eba32bb4eb838b277c973120df14afd90b5557b7cf1adc6c75fdcefdda22d14ff188ed4aeaa291119c41d47cec47d6774fa84b54ff5ee37430919e6702e8224fcb92d9b65e3778ae061c6b98de97bacbea51a65af1202c28652bdf70738311cf3c7cc8f1d55cd97a52cf56dc9464539a137f1c8d58fc8666ed1ecd46c6114223dcf55ebe04068cd977aeb6fa6f1d99e3a747d4770af183f98e001c4879ca41bd8521cd9074bfd12ea1e3e1ca25a90f86ebf6e0622e35809f06dfc80ce092d255c1fb58f316e56cdb6f9d9195076f9e8f591693424fb03f1026fe6fac94ada22c43e2ee53c320c8527e4fb6a53f56261e7f865c7627109180922536bb58c6c10684ec6c5f9717b187e055cb2e02d735a328f43a45b41f0364326e2a83a83c5';
      const pubSignals = ["0x0ae35a1d69b5edf22c9c8f3c516e71844d314d2783e6be55ecbb4041dd0f4da8","0x0000000000000000000000000000000000000000000000000000000000000001","0x0000000000000000000000000000000000000000000000000000000000000002","0x0000000000000000000000000000000000000000000000000000000000000003","0x0000000000000000000000000000000000000000000000000000000000000004"];
      expect(await verifier.verifyProof(proof, pubSignals)).to.equal(false)
    });
  });
});