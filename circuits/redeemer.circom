pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

// Allows a user to provide a proof that they know the secret which claimed a spot on the waitlist
// N is the depth of the Merkle tree
template Redeemer(N) { 
  signal input secret;
  signal input merkle_branch[N]; // Values of the nodes on the Merkle branch
  signal input node_is_left[N]; // Represents if the node is on the left or right of its neighbor
  signal output nullifier;
  signal output merkle_root;
  
  component merkle_hashers[N];

  // Compute the nullifier from the secret
  component nullifier_maker = Poseidon(2);
  nullifier_maker.inputs[0] <== secret;
  nullifier_maker.inputs[1] <== 1;
  nullifier <== nullifier_maker.out;

  // Generate the leaf hash
  component leaf_maker = Poseidon(2);
  leaf_maker.inputs[0] <== secret;
  leaf_maker.inputs[1] <== 0;
  component leaf_hasher = Poseidon(1);
  leaf_hasher.inputs[0] <== leaf_maker.out;
  var current_hash = leaf_hasher.out;

  // Compute the Merkle root based on the claimed branch
  for (var i=0; i<N; i++) {
    merkle_hashers[i] = Poseidon(2);
    var node_to_hash_is_left = node_is_left[i];
    var node_to_hash = merkle_branch[i];
    var left_node = (node_to_hash - current_hash)*node_to_hash_is_left + current_hash;
    var right_node = (node_to_hash - current_hash)*(1 - node_to_hash_is_left) + current_hash;
    merkle_hashers[i].inputs[0] <== left_node;
    merkle_hashers[i].inputs[1] <== right_node;
    current_hash = merkle_hashers[i].out;
  }
  merkle_root <== current_hash;
}

component main = Redeemer(2);