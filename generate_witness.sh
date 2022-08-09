#!/bin/sh
# Usage: ./generate_witness.sh [circuit_name] [test_mode]

CIRCUIT=$1
TEST_FLAG=$2
INPUT=$3
if [ $TEST_FLAG == "true" ]
then
  TEST=true
else 
  TEST=false
fi

echo "Generating witness for $CIRCUIT, test mode: $TEST";

if [ $TEST_FLAG = false ]
then
  cd generated/$CIRCUIT;
  echo $INPUT > input.json;
  node ${CIRCUIT}_js/generate_witness.js ${CIRCUIT}_js/$CIRCUIT.wasm input.json witness.wtns
else
  cd test_generated/$CIRCUIT;
  echo $INPUT > input.json;
  node ${CIRCUIT}_js/generate_witness.js ${CIRCUIT}_js/$CIRCUIT.wasm input.json witness.wtns
fi
