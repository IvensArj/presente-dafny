# Home — Para você

Página estática, sem backend, sem login e sem armazenamento. É apenas a
porta de entrada que leva aos dois desafios.

## 1. Onde alterar os links

Abra `script.js` e edite as duas primeiras linhas:

```js
const FIRST_CHALLENGE_URL = "desafio1/index.html";
const SECOND_CHALLENGE_URL = "desafio2/index.html";
```

Por padrão, os dois caminhos apontam para pastas irmãs desta (`desafio1/` e
`desafio2/`), cada uma com seu próprio `index.html`. Se publicar os desafios
em outro endereço (outro repositório, outro domínio, outra subpasta), troque
o valor pela URL completa, por exemplo:

```js
const FIRST_CHALLENGE_URL = "https://seunome.github.io/before-your-eyes/";
const SECOND_CHALLENGE_URL = "https://seunome.github.io/gris-pintura/";
```

## 2. Outros textos editáveis

Em `index.html`, marcados com comentários:
- Frase pequena do topo (`id="eyebrow"`) — pode deixar em branco.
- Texto principal (`id="headline"`).
- Subtítulo (`id="subline"`).
- Título do desafio 1 e do desafio 2 (dentro de cada `.card-title`).

## 3. Como testar localmente

A forma mais simples é abrir `index.html` diretamente no navegador.

Se os links dos desafios apontarem para pastas locais (`desafio1/`,
`desafio2/`), coloque essas pastas ao lado desta (`home/`) antes de testar,
ou sirva tudo com um servidor local, por exemplo:

```
python3 -m http.server
```

rodando na pasta que contém `home/`, `desafio1/` e `desafio2/` juntas.

## 4. Como publicar como site estático

Qualquer uma destas opções funciona, sem configuração adicional:

- **Netlify**: arraste a pasta que contém `home/` (e as pastas dos dois
  desafios, se estiverem juntas) para app.netlify.com/drop.
- **Vercel**: `vercel` na pasta via CLI, ou importe o repositório no painel.
- **Cloudflare Pages**: conecte o repositório ou faça upload direto da pasta.

## 5. Como publicar no GitHub Pages

Se quiser tudo em um único site (home + os dois desafios juntos):

1. Crie um repositório e organize assim, na raiz:
   ```
   index.html   ← conteúdo desta pasta home/
   style.css
   script.js
   desafio1/
       index.html
       ...
   desafio2/
       index.html
       ...
   ```
2. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`,
   pasta `/ (root)`.
3. O link público servirá a home em `/` e cada desafio em `/desafio1/` e
   `/desafio2/` — o que já bate com os valores padrão de
   `FIRST_CHALLENGE_URL` e `SECOND_CHALLENGE_URL` em `script.js`.

Se preferir manter cada desafio em um repositório/site separado, publique
cada um independentemente e apenas atualize as duas URLs em `script.js`
com os endereços completos.
