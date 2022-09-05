pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

// Allows a user to lock the waitlist once they prove they have computed the Merkle root of the commitment tree correctly
// N is the number of commitments that have been made. Currently we require that N is a power of 2 to build a full Merkle tree
template Locker(N) { 
  signal input commitments[N]; 
  signal output merkle_root;
  signal merkle_tree_nodes[2*N-1]; // Represents all the nodes of the Merkle tree, including leaves
  component merkle_hashers[2*N-1]; // Poseidon hashers that generate the Merkle nodes

  // Hashes the commitments into Merkle leaves
  for (var i=0; i<N; i++) {
    merkle_hashers[i] = Poseidon(1);
    merkle_hashers[i].inputs[0] <== commitments[i];
    merkle_tree_nodes[i] <== merkle_hashers[i].out;
  }

  // Generates the Merkle tree
  var node_to_hash = 0;
  for (var j=N; j<2*N-1; j++) {
    merkle_hashers[j] = Poseidon(2);
    merkle_hashers[j].inputs[0] <== merkle_tree_nodes[node_to_hash];
    merkle_hashers[j].inputs[1] <== merkle_tree_nodes[node_to_hash+1];
    merkle_tree_nodes[j] <== merkle_hashers[j].out;
    node_to_hash += 2;
  }

  // The Merkle root is the last node
  merkle_root <== merkle_tree_nodes[2*N-2]; 
}

component main {public [commitments]} = Locker(2);