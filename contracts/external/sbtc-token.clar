;; Mock sBTC SIP-010 Token for local testing

(define-fungible-token sbtc)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin
        (asserts! (is-eq tx-sender sender) (err u401))
        (ft-transfer? sbtc amount sender recipient)
    )
)

(define-read-only (get-name)
    (ok "sBTC Token")
)

(define-read-only (get-symbol)
    (ok "sBTC")
)

(define-read-only (get-decimals)
    (ok u8)
)

(define-read-only (get-balance (account principal))
    (ok (ft-get-balance sbtc account))
)

(define-public (mint (amount uint) (recipient principal))
    (ft-mint? sbtc amount recipient)
)
