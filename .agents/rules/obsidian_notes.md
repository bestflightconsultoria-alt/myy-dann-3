# Regra de Registro Automático no Obsidian

Sempre que durante a conversa for explicado um conceito novo, procedimento, arquitetura de sistema, resolução de bug complexo ou aprendizado técnico:

1. **Local de Salvamento**:
   - Salve a nota na pasta do Obsidian: `C:\Users\Lucas\Documents\Obsidian Vault\Aprendizados\`
   - Se a pasta `Aprendizados` não existir, crie-a.

2. **Formato do Arquivo**:
   - Nome do arquivo: `YYYY-MM-DD-nome-do-topico.md` (em k体系-kebab-case ou simples com caracteres limpos).
   - Formato do conteúdo em Markdown rico compatível com Obsidian:
     - Cabeçalho Frontmatter com data, assunto e tags (ex: `#aprendizado`, `#procedimento`, `#sistema`, `#desenvolvimento`).
     - Título principal `# Título do Aprendizado`.
     - Seções organizadas (Resumo, Passo a Passo/Procedimento, Trechos de Código, Conclusão/Links `[[Wikilinks]]`).

3. **Execução Silenciosa e Notificação**:
   - Escreva o arquivo no Obsidian em segundo plano.
   - Avise brevemente o usuário ao final com o link ou caminho da nota criada no Obsidian.
