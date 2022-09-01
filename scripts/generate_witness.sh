#!/bin/sh
# Usage: ./generate_witness.sh [circuit_name] [test_mode] [generate_proof] [input]

CIRCUIT=$1
TEST_FLAG=$2
PROOF_FLAG=$3
INPUT=$4

if [ $# != 4 ]; then
  echo "Usage: ./generate_witness.sh [circuit_name] [test_mode (true/false)] [generate_proof (true/false)] [input (json)]"
  exit
fi

if [ $TEST_FLAG == "true" ]; then
  TEST=true
elif [ $TEST_FLAG == "false" ];then
  TEST=false
else
  echo "Test mode must be set to either true or false!"
  exit
fi

if [ $PROOF_FLAG == "true" ]; then
  PROOF=true
elif [ $PROOF_FLAG == "false" ]; then
  PROOF=false
else
  echo "Proof mode must be set to either true or false!"
  exit
fi

echo "Generating witness for $CIRCUIT, test mode: $TEST, proof mode: $PROOF";

if [ $TEST = false ]; then
  cd generated/$CIRCUIT;
  echo $INPUT > input.json;
  node ${CIRCUIT}_js/generate_witness.js ${CIRCUIT}_js/$CIRCUIT.wasm input.json witness.wtns
  if [ $PROOF = true ]; then
    snarkjs plonk prove ${CIRCUIT}_final.zkey witness.wtns proof.json public.json;
  fi
else
  cd test_generated/$CIRCUIT;
  echo $INPUT > input.json;
  node ${CIRCUIT}_js/generate_witness.js ${CIRCUIT}_js/$CIRCUIT.wasm input.json witness.wtns
  if [ $PROOF = true ]; then
    snarkjs plonk prove ${CIRCUIT}_final.zkey witness.wtns proof.json public.json;
  fi
fi
