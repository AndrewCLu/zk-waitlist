async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Starting account balance:", (await deployer.getBalance()).toString());

  const LockerVerifier = await ethers.getContractFactory("LockerVerifier");
  const lockerVerifier = await LockerVerifier.deploy();
  await lockerVerifier.deployed();
  console.log("Locker verifier address: ", lockerVerifier.address);

  const RedeemerVerifier = await ethers.getContractFactory("RedeemerVerifierDepth2");
  const redeemerVerifier = await RedeemerVerifier.deploy();
  await redeemerVerifier.deployed();
  console.log("Redeemer verifier address: ", redeemerVerifier.address);

  const Waitlist = await ethers.getContractFactory("Waitlist");
  const waitlist = await Waitlist.deploy(2, lockerVerifier.address, redeemerVerifier.address);
  await waitlist.deployed();
  console.log("Waitlist address: ", waitlist.address);

  console.log("Remaining account balance:", (await deployer.getBalance()).toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });