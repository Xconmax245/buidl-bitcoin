;; Registry Contract
;; Title: registry.clar
;; Description: Central user registry linking Stacks principal and Bitcoin/xPub identities

;; Constants
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_ALREADY_REGISTERED (err u101))
(define-constant ERR_USER_NOT_FOUND (err u102))

;; Data Maps
(define-map users
  principal
  {
    btc-address: (buff 34),
    xpub-hash: (buff 32),
    created-at: uint,
    active: bool
  }
)

;; Public Functions

(define-public (register-user (btc-address (buff 34)) (xpub-hash (buff 32)))
  (let (
    (existing-user (map-get? users tx-sender))
  )
    ;; Ensure user is not already registered
    (asserts! (is-none existing-user) ERR_ALREADY_REGISTERED)
    
    ;; Register user
    (ok (map-set users tx-sender {
      btc-address: btc-address,
      xpub-hash: xpub-hash,
      created-at: block-height,
      active: true
    }))
  )
)

(define-public (update-btc-address (new-btc-address (buff 34)))
  (let (
    (user (unwrap! (map-get? users tx-sender) ERR_USER_NOT_FOUND))
  )
    ;; Update BTC address
    (ok (map-set users tx-sender (merge user {
      btc-address: new-btc-address
    })))
  )
)

(define-public (deactivate-user)
  (let (
    (user (unwrap! (map-get? users tx-sender) ERR_USER_NOT_FOUND))
  )
    ;; Deactivate user
    (ok (map-set users tx-sender (merge user {
        active: false
    })))
  )
)

;; Read Only

(define-read-only (get-user (principal principal))
  (map-get? users principal)
)

(define-read-only (is-registered (principal principal))
  (is-some (map-get? users principal))
)

(define-read-only (is-active (principal principal))
    (match (map-get? users principal)
        user (get active user)
        false
    )
)
