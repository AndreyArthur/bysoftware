# Como eu criei o meu blog?

#### 29 de janeiro de 2023, Andrey Arthur

## De onde surgiu a ideia?

Eu sempre quis ter um blog pessoal, onde eu pudesse postar sobre as coisas que eu aprendo no dia-a-dia e dar um pouco da minha opinião, mesmo talvez não seja tão relevante para a maioria das pessoas, seria interessante deixar registrado para o eu do futuro. O mas eu nunca fiquei satisfeito com as opções que eu tinha, cheguei a postar algumas coisas no Medium mas o plano padrão deles deixava meu conteúdo como não listado, então eu criei o blog eu mesmo.

## Porque um blog de arquivos estáticos?

Como usuário de Vim, eu sinto uma dor enorme em escrever texto em qualquer outro editor que não dê suporte a pelo menos uma emulação do Vim. Quando eu não tenho essa opção, geralmente opto por escrever as coisas no Vim e colar onde eu preciso enviar. Mas caso eu possa ficar dentro do Vim 100% do tempo eu irei fazê-lo

Para mim é muito vantajoso que eu possa simplesmente dar um push e ter o post online, sem ter que pagar por hospedagem e etc. Então nesse caso o GitHub Pages é o meu melhor amigo. Eu faço tudo o que eu preciso dentro do vim e tenho meus posts online sem nenhuma complicação.

## Como funciona por baixo do capô?

No repositório Git do blog tem uma pasta ignorada chamada "working" é lá que eu coloco os arquivos `metadata.json` e `post.md`. O arquivo `metadata.json` guarda informações como título, descrição e tags do post, enquanto o `post.md` guarda o conteúdo do post em si, além da pasta `assets`, que guarda as imagens e outros conteúdos referenciados no post.

Esses arquivos são preservados após o processo de "compilação" do conteúdo onde é gerado o html e o conteúdo é injetado nele. A compilação pode ser feita com o comando um `npm run compile`, que roda o script `compiler.js`. Este que compila o conteúdo novo e recompila a home page com todos os posts ordenados pela data de postagem. Depois de todo esse processo é só commitar e dar push que o post já está no ar.

## Poderia ser melhor!

Sim, eu poderia guardar os posts em um banco de dados, ou em uma cdn, entre outras coisas, mas eu perderia tudo aquilo que me fez criar esse blog. Eu ficaria refém desses serviços de cloud talvez tendo que pagar para ter o blog online, caso o GitHub Pages venha a não existir futuramente eu continuo tendo o repositório com todos os meus posts, podendo trabalhá-los à minha própria vontade de outras formas ou com outros serviços.

## É só o início.

Talvez eu não tenha redigido esse texto tão bem, talvez tenha ficado pessoal demais, sei lá. Mas se eu não tentasse eu não acertaria nunca também! Errar faz parte do processo e tenho certeza que eu irei aprender ao longo do caminho, esse foi o primeiro post do blog, desde já agradeço a todos os possíveis leitores!

\#software #blog #markdown #first-post