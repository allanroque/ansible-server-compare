#!/bin/bash

# Ansible Server Compare - Script de Execução
# Este script facilita a execução do projeto

set -e

echo "========================================"
echo "  Ansible Server Compare"
echo "========================================"
echo ""

# Verificar se o inventário existe
if [ ! -f "inventory/hosts" ]; then
    echo "❌ Arquivo de inventário não encontrado!"
    echo "📝 Copie o arquivo de exemplo e configure seus servidores:"
    echo "   cp inventory/hosts.example inventory/hosts"
    echo "   # Edite inventory/hosts com seus servidores"
    echo ""
    exit 1
fi

# Verificar se há servidores configurados
SERVERS_COUNT=$(grep -c "^[^#].*ansible_host" inventory/hosts || echo "0")

if [ "$SERVERS_COUNT" -eq 0 ]; then
    echo "⚠️  Nenhum servidor configurado no inventário!"
    echo "📝 Adicione seus servidores em inventory/hosts"
    echo ""
    exit 1
fi

echo "✅ Inventário configurado com $SERVERS_COUNT servidor(es)"
echo ""

# Menu de opções
echo "Escolha uma opção:"
echo "1) Executar análise completa (coleta + relatório web)"
echo "2) Apenas coletar informações dos servidores"
echo "3) Apenas gerar relatório web"
echo "4) Apenas configurar Apache"
echo "5) Verificar conectividade com servidores"
echo "6) Sair"
echo ""

read -p "Digite sua opção (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Executando análise completa..."
        ansible-playbook playbooks/main.yml
        ;;
    2)
        echo ""
        echo "📊 Coletando informações dos servidores..."
        ansible-playbook playbooks/collect_info.yml
        ;;
    3)
        echo ""
        echo "📋 Gerando relatório web..."
        ansible-playbook playbooks/generate_report.yml
        ;;
    4)
        echo ""
        echo "🌐 Configurando Apache..."
        ansible-playbook playbooks/setup_web.yml
        ;;
    5)
        echo ""
        echo "🔍 Verificando conectividade..."
        ansible all -m ping
        ;;
    6)
        echo ""
        echo "👋 Saindo..."
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac

echo ""
echo "✅ Operação concluída!"
echo ""
echo "📁 Arquivos gerados em: ./reports/"
echo "🌐 Relatório web: http://localhost/report"
echo ""
