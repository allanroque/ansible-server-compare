# Ansible Server Compare - Documentação

## Visão Geral

O **Ansible Server Compare** é uma solução completa para coleta, análise e comparação de informações de servidores Linux. O projeto utiliza Ansible para automatizar a coleta de dados e gera uma interface web moderna para visualização e comparação dos resultados.

## Funcionalidades Principais

### 🔍 Coleta de Informações
- **Sistema**: Distribuição, kernel, arquitetura, uptime, CPU, memória
- **Rede**: Interfaces, roteamento, DNS, portas abertas, conexões
- **Pacotes**: Lista de pacotes instalados (RPM/DEB), gerenciadores
- **Serviços**: Serviços em execução, habilitados, com falha
- **Segurança**: Firewall, SELinux, usuários, SSH, sudo
- **Armazenamento**: Discos, partições, LVM, RAID, inodes

### 📊 Comparação Inteligente
- Identificação automática de configurações comuns
- Destaque de diferenças entre servidores
- Análise de pacotes e serviços compartilhados
- Relatórios de conformidade

### 🌐 Interface Web Moderna
- Design responsivo e intuitivo
- Navegação por abas organizadas
- Visualização segmentada por categorias
- Destaque visual de diferenças e similaridades

## Estrutura do Projeto

```
ansible-server-compare/
├── inventory/                 # Configuração dos servidores
│   ├── hosts.example         # Exemplo de inventário
│   └── hosts                 # Seu inventário (não versionado)
├── playbooks/               # Playbooks Ansible
│   ├── main.yml             # Playbook principal
│   ├── collect_info.yml     # Coleta de informações
│   ├── generate_report.yml  # Geração de relatórios
│   └── setup_web.yml        # Configuração do Apache
├── roles/                   # Roles Ansible
│   ├── server_info/         # Role de coleta de dados
│   └── web_setup/           # Role de configuração web
├── templates/               # Templates HTML/CSS/JS
├── reports/                 # Relatórios gerados
├── web/                     # Arquivos web para Apache
├── run.sh                   # Script de execução
└── README.md               # Documentação principal
```

## Instalação e Configuração

### Pré-requisitos

1. **Ansible 2.9+**
   ```bash
   pip install ansible>=2.9.0
   ```

2. **Python 3.6+**
   ```bash
   python3 --version
   ```

3. **Acesso SSH aos servidores**
   - Chaves SSH configuradas
   - Usuário com privilégios sudo

### Configuração Inicial

1. **Clonar o repositório**
   ```bash
   git clone <repository-url>
   cd ansible-server-compare
   ```

2. **Configurar inventário**
   ```bash
   cp inventory/hosts.example inventory/hosts
   # Editar inventory/hosts com seus servidores
   ```

3. **Exemplo de inventário**
   ```ini
   [servers]
   server1 ansible_host=192.168.1.10 ansible_user=root
   server2 ansible_host=192.168.1.11 ansible_user=root
   server3 ansible_host=192.168.1.12 ansible_user=root

   [webserver]
   localhost ansible_connection=local

   [all:vars]
   ansible_python_interpreter=/usr/bin/python3
   ```

## Uso

### Método 1: Script Interativo (Recomendado)

```bash
./run.sh
```

O script oferece um menu interativo com as seguintes opções:
1. **Análise completa** - Coleta + relatório web
2. **Apenas coleta** - Coleta informações dos servidores
3. **Apenas relatório** - Gera relatório web
4. **Apenas Apache** - Configura servidor web
5. **Verificar conectividade** - Testa conexão com servidores

### Método 2: Playbooks Individuais

```bash
# Coletar informações
ansible-playbook playbooks/collect_info.yml

# Gerar relatório
ansible-playbook playbooks/generate_report.yml

# Configurar Apache
ansible-playbook playbooks/setup_web.yml

# Executar tudo
ansible-playbook playbooks/main.yml
```

### Método 3: Comandos Ansible Diretos

```bash
# Verificar conectividade
ansible all -m ping

# Executar com tags específicas
ansible-playbook playbooks/collect_info.yml --tags system,network

# Executar em servidores específicos
ansible-playbook playbooks/collect_info.yml --limit server1,server2
```

## Tags Disponíveis

O projeto utiliza tags para execução seletiva:

- `facts` - Coleta de facts básicos
- `system` - Informações do sistema
- `network` - Configurações de rede
- `packages` - Pacotes instalados
- `services` - Serviços em execução
- `security` - Configurações de segurança
- `storage` - Informações de armazenamento
- `save` - Salvar dados coletados

