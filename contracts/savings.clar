;; Savings Plan Contract
;; Title: savings.clar
;; Description: Managing user savings plans and completion logic

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INVALID_AMOUNT (err u101))
(define-constant ERR_PLAN_EXISTS (err u102))
(define-constant ERR_PLAN_NOT_FOUND (err u103))
(define-constant ERR_ALREADY_COMPLETED (err u104))
(define-constant ERR_LOCK_TOO_SHORT (err u105))
(define-constant ERR_PROTOCOL_PAUSED (err u106))

;; Data Vars
(define-data-var verification-contract principal tx-sender)

;; Data Maps
(define-map plans
  principal
  {
    target-amount: uint,
    asset-principal: principal,
    start-height: uint,
    duration: uint,
    completed: bool,
    verified-balance: uint
  }
)

;; Authorization
(define-public (set-verification-contract (new-contract principal))
  (begin
    (asserts! (is-eq tx-sender (var-get verification-contract)) ERR_UNAUTHORIZED)
    (ok (var-set verification-contract new-contract))
  )
)

;; Public Functions

(define-public (create-plan (target-amount uint) (target-asset principal) (duration uint))
  (let (
    (existing-plan (map-get? plans tx-sender))
    (min-lock (unwrap! (contract-call? .governance get-min-lock) ERR_UNAUTHORIZED))
    (paused (unwrap! (contract-call? .governance is-paused) ERR_UNAUTHORIZED))
    (is-registered (unwrap! (contract-call? .registry is-registered tx-sender) ERR_UNAUTHORIZED))
  )
    ;; Checks
    (asserts! (not paused) ERR_PROTOCOL_PAUSED)
    (asserts! is-registered ERR_UNAUTHORIZED)
    (asserts! (> target-amount u0) ERR_INVALID_AMOUNT)
    (asserts! (>= duration min-lock) ERR_LOCK_TOO_SHORT)
    (asserts! (is-none existing-plan) ERR_PLAN_EXISTS)

    ;; Create Plan
    (ok (map-set plans tx-sender {
      target-amount: target-amount,
      asset-principal: target-asset,
      start-height: block-height,
      duration: duration,
      completed: false,
      verified-balance: u0
    }))
  )
)

(define-public (update-plan (new-target uint) (new-duration uint))
  (let (
    (plan (unwrap! (map-get? plans tx-sender) ERR_PLAN_NOT_FOUND))
    (paused (unwrap! (contract-call? .governance is-paused) ERR_UNAUTHORIZED))
  )
    (asserts! (not paused) ERR_PROTOCOL_PAUSED)
    (asserts! (not (get completed plan)) ERR_ALREADY_COMPLETED)
    ;; User can increase target or duration, maybe decrease if not locked? 
    ;; For simplicity, allow updates if acceptable.
    ;; But usually changing terms resets the clock or depends on logic.
    ;; I'll assume updates are allowed freely for draft plans, or strict rules if locked.
    ;; The prompt says "update-plan" exists. I'll implement basic update.

    (map-set plans tx-sender (merge plan {
        target-amount: new-target,
        duration: new-duration
    }))
    (ok true)
  )
)

(define-public (cancel-plan)
   (let (
     (plan (unwrap! (map-get? plans tx-sender) ERR_PLAN_NOT_FOUND))
   )
     (asserts! (not (get completed plan)) ERR_ALREADY_COMPLETED)
     (ok (map-delete plans tx-sender))
   )
)

(define-public (mark-complete (user principal) (verified-balance uint))
  (let (
    (plan (unwrap! (map-get? plans user) ERR_PLAN_NOT_FOUND))
  )
    ;; Only Verification Contract can call this
    (asserts! (is-eq tx-sender (var-get verification-contract)) ERR_UNAUTHORIZED)
    
    (asserts! (not (get completed plan)) ERR_ALREADY_COMPLETED)
    
    (map-set plans user (merge plan {
      completed: true,
      verified-balance: verified-balance
    }))
    (ok true)
  )
)

;; Read Only

(define-read-only (get-plan (user principal))
  (map-get? plans user)
)

(define-read-only (get-progress (user principal))
    (let (
        (plan (unwrap! (map-get? plans user) ERR_PLAN_NOT_FOUND))
        (elapsed (- block-height (get start-height plan)))
        (duration (get duration plan))
    )
    (ok (/ (* elapsed u100) duration))
    )
)

(define-read-only (get-unlock-height (user principal))
    (let (
        (plan (unwrap! (map-get? plans user) ERR_PLAN_NOT_FOUND))
    )
    (ok (+ (get start-height plan) (get duration plan)))
    )
)
