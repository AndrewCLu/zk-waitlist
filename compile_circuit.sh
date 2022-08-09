#!/bin/sh
# Usage: ./compile_circuit.sh [circuit_name] [test_mode]

CIRCUIT=$1
TEST_FLAG=$2
if [ $TEST_FLAG == "true" ]
then
  TEST=true
else 
  TEST=false
fi

echo "Compiling circuit $CIRCUIT, test mode: $TEST";

if [ $TEST_FLAG = false ]
then
  mkdir generated/$CIRCUIT;
  cd generated/$CIRCUIT;
  circom ../../circuits/$CIRCUIT.circom --r1cs --wasm --sym;
  snarkjs r1cs info $CIRCUIT.r1cs;
  snarkjs r1cs export json $CIRCUIT.r1cs $CIRCUIT.r1cs.json;
else
  mkdir test_generated/$CIRCUIT;
  cd test_generated/$CIRCUIT;
  circom ../../test_circuits/$CIRCUIT.circom --r1cs --wasm --sym;
  snarkjs r1cs info $CIRCUIT.r1cs;
  snarkjs r1cs export json $CIRCUIT.r1cs $CIRCUIT.r1cs.json;
fi