### Exemplos de Uso com Tags

```bash
# Coletar apenas informações de sistema e rede
ansible-playbook playbooks/collect_info.yml --tags system,network

# Coletar tudo exceto pacotes
ansible-playbook playbooks/collect_info.yml --skip-tags packages

# Executar apenas coleta de segurança
ansible-playbook playbooks/collect_info.yml --tags security
```

## Interface Web

### Acesso
- **URL**: http://localhost/report
- **Porta**: 80 (Apache)
- **Diretório**: /var/www/html/report

### Funcionalidades da Interface

#### 📊 Visão Geral
- Resumo dos servidores analisados
- Métricas de configurações comuns
- Contador de diferenças encontradas
- Data da última atualização

#### 🖥️ Sistema
- Informações de distribuição
- Versão do kernel
- Arquitetura
- Uptime e load average
- Informações de CPU e memória

#### 🌐 Rede
- Configurações de hostname
- Servidores DNS
- Portas em uso
- Interfaces de rede

#### 📦 Pacotes
- Lista de pacotes instalados
- Gerenciador de pacotes
- Comparação entre servidores
- Filtros para pacotes comuns/diferentes

#### ⚙️ Serviços
- Serviços em execução
- Serviços habilitados
- Serviços com falha
- Comparação de serviços

#### 🔒 Segurança
- Status do firewall
- Configuração SELinux
- Configurações SSH
- Portas abertas
- Usuários e sudo

#### 💾 Armazenamento
- Uso de disco
- Partições
- Configuração LVM
- Status RAID

## Personalização

### Adicionar Novas Coletas

1. **Criar nova tarefa** em `roles/server_info/tasks/`
2. **Adicionar ao main.yml** do role
3. **Atualizar interface web** se necessário

### Exemplo: Adicionar Coleta de Logs

```yaml
# roles/server_info/tasks/logs_info.yml
---
- name: Get system logs
  ansible.builtin.shell: |
    journalctl --no-pager --since "1 hour ago" | tail -50
  register: system_logs
  changed_when: false

- name: Set logs facts
  ansible.builtin.set_fact:
    logs_info:
      recent_logs: "{{ system_logs.stdout_lines }}"
```

### Personalizar Interface Web

1. **CSS**: Editar `roles/web_setup/files/css/style.css`
2. **JavaScript**: Editar `roles/web_setup/files/js/app.js`
3. **HTML**: Editar `roles/web_setup/files/index.html`

## Troubleshooting

### Problemas Comuns

#### ❌ Erro de Conectividade
```bash
# Verificar conectividade
ansible all -m ping

# Verificar configuração SSH
ssh -o ConnectTimeout=10 user@server
```

#### ❌ Erro de Permissões
```bash
# Verificar permissões do usuário
ansible all -m shell -a "sudo -l"

# Executar com become
ansible-playbook playbooks/collect_info.yml --become
```

#### ❌ Erro de Python
```bash
# Especificar interpretador Python
ansible all -m shell -a "python3 --version"

# Configurar no inventário
ansible_python_interpreter=/usr/bin/python3
```

#### ❌ Apache não Inicia
```bash
# Verificar status do Apache
systemctl status httpd
systemctl status apache2

# Verificar logs
tail -f /var/log/httpd/error_log
tail -f /var/log/apache2/error.log
```

### Logs e Debug

```bash
# Executar com verbose
ansible-playbook playbooks/collect_info.yml -vvv

# Executar com debug
ansible-playbook playbooks/collect_info.yml --tags debug

# Verificar facts coletados
ansible server1 -m setup
```

## Contribuição

### Estrutura de Desenvolvimento

1. **Fork do repositório**
2. **Criar branch para feature**
3. **Implementar mudanças**
4. **Testar localmente**
5. **Criar Pull Request**

### Padrões de Código

- **Ansible**: Usar FQCN (Fully Qualified Collection Names)
- **YAML**: Indentação de 2 espaços
- **JavaScript**: ES6+, async/await
- **CSS**: BEM methodology
- **HTML**: Semantic HTML5

### Testes

```bash
# Testar sintaxe dos playbooks
ansible-playbook playbooks/collect_info.yml --syntax-check

# Testar conectividade
ansible all -m ping

# Testar coleta em um servidor
ansible-playbook playbooks/collect_info.yml --limit server1
```

## Licença

Este projeto está licenciado sob a MIT License.

## Suporte

- **Issues**: GitHub Issues
- **Documentação**: Este arquivo e README.md
- **Exemplos**: Diretório `examples/`

---

**Desenvolvido com ❤️ usando Ansible**
