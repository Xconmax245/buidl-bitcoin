;; Governance Contract
;; Title: governance.clar
;; Description: Managing protocol parameters and emergency states

(define-constant ERR_UNAUTHORIZED (err u100))

;; Data Vars
(define-data-var contract-owner principal tx-sender)
(define-data-var min-lock-duration uint u144) ;; ~1 day in blocks
(define-data-var protocol-paused bool false)

;; Public Functions

(define-public (set-min-lock (new-min-lock uint))
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
        (ok (var-set min-lock-duration new-min-lock))
    )
)

(define-public (set-paused (paused bool))
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_UNAUTHORIZED)
        (ok (var-set protocol-paused paused))
    )
)

;; Read Only

(define-read-only (get-min-lock)
    (var-get min-lock-duration)
)

(define-read-only (is-paused)
    (var-get protocol-paused)
)

(define-read-only (get-owner)
    (var-get contract-owner)
)
