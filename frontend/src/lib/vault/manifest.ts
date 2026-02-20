
export interface VaultManifest {
    vaultId: string;
    owner: string;
    timestamp: string;
    parameters: {
        duration: number;
        penalty: number;
        targetAmount: number;
        tier: string;
    };
    network: {
        chain: string;
        consensus: string;
        finality: string;
    };
    security: {
        postConditionMode: string;
        contractHash: string;
        auditVersion: string;
    };
}

export const generateVaultManifest = (data: any): VaultManifest => {
    return {
        vaultId: `IRON-V${Math.floor(Math.random() * 1000000)}`,
        owner: data.address || '0xPRIVATE_KEY_HOLDER',
        timestamp: new Date().toISOString(),
        parameters: {
            duration: data.duration,
            penalty: data.penalty,
            targetAmount: data.targetAmount,
            tier: data.tier || 'Strategic',
        },
        network: {
            chain: 'Stacks L2 (Bitcoin Layer)',
            consensus: 'Proof of Transfer (PoX)',
            finality: 'Bitcoin Finality (100 blocks)',
        },
        security: {
            postConditionMode: 'DENY_ALL (Strict)',
            contractHash: '0x2a3b4c5d...e6f7',
            auditVersion: 'v1.4.2-stable',
        }
    };
};

export const downloadManifest = (manifest: VaultManifest) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(manifest, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `ironclad_manifest_${manifest.vaultId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};
