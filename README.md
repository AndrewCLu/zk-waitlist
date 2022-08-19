# ZK Waitlist

PoC: Create a smart contract where users can claim their spot on a waitlist, and then later anonymously prove that they had previously joined the waitlist.

Phase 1: Users add themselves to the waitlist, coming up with a secret key and uploading hash(sk, 0) to the smart contract, upon which their entry is added to a merkle tree. Each address is allowed one spot on the waitlist. 

Phase 1b: The waitlist is locked. Nobody else can join the waitlist, and the merkle tree is built using the commitments stored in the smart contract. Any user may lock the waitlist past a certain timestamp, but they must provide a zk proof that the merkle root was computed correctly. 

Phase 2: Users can transfer their waitlist spot to another user by sending a zk proof that posesses a nullifier hash(sk, 1) along with a new public key hash(sk_2, 0) that another user provides them. The proof is verified and this new public key replaces the old one in the merkle tree. 

Phase 3: Users redeem their spot claimed on the waitlist, sending a zk proof that they possess a nullifier hash(sk, 1) which is verified by the smart contract. The smart contract also checks that the nullifier has not been used, then updates the list of redeemed nullifiers. 

Todo list:
- Ensure node_is_left is treated as either 0 or 1
- Clean up Merkle tree proof logic
- Add support for transfer proof (allow new merkle leaf to be "mixed in")
- Set owner/admin in waitlist contract
- How to avoid attacks where someone reads the redeem tx and sends a copy of the proof beforehand?