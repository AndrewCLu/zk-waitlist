# ZK Attestations

PoC: Create a smart contract where users can claim their spot on a waitlist, and then later anonymously prove that they had previously joined the waitlist.

Phase 1: Users add themselves to the waitlist, coming up with a secret key and uploading hash(sk, "claim") to the smart contract, upon which their entry is added to a merkle tree. Each address is allowed one spot on the waitlist. 

Phase 2: Users can transfer their waitlist spot to another user by sending a zk proof that posesses a nullifier hash(sk, "transfer") along with a new public key hash(sk_2, "claim") that another user provides them. The proof is verified and this new public key replaces the old one in the merkle tree. 

Phase 3: Users redeem their spot claimed on the waitlist, sending a zk proof that they possess a nullifier hash(sk, "redemption") which is verified by the smart contract. The smart contract then replaces the merkle tree proof with random junk, so that the spot can no longer be redeemed.  