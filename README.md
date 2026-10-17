# London para Todos - Gestão de Frota e Vencimentos

Sistema completo de gestão de frota de veículos, clientes/motoristas e controle automatizado de alertas de prazos legais no Reino Unido (**MOT**, **Road Tax**, **Seguro Automotivo** e **Aluguel Semanal**), com exportação nativa para Excel (`.xlsx`).

---

## 🚀 Funcionalidades

- **Controle de Prazos Legais (Regra 0 a 3 Dias)**:
  - Alertas automáticos para documentos que vencem hoje ou nos próximos 1, 2 e 3 dias.
  - Filtros por criticidade: *Vencendo em até 3 dias*, *Já Vencidos*, *Próximos 30 dias* e *Todos*.
  - Disparo de avisos pré-formatados direto para o WhatsApp do motorista ou por e-mail.
  - Renovação rápida de vencimento direto pelo painel de alertas.

- **Cadastro Integrado de Cliente e Veículo**:
  - Dados pessoais completos com validação de formato para e-mail e telefone.
  - Anexo de documentos com upload para **Identidade/Passaporte** e **Carteira de Motorista (DVLA/CNH)**.
  - Validação de placas com checagem de duplicidade no banco de dados.

- **Gestão da Frota & Exportação**:
  - Catálogo de veículos com badges coloridas de status de conformidade.
  - Botão **EXPORTAR PARA EXCEL** que gera a planilha `frota_veiculos.xlsx` formatada para auditoria e relatórios.

- **Painel Executivo (Dashboard)**:
  - Total de veículos, motoristas ativos, receita semanal estimada (£) e índice percentual de conformidade legal.

- **Tema Claro / Tema Escuro**:
  - Alternador de tema no cabeçalho com persistência no navegador.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Vite**
- **Lucide Icons**
- **SheetJS (xlsx)** para exportação de planilhas
- **LocalStorage API** com dados padrão de demonstração

---

## 💻 Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd london-para-todos
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra no navegador:
   ```
   http://localhost:3000
   ```
