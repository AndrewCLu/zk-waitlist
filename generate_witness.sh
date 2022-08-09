#!/bin/sh
# Usage: ./generate_witness.sh [circuit_name] [test_mode]

CIRCUIT=$1
TEST_FLAG=$2
SAMPLE_INPUT='test'
if [ $TEST_FLAG == "true" ]
then
  TEST=true
else 
  TEST=false
fi

echo "Generating witness for $CIRCUIT, test mode: $TEST";

if [ $TEST_FLAG = false ]
then
  mkdir generated/$CIRCUIT;
  cd generated/$CIRCUIT;
  circom ../../circuits/$CIRCUIT.circom --r1cs --wasm --sym;
  snarkjs r1cs info $CIRCUIT.r1cs;
  snarkjs r1cs export json $CIRCUIT.r1cs $CIRCUIT.r1cs.json;
  echo $SAMPLE_INPUT > input.json;
  node ${CIRCUIT}_js/generate_witness.js ${CIRCUIT}_js/$CIRCUIT.wasm input.json witness.wtns
else
  mkdir test_generated/$CIRCUIT;
  cd test_generated/$CIRCUIT;
  circom ../../test_circuits/$CIRCUIT.circom --r1cs --wasm --sym;
  snarkjs r1cs info $CIRCUIT.r1cs;
  snarkjs r1cs export json $CIRCUIT.r1cs $CIRCUIT.r1cs.json;
  echo $SAMPLE_INPUT > input.json;
  node ${CIRCUIT}_js/generate_witness.js ${CIRCUIT}_js/$CIRCUIT.wasm input.json witness.wtns
fi
