# Pokedex

Aplicação full-stack (backend **Express + Sequelize**, frontend **Next.js**, **MySQL**, **n8n** para webhooks).  
Este README descreve como rodar o projeto localmente usando **Docker Compose** e como executar a rotina de importação de Pokémons.

---

## Pré-requisitos

- **Docker & Docker Compose** instalados (versão compatível com CLI do compose)
- **Git**
- *(Opcional, para rodar sem Docker)* **Node.js (>= 18)**, **npm**, **MySQL local**

---

## 1. Clonar o repositório

```bash
git clone https://github.com/nelsonfjunior/pokedex.git
cd pokedex
```

---

## 2. Variáveis de ambiente

Crie um `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Edite `.env` com seus valores (senhas, etc.).

Para o frontend em desenvolvimento, `NEXT_PUBLIC_API_URL` normalmente é:

```
http://localhost:3000/api/pokemons
```

- **Variável `LIMIT_POKEMONS`:** No arquivo `.env`, a variável `LIMIT_POKEMONS` define **quantos Pokémons serão importados da API** para o sistema.

---

## 3. Rodando com Docker

Subir a stack:

```bash
docker compose up -d --build
```

Verificar serviços:

```bash
docker compose ps
```

**Portas padrão:**

- Backend: [http://localhost:3000](http://localhost:3000) (`/api/pokemons`)
- Frontend: [http://localhost:3001](http://localhost:3001)
- phpMyAdmin: [http://localhost:8080](http://localhost:8080)
- n8n: [http://localhost:5678](http://localhost:5678)
  
---

## 4. Executar script de importação de Pokémons

O script está em `back/src/scripts/import-pokemons.ts` e existe um script npm para rodá-lo.  
Execute **dentro do container da API**:

```bash
# usando o serviço do compose
docker compose exec api npm run import-pokemons
```

Depois, verifique se os dados entraram no banco:

- **phpMyAdmin:** [http://localhost:8080](http://localhost:8080) (PMA_HOST=db, usuário/senha conforme `.env`)

---

## 4. Configuração do n8n

O **n8n** será utilizado para gerar descrições automáticas de Pokémons. Para configurá-lo:

1. **Crie o usuário no n8n:**
   - Acesse [http://localhost:5678](http://localhost:5678) (quando o container estiver rodando) e crie seu usuário.

2. **Crie um novo Workflow:**
   - Clique em **"Create Workflow"**.
   - Clique em **"Import From File"** e selecione o arquivo `My_workflow.json` do workflow que já está anexado no projeto.
   - Salve o workflow.

3. **Obtenha a URL do webhook de produção:**
   - No workflow importado, copie a **Production Webhook URL** (URL do webhook de produção).
   - Cole essa URL no campo `WEBHOOK_N8N` do seu `.env`, por exemplo:

```
WEBHOOK_N8N=http://n8n:5678/webhook/<id-gerado-pelo-n8n>
```

4. **Obtenha uma API Key do Gemini:**
   - Abra o [Google AI Studio (Gemini)](https://aistudio.google.com/).
   - Gere uma **API Key**.
   - Coloque no no fluxo do workflow, no Google Gemini Chat Model.

5. **Ative o workflow no n8n:**
   - Clique em **"Active"** no topo direito do workflow importado.

Com isso, o **n8n** estará pronto para receber as chamadas do backend.

---

## Testando o Projeto

Após configurar e rodar o backend e frontend, você pode acessar a interface do projeto no navegador. Nela será possível:

- **Listagem de Pokémons:** Os Pokémons são exibidos em **cards** no frontend.
- **Paginação:** A listagem é paginada, exibindo **6 Pokémons por página**.
- **Filtros:** Utilize a barra de pesquisa buscar Pokémons por nome.
- **Gerar descrição com IA:** Ao clicar no botão **"Gerar Descrição com IA"**, a aplicação utilizará o serviço de IA para criar automaticamente uma descrição para o Pokémon.

Pronto! Agora você já pode explorar, filtrar e gerar descrições para os Pokémons.



