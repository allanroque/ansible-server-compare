# Ansible Server Compare

Projeto Ansible para coleta, comparação e relatório de informações de servidores.

## Funcionalidades

- **Coleta Automática**: Coleta informações de configuração, pacotes, parâmetros e serviços
- **Comparação Inteligente**: Compara servidores e identifica diferenças
- **Relatório Web**: Interface web moderna com Apache para visualização dos resultados
- **Segmentação**: Organiza informações por categorias (sistema, rede, segurança, etc.)

## Estrutura do Projeto

```
ansible-server-compare/
├── inventory/                 # Inventário dos servidores
├── playbooks/                # Playbooks de coleta e comparação
├── roles/                    # Roles Ansible
├── templates/                # Templates HTML/CSS/JS
├── reports/                  # Relatórios gerados
└── web/                      # Arquivos web para Apache
```

## Uso

1. **Configurar inventário**:
   ```bash
   cp inventory/hosts.example inventory/hosts
   # Editar inventory/hosts com seus servidores
   ```

2. **Executar coleta**:
   ```bash
   ansible-playbook playbooks/collect_info.yml
   ```

3. **Gerar relatório**:
   ```bash
   ansible-playbook playbooks/generate_report.yml
   ```

4. **Configurar Apache**:
   ```bash
   ansible-playbook playbooks/setup_web.yml
   ```

5. **Acessar relatório**: http://localhost/report

## Requisitos

- Ansible 2.9+
- Python 3.6+
- Apache (será instalado automaticamente)
