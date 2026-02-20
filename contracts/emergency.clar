;; Emergency Guard Contract
;; Title: emergency.clar
;; Description: Circuit breaker for protocol safety

(define-constant ERR_UNAUTHORIZED (err u100))

;; Data Vars
(define-data-var guardians (list 5 principal) (list tx-sender)) 

;; Public Functions

(define-public (emergency-stop)
  (begin
    ;; Check if caller is a guardian (simplified)
    (asserts! (is-some (index-of (var-get guardians) tx-sender)) ERR_UNAUTHORIZED)
    
    ;; Trigger pause in governance
    (contract-call? .governance set-paused true)
  )
)

(define-public (emergency-resume)
  (begin
    (asserts! (is-some (index-of (var-get guardians) tx-sender)) ERR_UNAUTHORIZED)
    (contract-call? .governance set-paused false)
  )
)
