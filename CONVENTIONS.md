# Regras de trabalho

- Não pergunte se deve criar arquivo novo. Decida e crie, seguindo o padrão
  dos arquivos existentes (objeto const X = {...}, sem módulos ES, sem build).
- Considere automaticamente todos os arquivos em js/ e pages/ como parte do
  projeto. Não pergunte se deve levá-los em conta.
- JS vanilla apenas. Não introduza dependências, frameworks ou bundler.
- Antes de editar, rode `grep` para descobrir a estrutura real. Não invente IDs,
  classes ou funções.
- Após cada alteração, garanta que todas as 7 páginas carregam sem erro de
  console.
- Um commit por tarefa. Nunca commite .env.
- Se a tarefa pedir algo que contraria uma regra, não faça: explique em uma
  linha o conflito e continue com o resto.
