document.getElementById('btnReloaded').addEventListener('click', () => {
    window.location.reload();
});

window.addEventListener('online', () => {
    window.location.reload();
});

async function checkNetworkAndReload() {
    try {
        const response = await fetch('.');
        if (response.status >= 200 && response.status < 500) {
            window.location.reload();
            return;
        }
    } catch {
    }
    window.setTimeout(checkNetworkAndReload, 2500);
}

checkNetworkAndReload();

