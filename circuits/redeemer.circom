pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template Redeemer(N) { // N is the depth of the Merkle tree
  signal input secret;
  signal input leaf;
  signal input merkle_branch[N];
  signal output nullifier;

  component leaf_hash = Poseidon(2);
  leaf_hash.inputs[0] <== secret;
  leaf_hash.inputs[1] <== 0;
  leaf === leaf_hash.out;

  component nullifier_hash = Poseidon(2);
  nullifier_hash.inputs[0] <== secret;
  nullifier_hash.inputs[1] <== 1;
}

component main = Redeemer(4);