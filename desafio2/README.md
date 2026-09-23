# Before Your Eyes

Página estática, sem backend. O texto inicial fica em fundo escuro; quando a
pessoa muda o **tema do sistema/navegador** para claro, a página faz uma
transição suave e revela a chave.

## Como alterar a chave

Abra `script.js` e edite os grupos numéricos no início do arquivo, na seção
`CONFIGURAÇÃO DO PRESENTE`. Cada número é o código de um caractere, e cada
grupo se torna um bloco separado por hífen. Por exemplo, `65, 66, 67`
representa `ABC`.

```js
const GIFT_KEY_PARTS = [
  [67, 79, 76, 79, 81, 81, 85, 69],
  [65, 67, 72, 65, 86, 69]
];
```

A chave só é reconstruída e inserida no DOM após a mudança para o tema claro.
Isso evita a descoberta casual, mas não é segurança criptográfica: em um site
estático, o conteúdo ainda pode ser inspecionado por alguém determinado.

## Como alterar textos

Os textos ficam em `index.html`:
- Frase inicial: dentro do elemento com `id="opening"`.
- Frase de desbloqueio e subtítulo: dentro da `div` com `id="reveal"`.

## Como alterar cores

Abra `style.css` e edite as variáveis no topo do arquivo, dentro de `:root`:
- `--bg-dark` / `--text-dark`: cores do estado escuro inicial.
- `--bg-light` / `--text-light`: cores do estado claro revelado.
- `--accent`: cor da chave.

## Como alterar o título da aba

Em `index.html`, edite a tag `<title>`.

## Como testar

Abra `index.html` diretamente no navegador. Para ver o efeito, mude o tema do
**sistema operacional ou navegador** para claro enquanto a página estiver
aberta (no macOS/Windows/Android/iOS: Preferências do Sistema → Aparência;
em navegadores como o Safari/Firefox, o tema segue o sistema por padrão).

## Como publicar

Qualquer uma destas opções funciona, sem configuração adicional:

- **GitHub Pages**: crie um repositório, suba os arquivos desta pasta
  (`index.html`, `style.css`, `script.js`) e ative o Pages em
  Settings → Pages → Deploy from branch.
- **Netlify**: arraste esta pasta para app.netlify.com/drop.
- **Vercel**: `vercel` na pasta (via CLI) ou importe o repositório no
  painel da Vercel.
- **Cloudflare Pages**: conecte o repositório ou faça upload direto da pasta
  no painel do Cloudflare Pages.

Não há build step — os três arquivos já estão prontos para produção.
