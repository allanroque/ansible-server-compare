// Dados globais
let serverData = {};
let comparisonData = {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupTabNavigation();
});

// Carregar dados
async function loadData() {
    try {
        const response = await fetch('data/comparison_data.json');
        comparisonData = await response.json();
        serverData = comparisonData.servers || {};
        
        updateOverview();
        updateAllTabs();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showError('Erro ao carregar dados do relatório');
    }
}

// Configurar navegação por abas
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remover classe active de todos os botões e conteúdos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado e conteúdo correspondente
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Atualizar visão geral
function updateOverview() {
    const serversCount = Object.keys(serverData).length;
    const commonConfigs = calculateCommonConfigs();
    const differences = calculateDifferences();
    
    document.getElementById('servers-count').textContent = serversCount;
    document.getElementById('common-configs').textContent = commonConfigs;
    document.getElementById('differences').textContent = differences;
    document.getElementById('last-update').textContent = new Date().toLocaleString('pt-BR');
    
    updateSummary();
}

// Calcular configurações comuns
function calculateCommonConfigs() {
    if (Object.keys(serverData).length < 2) return 0;
    
    let commonCount = 0;
    const servers = Object.values(serverData);
    
    // Verificar distribuição
    const distributions = [...new Set(servers.map(s => s.system_info?.distribution))];
    if (distributions.length === 1) commonCount++;
    
    // Verificar arquitetura
    const architectures = [...new Set(servers.map(s => s.system_info?.architecture))];
    if (architectures.length === 1) commonCount++;
    
    // Verificar kernel
    const kernels = [...new Set(servers.map(s => s.system_info?.kernel_version))];
    if (kernels.length === 1) commonCount++;
    
    return commonCount;
}

// Calcular diferenças
function calculateDifferences() {
    if (Object.keys(serverData).length < 2) return 0;
    
    let diffCount = 0;
    const servers = Object.values(serverData);
    
    // Verificar distribuição
    const distributions = [...new Set(servers.map(s => s.system_info?.distribution))];
    if (distributions.length > 1) diffCount++;
    
    // Verificar arquitetura
    const architectures = [...new Set(servers.map(s => s.system_info?.architecture))];
    if (architectures.length > 1) diffCount++;
    
    // Verificar kernel
    const kernels = [...new Set(servers.map(s => s.system_info?.kernel_version))];
    if (kernels.length > 1) diffCount++;
    
    return diffCount;
}

// Atualizar resumo
function updateSummary() {
    const summaryContent = document.getElementById('summary-content');
    const servers = Object.keys(serverData);
    
    if (servers.length === 0) {
        summaryContent.innerHTML = '<p>Nenhum servidor encontrado.</p>';
        return;
    }
    
    let html = '<div class="summary-grid">';
    
    // Informações gerais
    html += '<div class="summary-section">';
    html += '<h3>Informações Gerais</h3>';
    html += `<p><strong>Servidores analisados:</strong> ${servers.join(', ')}</p>`;
    html += `<p><strong>Data da análise:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>`;
    html += '</div>';
    
    // Comparação de sistemas
    html += '<div class="summary-section">';
    html += '<h3>Comparação de Sistemas</h3>';
    
    const distributions = [...new Set(Object.values(serverData).map(s => s.system_info?.distribution))];
    const architectures = [...new Set(Object.values(serverData).map(s => s.system_info?.architecture))];
    
    if (distributions.length === 1) {
        html += `<p class="common"><i class="fas fa-check"></i> <strong>Distribuição:</strong> ${distributions[0]} (comum)</p>`;
    } else {
        html += `<p class="different"><i class="fas fa-exclamation"></i> <strong>Distribuições:</strong> ${distributions.join(', ')} (diferentes)</p>`;
    }
    
    if (architectures.length === 1) {
        html += `<p class="common"><i class="fas fa-check"></i> <strong>Arquitetura:</strong> ${architectures[0]} (comum)</p>`;
    } else {
        html += `<p class="different"><i class="fas fa-exclamation"></i> <strong>Arquiteturas:</strong> ${architectures.join(', ')} (diferentes)</p>`;
    }
    
    html += '</div>';
    html += '</div>';
    
    summaryContent.innerHTML = html;
}

// Atualizar todas as abas
function updateAllTabs() {
    updateSystemTab();
    updateNetworkTab();
    updatePackagesTab();
    updateServicesTab();
    updateSecurityTab();
    updateStorageTab();
}

