;; Rewards Contract
;; Title: rewards.clar
;; Description: Tracking usage streaks and incentives

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_ALREADY_CLAIMED (err u101))
(define-constant ERR_PLAN_NOT_COMPLETE (err u102))

;; Data Maps
(define-map streaks
  principal
  {
    streak-count: uint,
    last-completion-height: uint
  }
)

;; Public Functions

(define-public (update-streak)
  (let (
    (plan (unwrap! (contract-call? .savings get-plan tx-sender) ERR_UNAUTHORIZED))
    (streak (default-to { streak-count: u0, last-completion-height: u0 } (map-get? streaks tx-sender)))
  )
    ;; Check if plan is completed
    (asserts! (get completed plan) ERR_PLAN_NOT_COMPLETE)
    
    ;; Check if already claimed for this plan (using start-height as unique ID proxy)
    (asserts! (> (get start-height plan) (get last-completion-height streak)) ERR_ALREADY_CLAIMED)
    
    ;; Update streak
    (ok (map-set streaks tx-sender {
      streak-count: (+ (get streak-count streak) u1),
      last-completion-height: (get start-height plan)
    }))
  )
)

(define-read-only (get-streak (user principal))
    (default-to { streak-count: u0, last-completion-height: u0 } (map-get? streaks user))
)
