const showdown = require('showdown');
const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

const color = 'slate';

const fileSystem = {
  mkdir: async (path) => {
    const result = await fs.mkdir(path);
    return result;
  },
  writeFile: async (path, content) => {
    const result = await fs.writeFile(path, content);
    return result;
  },
  readFile: async (path) => {
    const result = (await fs.readFile(path)).toString();
    return result;
  },
  copy: async (originalPath, destinationPath) => {
    const result = await fs.cp(
      originalPath,
      destinationPath,
      { recursive: true },
    );
    return result;
  },
  exists: (path) => {
    const result = require('fs').existsSync(path);
    return result;
  },
  pwd: (...sequencePaths) => {
    return path.resolve(__dirname, ...sequencePaths); 
  },
  readdir: async (path) => {
    const result = await fs.readdir(path); 
    return result;
  },
};

const makeMarkdownConverter = () => {
  const classMap = {
    h1: `text-2xl md:text-3xl text-${color}-50 font-medium`,
    h4: `text-${color}-400 mb-4 ml-2`,
    h2: `text-xl md:text-2xl text-${color}-50 font-medium mb-4`,
    p: `text-sm sm:text-base text-${color}-50 mb-4`,
  }
  const bindings = Object.keys(classMap)
    .map(key => ({
      type: 'output',
      regex: new RegExp(`<${key}(.*)>`, 'g'),
      replace: `<${key} class="${classMap[key]}" $1>`
    }));
  const converter = new showdown.Converter({
    extensions: [...bindings]
  });
  return converter;
};


const getDateConcatenation = (date) => {
  const forceLength = (text, length) => {
    let stringified = text; 
    if (typeof text !== 'string') {
      stringified = text.toString();
    }
    if (stringified.length < length) {
      const lengthToAdd = length - stringified.length;
      const stringifiedArr = stringified.split('');
      for (let index = 0; index < lengthToAdd; index++) {
        stringifiedArr.unshift('0');
      }
      stringified = stringifiedArr.join('');
    }
    return stringified;
  } 

  const dateConcatenation = `${
    forceLength(date.getFullYear(), 4)
  }${
    forceLength(date.getMonth() + 1, 2)
  }${
    forceLength(date.getDate(), 2)
  }${
    forceLength(date.getHours(), 2)
  }${
    forceLength(date.getMinutes(), 2)
  }`
  return dateConcatenation;
}


const createHomePage = async () => {
  const postsFolderNames = await fileSystem.readdir(fileSystem.pwd('posts'));
  const postsData = [];
  for (let index = 0; index < postsFolderNames.length; index++) {
    const data = JSON.parse(await fileSystem.readFile(
      fileSystem.pwd('posts', postsFolderNames[index], 'metadata.json')
    )); 
    postsData.push({ ...data, id: postsFolderNames[index] })
  }
  postsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let postsHtml = ``;
  for (let index = 0; index < postsData.length; index++) {
    postsHtml += `
      <a href="./posts/${postsData[index].id}/index.html" class="bg-${color}-900/75 h-fit xl:w-[67.5rem] w-[45rem] p-4 m-4">
        <div>
          <h2 class="md:text-2xl text-xl text-${color}-50 font-medium mb-2">${postsData[index].title}</h2>
          <p class="text-sm md:text-base text-${color}-50 mb-4">${postsData[index].description}</p>
          <p class="text-sm md:text-base text-${color}-400">${format(new Date(postsData[index].date), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })} | #${postsData[index].tags.join(' #')}</p>
        </div>
      </a>
    `;
  }
  const description = 'Um blog sobre tecnologia feito por uma pessoa qualquer.';
  const tags = [
    'tecnologia', 'blog', 'programação', 'desenvolvimento', 'vim', 'software',
  ];
  const html = `
    <!DOCTYPE html>
    <html class="h-full">
      <head>
        <title>Bloated - Home</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="${description}">
        <meta name="keywords" content="${tags.join(', ')}">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="h-full">
        <header class="bg-${color}-900 h-fit w-full flex items-center sticky top-0">
          <a href="./index.html" class="p-3">
            <h2 class="w-fit text-2xl font-medium text-${color}-50 rounded-md transition duration-300 ml-2 p-1 hover:bg-${color}-50 hover:text-${color}-900">Bloated</h2>
          </a>
        </header>
        <main class="bg-${color}-800 h-full flex flex-col items-center">
          ${postsHtml}
        </main>
        <footer class="bg-${color}-900 h-fit w-full flex items-center justify-center">
          <p class="w-fit text-l text-${color}-50 p-4">2023 by <a target="_blank" href="https://github.com/AndreyArthur" class="font-medium">@AndreyArthur</a></p>
        </footer>
      </body>
    </html>
  `;
  await fileSystem.writeFile(fileSystem.pwd('index.html'), html);
};

const createNewPost = async () => {
  const converter = makeMarkdownConverter();
  let content = await fileSystem.readFile(
    fileSystem.pwd('working', 'post.md'));
  const metadata = JSON.parse(await fileSystem.readFile(
    fileSystem.pwd('working', 'metadata.json')
  ));
  const date = new Date();
  content = `# ${metadata.title}\n\n#### ${format(date, 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}, ${metadata.author}\n\n${content}`
  content = `${content}\\#${metadata.tags.join(' #')}`
  const dateConcatenation = getDateConcatenation(date);
  const html = converter.makeHtml(content);
  const finalHtml = `
    <!DOCTYPE html>
    <html class="h-full">
      <head>
        <title>Bloated - ${metadata.title}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="${metadata.description}">
        <meta name="keywords" content="${metadata.tags.join(', ')}">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="h-full">
        <header class="bg-${color}-900 h-fit w-full flex items-center sticky top-0">
          <a href="../../index.html" class="p-3">
            <h2 class="w-fit text-2xl font-medium text-${color}-50 rounded-md transition duration-300 ml-2 p-1 hover:bg-${color}-50 hover:text-${color}-900">Bloated</h2>
          </a>
        </header>
        <main class="bg-${color}-800 h-full flex justify-center">
          <div class="bg-${color}-900/75 h-full xl:w-[67.5rem] w-[45rem] p-4">
          ${html}
          </div>
        </main>
        <footer class="bg-${color}-900 h-fit w-full flex items-center justify-center">
          <p class="w-fit text-l text-${color}-50 p-4">2023 by <a target="_blank" href="https://github.com/AndreyArthur" class="font-medium">@AndreyArthur</a></p>
        </footer>
      </body>
    </html>
  `;
  metadata.date = date.toISOString();
  if (!fileSystem.exists(fileSystem.pwd('posts'))) {
    await fileSystem.mkdir(fileSystem.pwd('posts'));
  } 
  const folderName = `${dateConcatenation}_${metadata.slug}`;
  await fileSystem.mkdir(fileSystem.pwd('posts', folderName));
  await fileSystem.writeFile(fileSystem.pwd('posts', folderName, 'index.html'), finalHtml);
  await fileSystem.writeFile(fileSystem.pwd('posts', folderName, 'post.md'), content);
  await fileSystem.writeFile(fileSystem.pwd('posts', folderName, 'metadata.json'), JSON.stringify(metadata, null, 2));
  await fileSystem.copy(fileSystem.pwd('working', 'assets'), fileSystem.pwd('posts', folderName, 'assets'), { recursive: true });
};

const main = async () => {
  const args = process.argv;
  if (args.includes('--only-home')) {
    await createHomePage();
    return;
  }
  await createHomePage();
  await createNewPost();
};

main();
