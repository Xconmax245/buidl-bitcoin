;; sBTC Vault Contract
;; Title: vault.clar
;; Description: Optional sBTC custody tied to savings completion

(use-trait ft-trait .sip-010-trait-ft-standard.sip-010-trait)

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_LOCK_ACTIVE (err u101))
(define-constant ERR_INSUFFICIENT_FUNDS (err u102))

;; Data Maps
(define-map vaults
  { user: principal, token: principal }
  {
    locked-amount: uint,
    unlock-height: uint,
    withdrawn: bool
  }
)

;; Public Functions

(define-public (deposit-asset (amount uint) (token-trait <ft-trait>))
  (let (
    (token-principal (contract-of token-trait))
    (plan (unwrap! (contract-call? .savings get-plan tx-sender) ERR_UNAUTHORIZED))
    (unlock-height (unwrap! (contract-call? .savings get-unlock-height tx-sender) ERR_UNAUTHORIZED))
    (vault-key { user: tx-sender, token: token-principal })
    (current-vault (default-to { locked-amount: u0, unlock-height: unlock-height, withdrawn: false } (map-get? vaults vault-key)))
  )
    ;; Transfer asset to this contract
    (try! (contract-call? token-trait transfer amount tx-sender (as-contract tx-sender) none))
    
    ;; Update vault state
    (map-set vaults vault-key {
      locked-amount: (+ (get locked-amount current-vault) amount),
      unlock-height: unlock-height,
      withdrawn: false
    })
    (ok true)
  )
)

(define-public (withdraw-after-unlock (token-trait <ft-trait>))
  (let (
    (token-principal (contract-of token-trait))
    (vault-key { user: tx-sender, token: token-principal })
    (vault (unwrap! (map-get? vaults vault-key) ERR_UNAUTHORIZED))
    (amount (get locked-amount vault))
    (unlock-height (get unlock-height vault))
    (plan (unwrap! (contract-call? .savings get-plan tx-sender) ERR_UNAUTHORIZED))
  )
    ;; Check conditions: Either marked complete OR block height reached
    (asserts! (or (get completed plan) (>= block-height unlock-height)) ERR_LOCK_ACTIVE)
    (asserts! (not (get withdrawn vault)) ERR_UNAUTHORIZED)
    
    ;; Transfer back
    (as-contract (try! (contract-call? token-trait transfer amount (as-contract tx-sender) tx-sender none)))
    
    ;; Update state
    (map-set vaults vault-key (merge vault {
        withdrawn: true,
        locked-amount: u0
    }))
    (ok true)
  )
)

;; Read Only
(define-read-only (get-vault (user principal) (token principal))
  (map-get? vaults { user: user, token: token })
)