// Atualizar aba Sistema
function updateSystemTab() {
    const content = document.getElementById('system-content');
    let html = '';
    
    Object.entries(serverData).forEach(([serverName, data]) => {
        const systemInfo = data.system_info || {};
        
        html += `<div class="server-card">`;
        html += `<h3><i class="fas fa-server"></i> ${serverName}</h3>`;
        
        if (systemInfo.hostname) {
            html += `<div class="info-item"><strong>Hostname:</strong> ${systemInfo.hostname}</div>`;
        }
        
        if (systemInfo.distribution) {
            html += `<div class="info-item"><strong>Distribuição:</strong> ${systemInfo.distribution} ${systemInfo.distribution_version || ''}</div>`;
        }
        
        if (systemInfo.kernel_version) {
            html += `<div class="info-item"><strong>Kernel:</strong> ${systemInfo.kernel_version}</div>`;
        }
        
        if (systemInfo.architecture) {
            html += `<div class="info-item"><strong>Arquitetura:</strong> ${systemInfo.architecture}</div>`;
        }
        
        if (systemInfo.system_uptime) {
            html += `<div class="info-item"><strong>Uptime:</strong> ${systemInfo.system_uptime}</div>`;
        }
        
        if (systemInfo.memory_info && systemInfo.memory_info.length > 0) {
            systemInfo.memory_info.forEach(info => {
                html += `<div class="info-item"><strong>Memória:</strong> ${info}</div>`;
            });
        }
        
        if (systemInfo.load_average) {
            html += `<div class="info-item"><strong>Load Average:</strong> ${systemInfo.load_average}</div>`;
        }
        
        html += `</div>`;
    });
    
    content.innerHTML = html;
}

// Atualizar aba Rede
function updateNetworkTab() {
    const content = document.getElementById('network-content');
    let html = '';
    
    Object.entries(serverData).forEach(([serverName, data]) => {
        const networkInfo = data.network_info || {};
        
        html += `<div class="server-card">`;
        html += `<h3><i class="fas fa-network-wired"></i> ${serverName}</h3>`;
        
        if (networkInfo.hostname_info && networkInfo.hostname_info.length > 0) {
            networkInfo.hostname_info.forEach(info => {
                html += `<div class="info-item"><strong>Hostname:</strong> ${info}</div>`;
            });
        }
        
        if (networkInfo.dns && networkInfo.dns.length > 0) {
            html += `<div class="info-item"><strong>DNS:</strong></div>`;
            networkInfo.dns.forEach(dns => {
                html += `<div class="info-item" style="margin-left: 1rem;">${dns}</div>`;
            });
        }
        
        if (networkInfo.listening_ports && networkInfo.listening_ports.length > 0) {
            html += `<div class="info-item"><strong>Portas em uso:</strong></div>`;
            networkInfo.listening_ports.slice(0, 10).forEach(port => {
                html += `<div class="info-item" style="margin-left: 1rem;">${port}</div>`;
            });
            if (networkInfo.listening_ports.length > 10) {
                html += `<div class="info-item" style="margin-left: 1rem; color: #6c757d;">... e mais ${networkInfo.listening_ports.length - 10} portas</div>`;
            }
        }
        
        html += `</div>`;
    });
    
    content.innerHTML = html;
}

// Atualizar aba Pacotes
function updatePackagesTab() {
    const content = document.getElementById('packages-content');
    let html = '';
    
    Object.entries(serverData).forEach(([serverName, data]) => {
        const packagesInfo = data.packages_info || {};
        
        html += `<div class="server-card">`;
        html += `<h3><i class="fas fa-box"></i> ${serverName}</h3>`;
        
        if (packagesInfo.package_manager && packagesInfo.package_manager.length > 0) {
            packagesInfo.package_manager.forEach(pkg => {
                html += `<div class="info-item"><strong>Gerenciador:</strong> ${pkg}</div>`;
            });
        }
        
        if (packagesInfo.rpm_packages && packagesInfo.rpm_packages.length > 0) {
            html += `<div class="info-item"><strong>Pacotes RPM:</strong> ${packagesInfo.rpm_packages.length}</div>`;
            html += `<div class="info-item" style="max-height: 200px; overflow-y: auto;">`;
            packagesInfo.rpm_packages.slice(0, 20).forEach(pkg => {
                html += `<div style="margin-bottom: 0.25rem; font-size: 0.9rem;">${pkg}</div>`;
            });
            if (packagesInfo.rpm_packages.length > 20) {
                html += `<div style="color: #6c757d; font-style: italic;">... e mais ${packagesInfo.rpm_packages.length - 20} pacotes</div>`;
            }
            html += `</div>`;
        }
        
        if (packagesInfo.deb_packages && packagesInfo.deb_packages.length > 0) {
            html += `<div class="info-item"><strong>Pacotes DEB:</strong> ${packagesInfo.deb_packages.length}</div>`;
        }
        
        html += `</div>`;
    });
    
    content.innerHTML = html;
}

