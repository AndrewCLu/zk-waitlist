# Potential Ideas
- Implement zk proofs in Scala-Cats
- Private lending protocol (hidden positions)
- Zk proof wiki
- Anonymous identity store (plug and play personal data for apps)
- Private reputation system
- Reputation based lending protocol (collateralizaiton ratio decreases with repaid loans)
- Mobile wallet for attestations (rewards, proofs of ownership, etc.)

Sketch (reputation based stablecoin lending):
- Central node stores protocol state
- State hash held in smart contract
- When user wants to borrow or redeem they send proof to central node, who generates zkp
- Central node updates state and submits a validity proof to smart contract along with updated state hash
- Every redemption triggers a positive attestation to one's position
- Every liquidation triggers a negative attestation 
- ZK proofs
	- Check borrower has sufficient collateral 
	- Check borrow amount within collateralization ratio given attestations
	- Check redeemer has balance to trigger redemption
	- Check liquidations were valid
	- Check balances across actions correctly updated
	- Check attestations are correctly applied

Notion: https://www.notion.so/ZK-Exploration-98382d073d064f41a139af7eeff8604a 