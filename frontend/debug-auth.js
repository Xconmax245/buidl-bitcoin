async function debugAuth() {
    try {
        const fetch = global.fetch;
        const encodedBody = new URLSearchParams({
            username: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
            password: 'wallet_login_magic_string',
            address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
            loginType: 'wallet',
            redirect: 'false',
            callbackUrl: 'http://127.0.0.1:3000/onboarding'
        });

        let resLogin = await fetch('http://127.0.0.1:3000/api/auth/callback/credentials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encodedBody.toString()
        });
        
        console.log('Login Status:', resLogin.status);
        if (resLogin.headers.get('content-type')?.includes('json')) {
            console.log('Login Res JSON:', await resLogin.json());
        } else {
            console.log('Login Res TEXT:', await resLogin.text());
        }
    } catch (e) {
        console.error('Error:', e);
    }
}
debugAuth();
