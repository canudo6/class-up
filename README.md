# ClassUp v2 — aluno e professor

## Estrutura
- `index.html` — seleção entre área do aluno e área do professor.
- `aluno.html` — aplicativo do aluno.
- `professor.html` — aplicativo do professor.
- `styles.css` — visual compartilhado.
- `shared.js` — calendário, tarefas e armazenamento compartilhado.
- `aluno.js` / `professor.js` — lógica específica de cada app.
- `logo.png` — substitua pela sua logo (recomendado 512×512 px).

## O que foi expandido
1. Aplicativos separados para aluno e professor.
2. Calendário usa a data atual do aparelho, permite trocar de mês, voltar para "Hoje" e clicar em qualquer data.
3. Tarefas aparecem automaticamente na data de entrega.
4. Tarefas têm página/modal detalhada com professor, matéria, prazo, descrição e pontos.
5. Professor cria tarefas e elas entram no calendário.
6. Aluno tem 3 avatares pré-definidos.
7. Professor pode escolher uma imagem do próprio dispositivo.
8. Dados são compartilhados entre `aluno.html` e `professor.html` por `localStorage` quando as páginas estão no mesmo domínio.
9. Pontos são acumulados ao professor confirmar a conclusão.

## Importante para o GitHub Pages
Envie **todos os arquivos para a raiz do mesmo repositório**. O endereço principal pode continuar abrindo `index.html`; as áreas ficam em `/aluno.html` e `/professor.html`.

Este é ainda um protótipo: para vários celulares diferentes compartilharem os mesmos dados de forma real, será necessário um banco de dados/backend online.