// Atualizar aba Serviços
function updateServicesTab() {
    const content = document.getElementById('services-content');
    let html = '';
    
    Object.entries(serverData).forEach(([serverName, data]) => {
        const servicesInfo = data.services_info || {};
        
        html += `<div class="server-card">`;
        html += `<h3><i class="fas fa-cogs"></i> ${serverName}</h3>`;
        
        if (servicesInfo.systemd_running && servicesInfo.systemd_running.length > 0) {
            html += `<div class="info-item"><strong>Serviços em execução:</strong></div>`;
            servicesInfo.systemd_running.slice(0, 15).forEach(service => {
                html += `<div class="info-item" style="margin-left: 1rem; font-size: 0.9rem;">${service}</div>`;
            });
            if (servicesInfo.systemd_running.length > 15) {
                html += `<div class="info-item" style="margin-left: 1rem; color: #6c757d;">... e mais ${servicesInfo.systemd_running.length - 15} serviços</div>`;
            }
        }
        
        if (servicesInfo.failed_services && servicesInfo.failed_services.length > 1) {
            html += `<div class="info-item missing"><strong>Serviços com falha:</strong></div>`;
            servicesInfo.failed_services.forEach(service => {
                html += `<div class="info-item missing" style="margin-left: 1rem;">${service}</div>`;
            });
        }
        
        html += `</div>`;
    });
    
    content.innerHTML = html;
}

// Atualizar aba Segurança
function updateSecurityTab() {
    const content = document.getElementById('security-content');
    let html = '';
    
    Object.entries(serverData).forEach(([serverName, data]) => {
        const securityInfo = data.security_info || {};
        
        html += `<div class="server-card">`;
        html += `<h3><i class="fas fa-shield-alt"></i> ${serverName}</h3>`;
        
        if (securityInfo.firewall && securityInfo.firewall.length > 0) {
            html += `<div class="info-item"><strong>Firewall:</strong></div>`;
            securityInfo.firewall.slice(0, 5).forEach(fw => {
                html += `<div class="info-item" style="margin-left: 1rem;">${fw}</div>`;
            });
        }
        
        if (securityInfo.selinux && securityInfo.selinux.length > 0) {
            html += `<div class="info-item"><strong>SELinux:</strong></div>`;
            securityInfo.selinux.slice(0, 3).forEach(sel => {
                html += `<div class="info-item" style="margin-left: 1rem;">${sel}</div>`;
            });
        }
        
        if (securityInfo.ssh && securityInfo.ssh.length > 0) {
            html += `<div class="info-item"><strong>SSH:</strong></div>`;
            securityInfo.ssh.forEach(ssh => {
                html += `<div class="info-item" style="margin-left: 1rem;">${ssh}</div>`;
            });
        }
        
        if (securityInfo.open_ports && securityInfo.open_ports.length > 0) {
            html += `<div class="info-item"><strong>Portas abertas:</strong></div>`;
            securityInfo.open_ports.slice(0, 10).forEach(port => {
                html += `<div class="info-item" style="margin-left: 1rem;">${port}</div>`;
            });
        }
        
        html += `</div>`;
    });
    
    content.innerHTML = html;
}

// Atualizar aba Armazenamento
function updateStorageTab() {
    const content = document.getElementById('storage-content');
    let html = '';
    
    Object.entries(serverData).forEach(([serverName, data]) => {
        const storageInfo = data.storage_info || {};
        
        html += `<div class="server-card">`;
        html += `<h3><i class="fas fa-hdd"></i> ${serverName}</h3>`;
        
        if (storageInfo.disk_usage && storageInfo.disk_usage.length > 0) {
            html += `<div class="info-item"><strong>Uso de disco:</strong></div>`;
            storageInfo.disk_usage.forEach(disk => {
                html += `<div class="info-item" style="margin-left: 1rem;">${disk}</div>`;
            });
        }
        
        if (storageInfo.partitions && storageInfo.partitions.length > 0) {
            html += `<div class="info-item"><strong>Partições:</strong></div>`;
            storageInfo.partitions.slice(0, 10).forEach(part => {
                html += `<div class="info-item" style="margin-left: 1rem;">${part}</div>`;
            });
        }
        
        if (storageInfo.lvm && storageInfo.lvm.length > 0) {
            html += `<div class="info-item"><strong>LVM:</strong></div>`;
            storageInfo.lvm.slice(0, 5).forEach(lvm => {
                html += `<div class="info-item" style="margin-left: 1rem;">${lvm}</div>`;
            });
        }
        
        html += `</div>`;
    });
    
    content.innerHTML = html;
}

// Funções para mostrar pacotes comuns/diferentes
function showCommonPackages() {
    // Implementar lógica para mostrar pacotes comuns
    alert('Funcionalidade de pacotes comuns será implementada');
}

function showDifferentPackages() {
    // Implementar lógica para mostrar pacotes diferentes
    alert('Funcionalidade de pacotes diferentes será implementada');
}

function showCommonServices() {
    // Implementar lógica para mostrar serviços comuns
    alert('Funcionalidade de serviços comuns será implementada');
}

function showDifferentServices() {
    // Implementar lógica para mostrar serviços diferentes
    alert('Funcionalidade de serviços diferentes será implementada');
}

// Função para mostrar erros
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 1rem;
        border-radius: 6px;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
