# ZK Attestations

PoC: Create a smart contract where users can claim their spot on a waitlist, and then later anonymously prove that they had previously joined the waitlist.

Phase 1: Users add themselves to the waitlist, coming up with a secret key and uploading hash(sk, "waitlist") to the smart contract, upon which their entry is added to a merkle tree.
Phase 2: Users redeem their spot claimed on the waitlist, sending a zk proof that they possess a nullifier hash(sk, "redemption") which is verified by the smart contract.  