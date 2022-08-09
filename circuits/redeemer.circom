pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template Redeemer(N) { // N is the depth of the Merkle tree
  signal input secret;
  signal input leaf;
  signal input merkle_branch[N]; // Values of the nodes on the Merkle branch
  signal input node_is_left[N]; // Represents if the node is on the left or right of its neighbor
  signal output nullifier;
  signal output merkle_root;
  signal merkle_hashes[N + 1];
  
  component merkle_hashers[N];

  // Check that the leaf is correctly generated from the secret
  component leaf_tester = Poseidon(2);
  leaf_tester.inputs[0] <== secret;
  leaf_tester.inputs[1] <== 0;
  leaf === leaf_tester.out;

  // Compute the nullifier from the secret
  component nullifier_hash = Poseidon(2);
  nullifier_hash.inputs[0] <== secret;
  nullifier_hash.inputs[1] <== 1;
  nullifier <== nullifier_hash.out;

  // Compute the Merkle root based on the claimed branch
  component leaf_hasher = Poseidon(1);
  leaf_hasher.inputs[0] <== leaf;
  var current_hash = leaf_hasher.out;
  for (var i=0; i<N; i++) {
    merkle_hashers[i] = Poseidon(2);
    var node_to_hash_is_left = node_is_left[i];
    var node_to_hash = merkle_branch[i];
    // TODO: Fix this logic to make it more readable
    var left_node = (node_to_hash - current_hash)*node_to_hash_is_left + current_hash;
    var right_node = (node_to_hash - current_hash)*(1 - node_to_hash_is_left) + current_hash;
    merkle_hashers[i].inputs[0] <== left_node;
    merkle_hashers[i].inputs[1] <== right_node;
    current_hash = merkle_hashers[i].out;
  }
  merkle_root <== current_hash;
}

component main = Redeemer(4);