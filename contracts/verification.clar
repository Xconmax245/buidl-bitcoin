;; Verification Contract
;; Title: verification.clar
;; Description: Logic to verify off-chain BTC state and on-chain time conditions

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INVALID_SIGNATURE (err u101))
(define-constant ERR_TIME_NOT_REACHED (err u102))
(define-constant ERR_TARGET_NOT_MET (err u103))

;; Data Vars
(define-data-var oracle-public-key (buff 33) 0x00) ;; Set by admin in real deploy

;; Admin
(define-public (set-oracle-key (new-key (buff 33)))
  (begin
    ;; In real system this checks specific admin rights
    (ok (var-set oracle-public-key new-key))
  )
)

;; Public Functions

;; Verifies balance using Oracle signature
(define-public (verify-balance (user principal) (balance uint) (signature (buff 65)))
  (let (
     ;; Reconstruct message hash: sha256(user . balance)
     ;; In reality, include nonce/block-height to prevent replay
     (msg-hash (sha256 (unwrap-panic (to-consensus-data? { user: user, balance: balance }))))
     (recovered-pubkey (unwrap! (secp256k1-recover? msg-hash signature 1) ERR_INVALID_SIGNATURE)) ;; assume recovery id 1 or pass it
  )
    ;; Check signature matches Oracle
    (asserts! (is-eq recovered-pubkey (var-get oracle-public-key)) ERR_UNAUTHORIZED)
    
    ;; Check plan targets
    (let (
        (plan (unwrap! (contract-call? .savings get-plan user) ERR_UNAUTHORIZED))
        (target (get target-amount plan))
        (start (get start-height plan))
        (duration (get duration plan))
        (expiry (+ start duration))
    )
        ;; Time check
        (asserts! (>= block-height expiry) ERR_TIME_NOT_REACHED)
        
        ;; Balance check
        (asserts! (>= balance target) ERR_TARGET_NOT_MET)
        
        ;; Call Savings to mark complete
        (as-contract (contract-call? .savings mark-complete user balance))
    )
  )
)

;; Time-only verification (if balance not needed or already trusted)
(define-public (verify-time (user principal))
    (let (
        (plan (unwrap! (contract-call? .savings get-plan user) ERR_UNAUTHORIZED))
        (start (get start-height plan))
        (duration (get duration plan))
        (expiry (+ start duration))
    )
        (asserts! (>= block-height expiry) ERR_TIME_NOT_REACHED)
        (ok true)
    )
)
